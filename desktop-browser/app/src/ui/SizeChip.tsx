import { Ionicons } from '@expo/vector-icons';
import { memo, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { fontSize, radius, spacing, useTheme } from './theme';

export interface SizeChipProps {
  /** Device name or "Eigene Größe". */
  label: string;
  /** e.g. "1920 × 1080 · 21 %" */
  sizeText: string;
  /** Marks a remembered site profile. */
  profileActive: boolean;
  /** In fullscreen the chip fades out after 2 s (and re-appears on size changes). */
  autoHide: boolean;
  onPress(): void;
}

const HIDE_AFTER_MS = 2000;

function SizeChipImpl({ label, sizeText, profileActive, autoHide, onPress }: SizeChipProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
    opacity.stopAnimation();
    opacity.setValue(1);
    if (!autoHide) return;
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setHidden(true);
      });
    }, HIDE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [autoHide, sizeText, label, opacity]);

  return (
    <Animated.View style={[styles.wrap, { opacity }]} pointerEvents={hidden ? 'none' : 'box-none'}>
      <Pressable
        onPress={onPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Bildschirmgröße: ${label}, ${sizeText}${profileActive ? ', für diese Website gemerkt' : ''}`}
        accessibilityHint="Öffnet die Schnellwahl für die Bildschirmgröße"
        style={({ pressed }) => [styles.chip, { backgroundColor: colors.chipBackground }, pressed ? styles.pressed : null]}
      >
        {profileActive ? <Ionicons name="bookmark" size={11} color={colors.chipText} style={styles.icon} /> : null}
        <Text style={[styles.label, { color: colors.chipText }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.size, { color: colors.chipText }]} numberOfLines={1}>
          {sizeText}
        </Text>
        <Ionicons name="chevron-down" size={12} color={colors.chipText} style={styles.icon} />
      </Pressable>
    </Animated.View>
  );
}

export const SizeChip = memo(SizeChipImpl);

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: spacing.sm, left: 0, right: 0, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    maxWidth: '92%',
    gap: spacing.xs + 2,
  },
  pressed: { opacity: 0.7 },
  icon: { opacity: 0.85 },
  label: { fontSize: fontSize.footnote, fontWeight: '600', flexShrink: 1 },
  size: { fontSize: fontSize.footnote, opacity: 0.8, fontVariant: ['tabular-nums'] },
});
