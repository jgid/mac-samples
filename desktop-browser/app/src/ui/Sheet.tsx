// Shared building blocks for page sheets: modal frame, grouped sections and rows.
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize, HIT, radius, SHEET_ORIENTATIONS, spacing, useTheme } from './theme';

export function Sheet({
  visible,
  title,
  onClose,
  closeLabel = 'Fertig',
  children,
}: {
  visible: boolean;
  title: string;
  onClose(): void;
  closeLabel?: string;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      supportedOrientations={SHEET_ORIENTATIONS}
      onRequestClose={onClose}
    >
      <View style={[styles.frame, { backgroundColor: colors.groupedBackground }]}>
        <View style={[styles.header, { borderBottomColor: colors.separator }]}>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header" numberOfLines={1}>
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            style={styles.close}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
          >
            <Text style={[styles.closeText, { color: colors.tint }]}>{closeLabel}</Text>
          </Pressable>
        </View>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.frame}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function Section({ title, footer, children }: { title?: string; footer?: ReactNode; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      {title ? <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text> : null}
      <View style={[styles.sectionBody, { backgroundColor: colors.surface }]}>{children}</View>
      {footer ? (
        typeof footer === 'string' ? (
          <Text style={[styles.footer, { color: colors.textSecondary }]}>{footer}</Text>
        ) : (
          <View style={styles.footerBox}>{footer}</View>
        )
      ) : null}
    </View>
  );
}

export function Separator({ inset = spacing.lg }: { inset?: number }) {
  const { colors } = useTheme();
  return <View style={{ marginLeft: inset, height: StyleSheet.hairlineWidth, backgroundColor: colors.separator }} />;
}

export interface RowProps {
  title: string;
  subtitle?: string;
  detail?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?(): void;
  checked?: boolean;
  chevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  right?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Row({
  title,
  subtitle,
  detail,
  icon,
  onPress,
  checked,
  chevron,
  destructive,
  disabled,
  right,
  accessibilityLabel,
  accessibilityHint,
}: RowProps) {
  const { colors } = useTheme();
  const titleColor = disabled ? colors.textTertiary : destructive ? colors.danger : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, selected: checked }}
      style={({ pressed }) => [styles.row, pressed && onPress ? { backgroundColor: colors.fieldBackground } : null]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={22}
          color={disabled ? colors.textTertiary : destructive ? colors.danger : colors.tint}
          style={styles.rowIcon}
        />
      ) : null}
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: titleColor }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {detail ? <Text style={[styles.rowDetail, { color: colors.textSecondary }]}>{detail}</Text> : null}
      {right}
      {checked ? <Ionicons name="checkmark" size={22} color={colors.tint} accessibilityLabel="Ausgewählt" /> : null}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} /> : null}
    </Pressable>
  );
}

export function SwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange(value: boolean): void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: disabled ? colors.textTertiary : colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={title}
        trackColor={{ true: colors.success }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1 },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 96,
  },
  title: { fontSize: fontSize.body, fontWeight: '600' },
  close: { position: 'absolute', right: spacing.lg, top: 0, bottom: 0, justifyContent: 'center', minWidth: HIT },
  closeText: { fontSize: fontSize.body, fontWeight: '600', textAlign: 'right' },
  content: { paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: fontSize.footnote,
    textTransform: 'uppercase',
    marginBottom: spacing.xs + 2,
    marginLeft: spacing.lg,
  },
  sectionBody: { borderRadius: radius.md, overflow: 'hidden' },
  footer: { fontSize: fontSize.footnote, marginTop: spacing.xs + 2, marginHorizontal: spacing.lg, lineHeight: 18 },
  footerBox: { marginTop: spacing.xs + 2, marginHorizontal: spacing.lg },
  row: {
    minHeight: HIT + 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    gap: spacing.md,
  },
  rowIcon: { width: 26, textAlign: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: fontSize.body },
  rowSubtitle: { fontSize: fontSize.footnote, marginTop: 2 },
  rowDetail: { fontSize: fontSize.subhead },
});
