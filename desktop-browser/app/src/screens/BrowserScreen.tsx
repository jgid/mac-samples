import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAgent } from '../core/agents';
import { findPreset, formatResolution, formatScale } from '../core/resolution';
import { hostOf } from '../core/url';
import { useAppState } from '../state/AppState';
import type { InputMode, NavigationInfo, Resolution, ScaleMode, ScreenshotMeta, ViewportGeometry } from '../types';
import { AddressBar } from '../ui/AddressBar';
import { BookmarksSheet } from '../ui/BookmarksSheet';
import { InfoCard } from '../ui/InfoCard';
import { OnboardingSheet } from '../ui/OnboardingSheet';
import { ResolutionSheet } from '../ui/ResolutionSheet';
import { SettingsSheet } from '../ui/SettingsSheet';
import { SizeChip } from '../ui/SizeChip';
import { HIT, spacing, useTheme } from '../ui/theme';
import { Toast } from '../ui/Toast';
import type { ToastData } from '../ui/Toast';
import { Toolbar } from '../ui/Toolbar';
import { TrackpadHint } from '../ui/TrackpadHint';
import { DesktopViewport } from '../viewport/DesktopViewport';
import type { DesktopViewportHandle } from '../viewport/DesktopViewport';
import { describeScreenshot, shareScreenshot } from '../viewport/screenshot';

type SheetId = 'resolution' | 'settings' | 'bookmarks';

/** From this width on, landscape makes the virtual monitor much more readable. */
const LANDSCAPE_HINT_WIDTH = 1440;

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function resolutionLabel(r: Resolution): string {
  return findPreset(r)?.label ?? 'Eigene Größe';
}

