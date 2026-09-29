import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontSize, HIT, radius, spacing, useTheme } from './theme';

type IconName = keyof typeof Ionicons.glyphMap;

const GESTURES: { icon: IconName; gesture: string; effect: string }[] = [
  { icon: 'finger-print-outline', gesture: '1 Finger bewegen', effect: 'Maus bewegen' },
  { icon: 'radio-button-on-outline', gesture: 'Tippen', effect: 'Klicken' },
  { icon: 'time-outline', gesture: 'Lange drücken', effect: 'Rechtsklick' },
  { icon: 'swap-vertical-outline', gesture: '2 Finger', effect: 'Scrollen' },
];

/** Explains the trackpad gestures the first time mouse mode is enabled. */
export function TrackpadHint({ onDismiss }: { onDismiss(): void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.backdrop, { backgroundColor: colors.overlay }]} accessibilityViewIsModal>
      <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
        <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
          Maus-Modus ist an
        </Text>
        <Text style={[styles.lead, { color: colors.textSecondary }]}>
          Dein Bildschirm wird zum Trackpad. So klappen auch Menüs auf, die nur bei Mausberührung erscheinen.
        </Text>
        {GESTURES.map((g) => (
          <View key={g.gesture} style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: colors.tintSoft }]}>
              <Ionicons name={g.icon} size={20} color={colors.tint} />
            </View>
            <Text style={[styles.gesture, { color: colors.text }]}>{g.gesture}</Text>
            <Text style={[styles.effect, { color: colors.textSecondary }]}>= {g.effect}</Text>
          </View>
        ))}
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, { backgroundColor: colors.tint }, pressed ? { opacity: 0.8 } : null]}
        >
          <Text style={[styles.buttonText, { color: colors.onTint }]}>Verstanden</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  card: { width: '100%', maxWidth: 380, borderRadius: radius.xl, padding: spacing.xl },
  title: { fontSize: fontSize.title, fontWeight: '700', marginBottom: spacing.sm },
  lead: { fontSize: fontSize.subhead, lineHeight: 21, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.md },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  gesture: { fontSize: fontSize.body - 1, fontWeight: '600' },
  effect: { fontSize: fontSize.body - 1, flexShrink: 1 },
  button: { marginTop: spacing.md, height: HIT + 6, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: fontSize.body, fontWeight: '600' },
});
