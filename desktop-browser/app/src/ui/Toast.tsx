import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { fontSize, radius, spacing, useTheme } from './theme';

export interface ToastData {
  id: number;
  message: string;
  action?: { label: string; onPress(): void };
  /** Milliseconds; default 2600, longer when an action is present. */
  duration?: number;
}

/** Small transient message; parent removes it via onHide. */
export function Toast({ toast, onHide }: { toast: ToastData | null; onHide(): void }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const ms = toast.duration ?? (toast.action ? 5000 : 2600);
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => onHide());
    }, ms);
    return () => clearTimeout(timer);
  }, [toast, opacity, onHide]);

  if (!toast) return null;
  return (
    <Animated.View
      style={[styles.toast, { opacity, backgroundColor: colors.chipBackground }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Text style={[styles.text, { color: colors.chipText }]}>{toast.message}</Text>
      {toast.action ? (
        <Pressable
          onPress={() => {
            toast.action?.onPress();
            onHide();
          }}
          hitSlop={10}
          accessibilityRole="button"
          style={styles.action}
        >
          <Text style={[styles.actionText, { color: '#64D2FF' }]}>{toast.action.label}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    maxWidth: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.pill,
    gap: spacing.md,
  },
  text: { fontSize: fontSize.subhead, flexShrink: 1 },
  action: { paddingVertical: 2 },
  actionText: { fontSize: fontSize.subhead, fontWeight: '700' },
});
