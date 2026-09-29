import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { fontSize, HIT, radius, spacing, useTheme } from './theme';

export interface InfoCardAction {
  label: string;
  onPress(): void;
  primary?: boolean;
}

/** Floating card for tips and errors inside the viewport area. */
export function InfoCard({
  icon,
  tone = 'info',
  title,
  message,
  actions,
  onClose,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'info' | 'error';
  title: string;
  message?: string;
  actions?: InfoCardAction[];
  onClose?(): void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const accent = tone === 'error' ? colors.danger : colors.tint;
  return (
    <View
      style={[styles.card, { backgroundColor: colors.surfaceElevated }, style]}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.head}>
        <Ionicons name={icon} size={22} color={accent} style={styles.icon} />
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text> : null}
        </View>
        {onClose ? (
          <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityRole="button" accessibilityLabel="Schließen">
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {actions && actions.length > 0 ? (
        <View style={styles.actions}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              onPress={a.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.action,
                { backgroundColor: a.primary ? accent : colors.fieldBackground },
                pressed ? { opacity: 0.8 } : null,
              ]}
            >
              <Text style={[styles.actionText, { color: a.primary ? colors.onTint : colors.text }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { marginRight: spacing.md, marginTop: 1 },
  text: { flex: 1 },
  title: { fontSize: fontSize.body - 1, fontWeight: '600' },
  message: { fontSize: fontSize.subhead - 1, marginTop: 3, lineHeight: 19 },
  close: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.md },
  action: { minHeight: HIT - 6, paddingHorizontal: spacing.lg, borderRadius: radius.md, justifyContent: 'center' },
  actionText: { fontSize: fontSize.subhead, fontWeight: '600' },
});
