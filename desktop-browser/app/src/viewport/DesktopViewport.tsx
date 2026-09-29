import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, Linking, PixelRatio, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { WebView } from 'react-native-webview';
import type {
  ShouldStartLoadRequest,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewMessageEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { buildBeforeContentScript, buildInfoRequestCall, buildScreenUpdateCall, mouse } from '../core/injected';
import { computeGeometry } from '../core/resolution';
import { TEST_PAGE_HTML } from '../core/testPage';
import { TEST_PAGE_URL } from '../core/url';
import type {
  AgentProfile,
  InputMode,
  NavigationInfo,
  PageMessage,
  Resolution,
  ScaleMode,
  ScreenshotMeta,
  ViewportGeometry,
} from '../types';
import { INFO_BAR_HEIGHT, InfoBar } from './InfoBar';
import { TrackpadOverlay } from './TrackpadOverlay';

export interface DesktopViewportHandle {
  /** Loads a URL; TEST_PAGE_URL renders the built-in test page. */
  load(url: string): void;
  goBack(): void;
  goForward(): void;
  reload(): void;
  stop(): void;
  /** Captures the virtual screen at its real CSS size (plus info bar if enabled); returns a file URI. */
  captureScreenshot(meta: ScreenshotMeta): Promise<string>;
}

export interface DesktopViewportProps {
  initialUrl: string;
  resolution: Resolution;
  scaleMode: ScaleMode;
  agent: AgentProfile;
  desktopMode: boolean;
  inputMode: InputMode;
  /** Render the info bar below the page while capturing screenshots. */
  screenshotInfoBar: boolean;
  onNavigation(info: NavigationInfo): void;
  onGeometry?(geometry: ViewportGeometry): void;
  onPageMessage?(message: PageMessage): void;
  /** Error text for failed loads, null when cleared. */
  onError?(message: string | null): void;
}

type Source = { uri: string } | { html: string; baseUrl: string };

const TEST_PAGE_HOST = 'deskview.local';
const TEST_PAGE_BASE = `https://${TEST_PAGE_HOST}/`;
const ALLOWED_SCHEMES = new Set(['http', 'https', 'about', 'data', 'blob', 'file']);
// NSURLErrorCancelled, WebKitErrorFrameLoadInterruptedByPolicyChange
const IGNORED_ERROR_CODES = new Set([-999, 102]);

function testPageSource(nonce: number): Source {
  return { html: TEST_PAGE_HTML, baseUrl: nonce === 0 ? TEST_PAGE_BASE : `${TEST_PAGE_BASE}?r=${nonce}` };
}

function sourceFor(url: string): Source {
  return url === TEST_PAGE_URL ? testPageSource(0) : { uri: url };
}

function isTestPageUrl(url: string): boolean {
  return url.startsWith(TEST_PAGE_BASE) || url === `https://${TEST_PAGE_HOST}`;
}

/** Maps the WebView's URL to the URL shown to the app (test page → TEST_PAGE_URL). */
function publicUrl(url: string): string {
  return isTestPageUrl(url) ? TEST_PAGE_URL : url;
}

function schemeOf(url: string): string {
  const i = url.indexOf(':');
  return i > 0 ? url.slice(0, i).toLowerCase() : '';
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export const DesktopViewport = forwardRef<DesktopViewportHandle, DesktopViewportProps>(function DesktopViewport(
  {
    initialUrl,
    resolution,
    scaleMode,
    agent,
    desktopMode,
    inputMode,
    screenshotInfoBar,
    onNavigation,
    onGeometry,
    onPageMessage,
    onError,
  },
  ref,
) {
  const webRef = useRef<WebView>(null);
  const screenRef = useRef<View>(null);

  const [container, setContainer] = useState<{ width: number; height: number } | null>(null);
  const [source, setSource] = useState<Source>(() => sourceFor(initialUrl));
  const sourceRef = useRef(source);
  sourceRef.current = source;
  const testNonce = useRef(0);
  const [cursor, setCursor] = useState('default');
  const [infoMeta, setInfoMeta] = useState<ScreenshotMeta | null>(null);

  const nav = useRef<NavigationInfo>({
    url: initialUrl,
    title: '',
    canGoBack: false,
    canGoForward: false,
    loading: true,
    progress: 0,
  });

  // Keep latest callbacks without re-creating handlers.
  const cb = useRef({ onNavigation, onGeometry, onPageMessage, onError });
  cb.current = { onNavigation, onGeometry, onPageMessage, onError };

  const geometry = useMemo<ViewportGeometry | null>(
    () => (container ? computeGeometry(container.width, container.height, resolution, scaleMode) : null),
    [container, resolution, scaleMode],
  );
  const geoRef = useRef(geometry);
  geoRef.current = geometry;

  const cssWidth = geometry?.cssWidth ?? 0;
  const cssHeight = geometry?.cssHeight ?? 0;

  const inject = useCallback((script: string) => {
    webRef.current?.injectJavaScript(script);
  }, []);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainer((prev) =>
      prev && Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5 ? prev : { width, height },
    );
  }, []);

  useEffect(() => {
    if (geometry) cb.current.onGeometry?.(geometry);
  }, [geometry]);

  // Script for future loads; changing it does not reload the page.
  const beforeContentScript = useMemo(
    () =>
      cssWidth > 0
        ? buildBeforeContentScript({ screen: { width: cssWidth, height: cssHeight }, agent, desktopMode })
        : '',
    [cssWidth, cssHeight, agent, desktopMode],
  );

  // Size change: update the spoofed screen of the current page in place.
  const lastSize = useRef<string | null>(null);
  useEffect(() => {
    if (cssWidth <= 0) return;
    const key = `${cssWidth}x${cssHeight}`;
    if (lastSize.current !== null && lastSize.current !== key) {
      inject(buildScreenUpdateCall({ width: cssWidth, height: cssHeight }) + buildInfoRequestCall());
    }
    lastSize.current = key;
  }, [cssWidth, cssHeight, inject]);

  // Agent / desktop mode change: needs a reload so the new UA and script apply from the start.
  // (iOS WKWebView does not reload by itself when customUserAgent changes.)
  const envKey = `${agent.id}|${agent.userAgent}|${desktopMode}`;
  const lastEnv = useRef(envKey);
  useEffect(() => {
    if (lastEnv.current === envKey) return;
    lastEnv.current = envKey;
    // Give the native side a moment to receive the new props before reloading.
    const t = setTimeout(() => webRef.current?.reload(), 60);
    return () => clearTimeout(t);
  }, [envKey]);

  // Leaving mouse mode: drop hover state in the page.
  const lastMode = useRef(inputMode);
  useEffect(() => {
    if (lastMode.current === 'mouse' && inputMode !== 'mouse') {
      inject(mouse.leave());
      setCursor('default');
    }
    lastMode.current = inputMode;
  }, [inputMode, inject]);

  const emitNav = useCallback((patch: Partial<NavigationInfo>) => {
    nav.current = { ...nav.current, ...patch };
    cb.current.onNavigation(nav.current);
  }, []);

  const load = useCallback(
    (url: string) => {
      const current = nav.current.url;
      if (url === current) {
        webRef.current?.reload();
        return;
      }
      if (url === TEST_PAGE_URL) {
        // Source may still be the test page while the WebView navigated elsewhere; vary baseUrl to force a load.
        testNonce.current += 1;
        setSource(testPageSource(testNonce.current));
        return;
      }
      const prev = sourceRef.current;
      if ('uri' in prev && prev.uri === url) {
        // Same source prop would be a no-op natively; navigate from inside the page instead.
        inject(`window.location.href = ${JSON.stringify(url)}; true;`);
        return;
      }
      setSource({ uri: url });
    },
    [inject],
  );

  useImperativeHandle(
    ref,
    (): DesktopViewportHandle => ({
      load,
      goBack: () => webRef.current?.goBack(),
      goForward: () => webRef.current?.goForward(),
      reload: () => webRef.current?.reload(),
      stop: () => {
        webRef.current?.stopLoading();
        emitNav({ loading: false });
      },
      captureScreenshot: async (meta: ScreenshotMeta) => {
        const g = geoRef.current;
        if (!g) throw new Error('Viewport ist noch nicht bereit.');
        const barHeight = screenshotInfoBar ? INFO_BAR_HEIGHT : 0;
        if (barHeight > 0) setInfoMeta(meta);
        try {
          await nextFrame();
          await nextFrame();
          // view-shot sizes are in points and rendered at device scale; divide to get CSS px output.
          const ratio = PixelRatio.get();
          const uri = await captureRef(screenRef, {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
            width: g.cssWidth / ratio,
            height: (g.cssHeight + barHeight) / ratio,
          });
          return uri.startsWith('/') ? `file://${uri}` : uri;
        } finally {
          if (barHeight > 0) setInfoMeta(null);
        }
      },
    }),
    [load, emitNav, screenshotInfoBar],
  );

  const handleShouldStart = useCallback(
    (req: ShouldStartLoadRequest): boolean => {
      const scheme = schemeOf(req.url);
      if (ALLOWED_SCHEMES.has(scheme)) return true;
      const topFrame = (req as ShouldStartLoadRequest & { isTopFrame?: boolean }).isTopFrame !== false;
      if (req.url === TEST_PAGE_URL) {
        if (topFrame) load(TEST_PAGE_URL);
        return false;
      }
      if (topFrame && scheme) Linking.openURL(req.url).catch(() => {});
      return false;
    },
    [load],
  );

  const handleLoadStart = useCallback(
    (e: WebViewNavigationEvent) => {
      cb.current.onError?.(null);
      const n = e.nativeEvent;
      emitNav({ url: publicUrl(n.url), loading: true, progress: Math.max(0.05, nav.current.loading ? nav.current.progress : 0) });
    },
    [emitNav],
  );

  const handleProgress = useCallback(
    (e: WebViewProgressEvent) => {
      const n = e.nativeEvent;
      emitNav({
        progress: n.progress,
        canGoBack: n.canGoBack,
        canGoForward: n.canGoForward,
        loading: n.progress < 1,
      });
    },
    [emitNav],
  );

  const handleLoadEnd = useCallback(
    (e: WebViewNavigationEvent | WebViewErrorEvent) => {
      const n = e.nativeEvent;
      emitNav({
        url: publicUrl(n.url),
        title: n.title || nav.current.title,
        canGoBack: n.canGoBack,
        canGoForward: n.canGoForward,
        loading: false,
        progress: 1,
      });
    },
    [emitNav],
  );

  const handleStateChange = useCallback(
    (n: WebViewNavigation) => {
      emitNav({
        url: publicUrl(n.url),
        title: n.title ?? nav.current.title,
        canGoBack: n.canGoBack,
        canGoForward: n.canGoForward,
        loading: n.loading,
      });
    },
    [emitNav],
  );

  const handleError = useCallback((e: WebViewErrorEvent) => {
    const { code, description } = e.nativeEvent;
    if (IGNORED_ERROR_CODES.has(code)) return;
    cb.current.onError?.(description || `Fehler ${code}`);
  }, []);

  const handleHttpError = useCallback((e: WebViewHttpErrorEvent) => {
    const { statusCode, description } = e.nativeEvent;
    cb.current.onError?.(`HTTP ${statusCode}${description ? ` – ${description}` : ''}`);
  }, []);

  const handleMessage = useCallback((e: WebViewMessageEvent) => {
    let msg: PageMessage;
    try {
      msg = JSON.parse(e.nativeEvent.data) as PageMessage;
    } catch {
      return;
    }
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') return;
    if (msg.type === 'cursor') setCursor(msg.cursor || 'default');
    cb.current.onPageMessage?.(msg);
  }, []);

  // Recover from WebContent process crashes (memory pressure with very large viewports).
  const handleTerminate = useCallback(() => webRef.current?.reload(), []);

  const screenHeight = cssHeight + (infoMeta ? INFO_BAR_HEIGHT : 0);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {geometry && (
        <View
          ref={screenRef}
          collapsable={false}
          style={[
            styles.screen,
            {
              left: geometry.offsetX,
              top: geometry.offsetY,
              width: cssWidth,
              height: screenHeight,
              transform: [{ scale: geometry.scale }],
              transformOrigin: 'top left',
            },
          ]}
        >
          <WebView
            ref={webRef}
            style={[styles.web, { width: cssWidth, height: cssHeight }]}
            containerStyle={{ width: cssWidth, height: cssHeight, flex: 0 }}
            source={source}
            userAgent={agent.userAgent}
            contentMode="desktop"
            injectedJavaScriptBeforeContentLoaded={beforeContentScript}
            injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
            allowsBackForwardNavigationGestures={inputMode === 'touch'}
            allowsInlineMediaPlayback
            sharedCookiesEnabled
            keyboardDisplayRequiresUserAction={false}
            allowsLinkPreview={false}
            webviewDebuggingEnabled
            setSupportMultipleWindows={false}
            originWhitelist={['*']}
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            decelerationRate="normal"
            onShouldStartLoadWithRequest={handleShouldStart}
            onLoadStart={handleLoadStart}
            onLoadProgress={handleProgress}
            onLoadEnd={handleLoadEnd}
            onNavigationStateChange={handleStateChange}
            onError={handleError}
            onHttpError={handleHttpError}
            onMessage={handleMessage}
            onContentProcessDidTerminate={handleTerminate}
          />
          {infoMeta && <InfoBar meta={infoMeta} width={cssWidth} />}
        </View>
      )}
      {geometry && inputMode === 'mouse' && <TrackpadOverlay geometry={geometry} cursor={cursor} inject={inject} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  screen: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  web: {
    flex: 0,
    backgroundColor: '#fff',
  },
});
