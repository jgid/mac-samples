import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize, HIT, radius, SHEET_ORIENTATIONS, spacing, useTheme } from './theme';

type IconName = keyof typeof Ionicons.glyphMap;

const POINTS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'desktop-outline',
    title: 'Echt',
    text: 'Websites werden wirklich so aufgebaut wie auf einem Monitor deiner Wahl – nicht nur verkleinert. Die aktuelle Größe siehst du immer oben.',
  },
  {
    icon: 'navigate-outline',
    title: 'Bedienbar',
    text: 'Im Maus-Modus steuerst du einen Mauszeiger wie am Laptop. So öffnen sich auch Menüs, die nur bei Mausberührung aufklappen.',
  },
  {
    icon: 'camera-outline',
    title: 'Belegbar',
    text: 'Screenshots in voller Größe – mit Adresse, Bildschirmgröße und Uhrzeit. Direkt teilen, etwa per Mail, Slack oder Jira.',
  },
];

export function OnboardingSheet({ visible, onDone }: { visible: boolean; onDone(): void }) {
  const { colors } = useTheme();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      supportedOrientations={SHEET_ORIENTATIONS}
      onRequestClose={onDone}
    >
      <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles.frame, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.logo, { backgroundColor: colors.tint }]}>
            <Ionicons name="desktop" size={34} color={colors.onTint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            Willkommen bei Deskview
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sieh jede Website wie auf einem echten Monitor – und bediene sie wie mit einer Maus.
          </Text>
          {POINTS.map((p) => (
            <View key={p.title} style={styles.point}>
              <Ionicons name={p.icon} size={30} color={colors.tint} style={styles.pointIcon} />
              <View style={styles.pointText}>
                <Text style={[styles.pointTitle, { color: colors.text }]}>{p.title}</Text>
                <Text style={[styles.pointBody, { color: colors.textSecondary }]}>{p.text}</Text>
              </View>
            </View>
          ))}
          <Text style={[styles.note, { color: colors.textSecondary }]}>
            Zum Start öffnet sich eine Testseite. Sie zeigt dir sofort, wie groß der Bildschirm für die Website ist.
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            onPress={onDone}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, { backgroundColor: colors.tint }, pressed ? { opacity: 0.85 } : null]}
          >
            <Text style={[styles.buttonText, { color: colors.onTint }]}>Los geht's</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1 },
  content: { paddingHorizontal: spacing.xl + 4, paddingTop: spacing.xxl + 8, paddingBottom: spacing.xl, alignItems: 'stretch' },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.largeTitle, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: fontSize.body - 1, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl, lineHeight: 22 },
  point: { flexDirection: 'row', marginBottom: spacing.xl, maxWidth: 520, alignSelf: 'center' },
  pointIcon: { width: 44, marginRight: spacing.md, marginTop: 2 },
  pointText: { flex: 1 },
  pointTitle: { fontSize: fontSize.body, fontWeight: '700', marginBottom: 2 },
  pointBody: { fontSize: fontSize.subhead, lineHeight: 21 },
  note: { fontSize: fontSize.footnote, textAlign: 'center', lineHeight: 18, marginTop: spacing.sm },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, paddingTop: spacing.sm },
  button: { height: HIT + 8, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', maxWidth: 520, width: '100%', alignSelf: 'center' },
  buttonText: { fontSize: fontSize.body, fontWeight: '700' },
});
