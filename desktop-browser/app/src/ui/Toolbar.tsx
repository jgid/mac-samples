import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { InputMode } from '../types';
import { fontSize, HIT, radius, spacing, useTheme } from './theme';

type IconName = keyof typeof Ionicons.glyphMap;

export interface ToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  inputMode: InputMode;
  capturing: boolean;
  onBack(): void;
  onForward(): void;
  onToggleMouse(): void;
  onScreenshot(): void;
  onBookmarks(): void;
  onFullscreen(): void;
  onMore(): void;
}

function ToolButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: IconName;
  label: string;
  onPress(): void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <Ionicons name={icon} size={24} color={disabled ? colors.textTertiary : colors.tint} />
    </Pressable>
  );
}

function ToolbarImpl(p: ToolbarProps) {
  const { colors } = useTheme();
  const mouse = p.inputMode === 'mouse';
  return (
    <View style={[styles.bar, { backgroundColor: colors.chrome, borderTopColor: colors.separator }]}>
      <ToolButton icon="chevron-back" label="Zurück" onPress={p.onBack} disabled={!p.canGoBack} />
      <ToolButton icon="chevron-forward" label="Vor" onPress={p.onForward} disabled={!p.canGoForward} />
      <Pressable
        onPress={p.onToggleMouse}
        hitSlop={6}
        accessibilityRole="switch"
        accessibilityLabel="Maus-Modus"
        accessibilityHint="Steuert die Seite wie mit einem Trackpad und Mauszeiger"
        accessibilityState={{ checked: mouse }}
        style={({ pressed }) => [
          styles.mouse,
          { backgroundColor: mouse ? colors.tint : colors.tintSoft },
          pressed ? styles.pressed : null,
        ]}
      >
        <Ionicons name={mouse ? 'navigate' : 'navigate-outline'} size={18} color={mouse ? colors.onTint : colors.tint} style={styles.mouseIcon} />
        <Text style={[styles.mouseLabel, { color: mouse ? colors.onTint : colors.tint }]}>Maus</Text>
      </Pressable>
      <ToolButton icon="camera-outline" label="Screenshot" onPress={p.onScreenshot} disabled={p.capturing} />
      <ToolButton icon="book-outline" label="Lesezeichen" onPress={p.onBookmarks} />
      <ToolButton icon="expand-outline" label="Vollbild" onPress={p.onFullscreen} />
      <ToolButton icon="ellipsis-horizontal-circle-outline" label="Mehr" onPress={p.onMore} />
    </View>
  );
}

export const Toolbar = memo(ToolbarImpl);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
  button: { minWidth: HIT, height: HIT, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.5 },
  mouse: {
    height: 34,
    minWidth: 72,
    marginVertical: (HIT - 34) / 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouseIcon: { transform: [{ rotate: '-90deg' }], marginRight: spacing.xs },
  mouseLabel: { fontSize: fontSize.subhead, fontWeight: '600' },
});