export function BrowserScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dims = useWindowDimensions();
  const { settings, siteProfiles, hints, updateSettings, setSiteProfile, setHint } = useAppState();

  const viewportRef = useRef<DesktopViewportHandle>(null);
  const [initialUrl] = useState(settings.homeUrl);
  const [nav, setNav] = useState<NavigationInfo>({
    url: initialUrl,
    title: '',
    canGoBack: false,
    canGoForward: false,
    loading: true,
    progress: 0,
  });
  const [geometry, setGeometry] = useState<ViewportGeometry | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('touch');
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [sheet, setSheet] = useState<SheetId | null>(null);
  const [introOpen, setIntroOpen] = useState(!settings.onboardingDone);
  const [trackpadHintOpen, setTrackpadHintOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastId = useRef(0);

  const agent = useMemo(() => getAgent(settings.agentId), [settings.agentId]);

  // Site profile of the current host overrides the global size settings.
  const host = useMemo(() => hostOf(nav.url), [nav.url]);
  const profile = host ? siteProfiles[host] : undefined;
  const resolution: Resolution = profile?.resolution ?? settings.resolution;
  const scaleMode: ScaleMode = profile?.scaleMode ?? settings.scaleMode;

  const showToast = useCallback((data: Omit<ToastData, 'id'>) => {
    toastId.current += 1;
    setToast({ ...data, id: toastId.current });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  // Announce automatically applied site profiles when the host changes.
  const lastHost = useRef<string | null>(null);
  useEffect(() => {
    if (host === lastHost.current) return;
    lastHost.current = host;
    const p = host ? siteProfiles[host] : undefined;
    if (host && p) {
      showToast({ message: `Profil für ${host}: ${findPreset(p.resolution)?.label ?? formatResolution(p.resolution)}` });
    }
    // Only react to navigation, not to profile edits on the same host.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host]);

  // ---- Navigation ----
  const navigate = useCallback((url: string) => {
    setError(null);
    viewportRef.current?.load(url);
  }, []);
  const goBack = useCallback(() => viewportRef.current?.goBack(), []);
  const goForward = useCallback(() => viewportRef.current?.goForward(), []);
  const reload = useCallback(() => {
    setError(null);
    viewportRef.current?.reload();
  }, []);
  const stop = useCallback(() => viewportRef.current?.stop(), []);

  // ---- Mouse mode ----
  const toggleMouse = useCallback(() => {
    const next: InputMode = inputMode === 'mouse' ? 'touch' : 'mouse';
    setInputMode(next);
    Haptics.selectionAsync().catch(() => undefined);
    if (next === 'mouse' && !hints.trackpadHintSeen) setTrackpadHintOpen(true);
  }, [inputMode, hints.trackpadHintSeen]);

  const dismissTrackpadHint = useCallback(() => {
    setTrackpadHintOpen(false);
    setHint('trackpadHintSeen');
  }, [setHint]);

  // ---- Screenshot ----
  const buildMeta = useCallback(
    (): ScreenshotMeta => ({
      url: nav.url,
      title: nav.title,
      resolution: geometry ? { width: geometry.cssWidth, height: geometry.cssHeight } : resolution,
      agentLabel: agent.label,
      takenAt: new Date(),
    }),
    [nav.url, nav.title, geometry, resolution, agent.label],
  );

  const copyInfo = useCallback(
    async (meta: ScreenshotMeta) => {
      try {
        await Clipboard.setStringAsync(describeScreenshot(meta));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        showToast({ message: 'Info kopiert' });
      } catch (e) {
        Alert.alert('Kopieren nicht möglich', errorText(e));
      }
    },
    [showToast],
  );

  const takeScreenshot = useCallback(async () => {
    const viewport = viewportRef.current;
    if (capturing || !viewport) return;
    setCapturing(true);
    const meta = buildMeta();
    let uri: string;
    try {
      uri = await viewport.captureScreenshot(meta);
    } catch (e) {
      setCapturing(false);
      Alert.alert('Screenshot fehlgeschlagen', `Die Seite konnte nicht aufgenommen werden.\n\n${errorText(e)}`);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    try {
      await shareScreenshot(uri, meta);
      showToast({ message: 'Screenshot erstellt', action: { label: 'Info kopieren', onPress: () => void copyInfo(meta) } });
    } catch (e) {
      Alert.alert('Teilen nicht möglich', errorText(e));
    } finally {
      setCapturing(false);
    }
  }, [capturing, buildMeta, showToast, copyInfo]);

  const copyPageInfo = useCallback(() => {
    setSheet(null);
    void copyInfo(buildMeta());
  }, [copyInfo, buildMeta]);

  // ---- Size / profile ----
  const selectResolution = useCallback(
    (r: Resolution) => {
      Haptics.selectionAsync().catch(() => undefined);
      if (host && profile) setSiteProfile(host, { ...profile, resolution: r });
      else updateSettings({ resolution: r });
    },
    [host, profile, setSiteProfile, updateSettings],
  );

  const selectScaleMode = useCallback(
    (mode: ScaleMode) => {
      Haptics.selectionAsync().catch(() => undefined);
      if (host && profile) setSiteProfile(host, { ...profile, scaleMode: mode });
      else updateSettings({ scaleMode: mode });
    },
    [host, profile, setSiteProfile, updateSettings],
  );

  const toggleProfile = useCallback(
    (remember: boolean) => {
      if (!host) return;
      setSiteProfile(host, remember ? { host, resolution, scaleMode } : null);
    },
    [host, resolution, scaleMode, setSiteProfile],
  );

  // ---- Fullscreen & landscape hint ----
  const enterFullscreen = useCallback(() => setFullscreen(true), []);
  const exitFullscreen = useCallback(() => setFullscreen(false), []);

  const portrait = dims.height > dims.width;
  const landscapeHintVisible =
    !hints.landscapeHintSeen && settings.onboardingDone && !introOpen && portrait && resolution.width >= LANDSCAPE_HINT_WIDTH;
  const landscapeHintShown = useRef(false);
  useEffect(() => {
    if (landscapeHintVisible) landscapeHintShown.current = true;
    // User rotated after seeing the tip: it did its job.
    else if (landscapeHintShown.current && !portrait) setHint('landscapeHintSeen');
  }, [landscapeHintVisible, portrait, setHint]);
  const dismissLandscapeHint = useCallback(() => setHint('landscapeHintSeen'), [setHint]);

  // ---- Onboarding ----
  const finishIntro = useCallback(() => {
    setIntroOpen(false);
    if (!settings.onboardingDone) updateSettings({ onboardingDone: true });
  }, [settings.onboardingDone, updateSettings]);
  const showIntro = useCallback(() => setIntroOpen(true), []);

  const closeSheet = useCallback(() => setSheet(null), []);
  const openResolution = useCallback(() => setSheet('resolution'), []);
  const openSettings = useCallback(() => setSheet('settings'), []);
  const openBookmarks = useCallback(() => setSheet('bookmarks'), []);

  const sizeText = geometry
    ? `${formatResolution({ width: geometry.cssWidth, height: geometry.cssHeight })} · ${formatScale(geometry.scale)}`
    : formatResolution(resolution);

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: fullscreen ? colors.viewportBackground : colors.chrome,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <StatusBar hidden={fullscreen} style="auto" animated />

      {!fullscreen ? (
        <AddressBar
          url={nav.url}
          loading={nav.loading}
          progress={nav.progress}
          searchEngine={settings.searchEngine}
          onNavigate={navigate}
          onReload={reload}
          onStop={stop}
        />
      ) : null}

      <View style={[styles.viewport, { backgroundColor: colors.viewportBackground }]}>
        <DesktopViewport
          ref={viewportRef}
          initialUrl={initialUrl}
          resolution={resolution}
          scaleMode={scaleMode}
          agent={agent}
          desktopMode={settings.desktopMode}
          inputMode={inputMode}
          screenshotInfoBar={settings.screenshotInfoBar}
          onNavigation={setNav}
          onGeometry={setGeometry}
          onError={setError}
        />

        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <SizeChip
            label={resolutionLabel(resolution)}
            sizeText={sizeText}
            profileActive={!!profile}
            autoHide={fullscreen}
            onPress={openResolution}
          />

          {error ? (
            <View style={styles.center} pointerEvents="box-none">
              <InfoCard
                icon="cloud-offline-outline"
                tone="error"
                title="Seite konnte nicht geladen werden"
                message={error}
                onClose={() => setError(null)}
                actions={[{ label: 'Erneut versuchen', onPress: reload, primary: true }]}
                style={styles.card}
              />
            </View>
          ) : null}

          {landscapeHintVisible && !error && !toast ? (
            <View style={styles.bottom} pointerEvents="box-none">
              <InfoCard
                icon="phone-landscape-outline"
                title="Tipp: Dreh dein iPhone quer"
                message="So wirkt der große Bildschirm natürlicher und Text wird größer."
                onClose={dismissLandscapeHint}
                style={styles.card}
              />
            </View>
          ) : null}

          <Toast toast={toast} onHide={hideToast} />
        </View>

        {fullscreen ? (
          <Pressable
            onPress={exitFullscreen}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Vollbild beenden"
            style={[styles.exitFullscreen, { backgroundColor: colors.chipBackground }]}
          >
            <Ionicons name="contract-outline" size={20} color={colors.chipText} />
          </Pressable>
        ) : null}
      </View>

      {!fullscreen ? (
        <View style={{ backgroundColor: colors.chrome, paddingBottom: Math.max(insets.bottom - spacing.sm, spacing.xs) }}>
          <Toolbar
            canGoBack={nav.canGoBack}
            canGoForward={nav.canGoForward}
            inputMode={inputMode}
            capturing={capturing}
            onBack={goBack}
            onForward={goForward}
            onToggleMouse={toggleMouse}
            onScreenshot={takeScreenshot}
            onBookmarks={openBookmarks}
            onFullscreen={enterFullscreen}
            onMore={openSettings}
          />
        </View>
      ) : null}

      {trackpadHintOpen ? <TrackpadHint onDismiss={dismissTrackpadHint} /> : null}

      <ResolutionSheet
        visible={sheet === 'resolution'}
        onClose={closeSheet}
        resolution={resolution}
        scaleMode={scaleMode}
        host={host}
        profileActive={!!profile}
        onSelectResolution={selectResolution}
        onSelectScaleMode={selectScaleMode}
        onToggleProfile={toggleProfile}
      />
      <SettingsSheet
        visible={sheet === 'settings'}
        onClose={closeSheet}
        currentUrl={nav.url}
        onOpenUrl={navigate}
        onCopyPageInfo={copyPageInfo}
        onShowIntro={showIntro}
      />
      <BookmarksSheet
        visible={sheet === 'bookmarks'}
        onClose={closeSheet}
        currentUrl={nav.url}
        currentTitle={nav.title}
        onOpen={navigate}
      />
      <OnboardingSheet visible={introOpen && sheet === null} onDone={finishIntro} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  viewport: { flex: 1, overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: spacing.lg, alignItems: 'center', paddingHorizontal: spacing.lg },
  card: { width: '100%', maxWidth: 420 },
  exitFullscreen: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: HIT,
    height: HIT,
    borderRadius: HIT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
