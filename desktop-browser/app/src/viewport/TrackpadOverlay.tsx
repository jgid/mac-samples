import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import { mouse } from '../core/injected';
import type { ViewportGeometry } from '../types';

const ACCELERATION = 1.2;
const SEND_INTERVAL_MS = 32;
const TAP_SLOP_PT = 8;
const LONG_PRESS_MS = 500;
const CURSOR_SIZE = 26;

type IconName = 'cursor-default' | 'hand-pointing-up' | 'cursor-text';

/** Icon plus its hotspot (fraction of the glyph box) for a CSS cursor value. */
function cursorIcon(cursor: string): { name: IconName; hx: number; hy: number } {
  if (cursor === 'pointer') return { name: 'hand-pointing-up', hx: 0.42, hy: 0.1 };
  if (cursor === 'text' || cursor === 'vertical-text') return { name: 'cursor-text', hx: 0.5, hy: 0.5 };
  return { name: 'cursor-default', hx: 0.27, hy: 0.1 };
}

export interface TrackpadOverlayProps {
  geometry: ViewportGeometry;
  /** CSS cursor reported by the page ('default', 'pointer', 'text', …). */
  cursor: string;
  /** Runs a script in the page (webRef.injectJavaScript). */
  inject(script: string): void;
}

interface Point {
  x: number;
  y: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function centroid(evt: GestureResponderEvent): Point {
  const t = evt.nativeEvent.touches;
  const n = Math.min(t.length, 2);
  let x = 0;
  let y = 0;
  for (let i = 0; i < n; i++) {
    x += t[i].pageX;
    y += t[i].pageY;
  }
  return { x: x / n, y: y / n };
}

/** Transparent gesture layer that turns touches into virtual mouse input. */
export function TrackpadOverlay({ geometry, cursor, inject }: TrackpadOverlayProps) {
  const geoRef = useRef(geometry);
  geoRef.current = geometry;
  const injectRef = useRef(inject);
  injectRef.current = inject;

  // Cursor position in CSS px.
  const pos = useRef<Point>({ x: geometry.cssWidth / 2, y: geometry.cssHeight / 2 });
  const screenX = useRef(new Animated.Value(0)).current;
  const screenY = useRef(new Animated.Value(0)).current;

  const updateScreenPos = () => {
    const g = geoRef.current;
    screenX.setValue(g.offsetX + pos.current.x * g.scale);
    screenY.setValue(g.offsetY + pos.current.y * g.scale);
  };

  // Keep the cursor inside the screen when the geometry changes.
  useEffect(() => {
    pos.current = {
      x: clamp(pos.current.x, 0, geometry.cssWidth - 1),
      y: clamp(pos.current.y, 0, geometry.cssHeight - 1),
    };
    updateScreenPos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry.cssWidth, geometry.cssHeight, geometry.scale, geometry.offsetX, geometry.offsetY]);

  // Throttled sending of move/scroll commands.
  const sender = useRef({
    lastSent: 0,
    timer: null as ReturnType<typeof setTimeout> | null,
    movePending: false,
    scrollDx: 0,
    scrollDy: 0,
  }).current;

  const flush = () => {
    if (sender.timer) {
      clearTimeout(sender.timer);
      sender.timer = null;
    }
    sender.lastSent = Date.now();
    const { x, y } = pos.current;
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (sender.movePending) {
      sender.movePending = false;
      injectRef.current(mouse.move(rx, ry));
    }
    if (sender.scrollDx !== 0 || sender.scrollDy !== 0) {
      const dx = sender.scrollDx;
      const dy = sender.scrollDy;
      sender.scrollDx = 0;
      sender.scrollDy = 0;
      injectRef.current(mouse.scroll(rx, ry, dx, dy));
    }
  };

  const schedule = () => {
    const wait = SEND_INTERVAL_MS - (Date.now() - sender.lastSent);
    if (wait <= 0) flush();
    else if (!sender.timer) sender.timer = setTimeout(flush, wait);
  };

  const gesture = useRef({
    startTime: 0,
    moved: false,
    twoFinger: false,
    longPressFired: false,
    longPressTimer: null as ReturnType<typeof setTimeout> | null,
    last: null as Point | null,
    lastTouchCount: 0,
  }).current;

  const clearLongPress = () => {
    if (gesture.longPressTimer) {
      clearTimeout(gesture.longPressTimer);
      gesture.longPressTimer = null;
    }
  };

  useEffect(
    () => () => {
      clearLongPress();
      if (sender.timer) clearTimeout(sender.timer);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          gesture.startTime = Date.now();
          gesture.moved = false;
          gesture.longPressFired = false;
          gesture.last = centroid(evt);
          gesture.lastTouchCount = evt.nativeEvent.touches.length;
          // Both fingers can land in the same event: then it is a scroll, never a tap/long press.
          gesture.twoFinger = gesture.lastTouchCount >= 2;
          clearLongPress();
          gesture.longPressTimer = setTimeout(() => {
            gesture.longPressTimer = null;
            if (gesture.moved || gesture.twoFinger) return;
            gesture.longPressFired = true;
            flush();
            const { x, y } = pos.current;
            injectRef.current(mouse.contextMenu(Math.round(x), Math.round(y)));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          }, LONG_PRESS_MS);
        },
        onPanResponderMove: (evt: GestureResponderEvent, gs: PanResponderGestureState) => {
          const count = evt.nativeEvent.touches.length;
          if (count === 0) return;
          const c = centroid(evt);
          // Touch count changed: restart delta tracking to avoid centroid jumps.
          if (count !== gesture.lastTouchCount || !gesture.last) {
            gesture.lastTouchCount = count;
            gesture.last = c;
            if (count >= 2) {
              gesture.twoFinger = true;
              clearLongPress();
            }
            return;
          }
          const dx = c.x - gesture.last.x;
          const dy = c.y - gesture.last.y;
          gesture.last = c;
          if (!gesture.moved && Math.hypot(gs.dx, gs.dy) > TAP_SLOP_PT) {
            gesture.moved = true;
            clearLongPress();
          }
          const g = geoRef.current;
          if (count >= 2) {
            sender.scrollDx += -dx / g.scale;
            sender.scrollDy += -dy / g.scale;
            schedule();
            return;
          }
          // Lifting one finger after a scroll should not jump the cursor.
          if (gesture.twoFinger || gesture.longPressFired) return;
          pos.current = {
            x: clamp(pos.current.x + (dx / g.scale) * ACCELERATION, 0, g.cssWidth - 1),
            y: clamp(pos.current.y + (dy / g.scale) * ACCELERATION, 0, g.cssHeight - 1),
          };
          updateScreenPos();
          sender.movePending = true;
          schedule();
        },
        onPanResponderRelease: () => {
          clearLongPress();
          flush();
          const isTap =
            !gesture.twoFinger &&
            !gesture.moved &&
            !gesture.longPressFired &&
            Date.now() - gesture.startTime < LONG_PRESS_MS;
          if (isTap) {
            const { x, y } = pos.current;
            injectRef.current(mouse.click(Math.round(x), Math.round(y)));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          }
          gesture.last = null;
        },
        onPanResponderTerminate: () => {
          clearLongPress();
          flush();
          gesture.last = null;
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const icon = cursorIcon(cursor);
  const hx = icon.hx * CURSOR_SIZE;
  const hy = icon.hy * CURSOR_SIZE;

  return (
    <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cursor,
          {
            transform: [
              { translateX: Animated.subtract(screenX, hx) },
              { translateY: Animated.subtract(screenY, hy) },
            ],
          },
        ]}
      >
        {OUTLINE_OFFSETS.map(([ox, oy]) => (
          <MaterialCommunityIcons
            key={`${ox},${oy}`}
            name={icon.name}
            size={CURSOR_SIZE}
            color="#fff"
            style={[styles.layer, { left: ox, top: oy }]}
          />
        ))}
        <MaterialCommunityIcons name={icon.name} size={CURSOR_SIZE} color="#000" style={styles.fill} />
      </Animated.View>
    </View>
  );
}

const OUTLINE_OFFSETS: [number, number][] = [
  [-1.5, 0],
  [1.5, 0],
  [0, -1.5],
  [0, 1.5],
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
];

const styles = StyleSheet.create({
  cursor: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  layer: {
    position: 'absolute',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
