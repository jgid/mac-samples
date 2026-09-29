import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  clampResolution,
  findPreset,
  formatResolution,
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_HEIGHT,
  MIN_WIDTH,
  PRESET_GROUP_LABELS,
  PRESETS,
} from '../core/resolution';
import type { Preset, PresetGroup, Resolution, ScaleMode } from '../types';
import { Row, Section, Separator, Sheet, SwitchRow } from './Sheet';
import { fontSize, HIT, radius, spacing, useTheme } from './theme';

/** Widths from which the page needs a lot of memory (4K and up). */
export const LARGE_WIDTH = 3840;
const MEMORY_HINT = 'Braucht viel Arbeitsspeicher';

const SCALE_MODE_TEXT: Record<ScaleMode, { label: string; explain: string }> = {
  fill: {
    label: 'Ganzer Bildschirm',
    explain: 'Breite wie gewählt, die Höhe passt sich deinem iPhone an – ohne Ränder. Screenshots sind dann höher als der echte Monitor; für exakte Belege „Originalformat“ wählen.',
  },
  exact: {
    label: 'Originalformat',
    explain: 'Breite und Höhe genau wie gewählt – dafür mit Rändern.',
  },
};

export interface ResolutionSheetProps {
  visible: boolean;
  onClose(): void;
  resolution: Resolution;
  scaleMode: ScaleMode;
  /** Host of the current page; null on the test page or internal pages. */
  host: string | null;
  profileActive: boolean;
  onSelectResolution(r: Resolution): void;
  onSelectScaleMode(mode: ScaleMode): void;
  onToggleProfile(remember: boolean): void;
}

function ModeSchematic({ mode, active }: { mode: ScaleMode; active: boolean }) {
  const { colors } = useTheme();
  const stroke = active ? colors.tint : colors.textSecondary;
  return (
    <View style={[schematic.phone, { borderColor: stroke }]}>
      {mode === 'fill' ? (
        <View style={[schematic.fill, { backgroundColor: stroke, opacity: 0.35 }]} />
      ) : (
        <View style={[schematic.exact, { backgroundColor: stroke, opacity: 0.35 }]} />
      )}
    </View>
  );
}

export function ResolutionSheet({
  visible,
  onClose,
  resolution,
  scaleMode,
  host,
  profileActive,
  onSelectResolution,
  onSelectScaleMode,
  onToggleProfile,
}: ResolutionSheetProps) {
  const { colors } = useTheme();
  const [widthText, setWidthText] = useState(String(resolution.width));
  const [heightText, setHeightText] = useState(String(resolution.height));
  const [customNote, setCustomNote] = useState<string | null>(null);

  // Reset the custom inputs each time the sheet opens (not on every change while open).
  useEffect(() => {
    if (!visible) return;
    setWidthText(String(resolution.width));
    setHeightText(String(resolution.height));
    setCustomNote(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const groups = useMemo(() => {
    const order = Object.keys(PRESET_GROUP_LABELS) as PresetGroup[];
    return order
      .map((g) => ({ group: g, label: PRESET_GROUP_LABELS[g], presets: PRESETS.filter((p) => p.group === g) }))
      .filter((g) => g.presets.length > 0);
  }, []);

  const current = findPreset(resolution);

  const applyCustom = useCallback(() => {
    const w = parseInt(widthText.replace(/\D/g, ''), 10);
    const h = parseInt(heightText.replace(/\D/g, ''), 10);
    if (!isFinite(w) || !isFinite(h)) {
      setCustomNote('Bitte Breite und Höhe als Zahl eingeben.');
      return;
    }
    const r = clampResolution({ width: w, height: h });
    setWidthText(String(r.width));
    setHeightText(String(r.height));
    setCustomNote(
      r.width !== w || r.height !== h ? `Angepasst auf ${formatResolution(r)} (erlaubter Bereich).` : `${formatResolution(r)} übernommen.`,
    );
    onSelectResolution(r);
  }, [widthText, heightText, onSelectResolution]);

  const customWidth = parseInt(widthText, 10);
  const selectPreset = useCallback((p: Preset) => onSelectResolution({ width: p.width, height: p.height }), [onSelectResolution]);

  return (
    <Sheet visible={visible} title="Bildschirmgröße" onClose={onClose}>
      <Text style={[styles.current, { color: colors.textSecondary }]}>
        Aktuell: <Text style={{ color: colors.text, fontWeight: '600' }}>{current ? current.label : 'Eigene Größe'}</Text>
        {' · '}
        {formatResolution(resolution)}
        {profileActive && host ? ` · gemerkt für ${host}` : ''}
      </Text>

      {groups.map((g) => (
        <Section key={g.group} title={g.label}>
          {g.presets.map((p, i) => {
            const selected = p.width === resolution.width && p.height === resolution.height;
            const big = p.width >= LARGE_WIDTH;
            return (
              <View key={p.id}>
                {i > 0 ? <Separator /> : null}
                <Row
                  title={p.label}
                  subtitle={`${formatResolution(p)}  ·  ${p.detail}${big ? `\n${MEMORY_HINT}` : ''}`}
                  checked={selected}
                  onPress={() => {
                    selectPreset(p);
                    onClose();
                  }}
                  accessibilityLabel={`${p.label}, ${p.width} mal ${p.height} Pixel, ${p.detail}${big ? `, ${MEMORY_HINT}` : ''}`}
                />
              </View>
            );
          })}
        </Section>
      ))}

      <Section title="Darstellung" footer={SCALE_MODE_TEXT[scaleMode].explain}>
        <View style={styles.segmentWrap}>
          <View style={[styles.segment, { backgroundColor: colors.fieldBackground }]} accessibilityRole="radiogroup">
            {(['fill', 'exact'] as const).map((m) => {
              const active = m === scaleMode;
              return (
                <Pressable
                  key={m}
                  onPress={() => onSelectScaleMode(m)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={SCALE_MODE_TEXT[m].label}
                  accessibilityHint={SCALE_MODE_TEXT[m].explain}
                  style={[styles.segmentItem, active ? [styles.segmentActive, { backgroundColor: colors.surfaceElevated }] : null]}
                >
                  <ModeSchematic mode={m} active={active} />
                  <Text style={[styles.segmentText, { color: active ? colors.text : colors.textSecondary }]}>
                    {SCALE_MODE_TEXT[m].label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Section>

      <Section
        footer={
          host
            ? profileActive
              ? `Gilt nur für ${host}. Beim nächsten Besuch wird diese Größe automatisch eingestellt.`
              : `Größe und Darstellung werden für ${host} gespeichert und dort automatisch verwendet.`
            : 'Öffne eine Website, um dir die Größe für sie zu merken. Auf der Testseite geht das nicht.'
        }
      >
        <SwitchRow
          title={host ? `Für ${host} merken` : 'Für diese Website merken'}
          value={profileActive}
          onValueChange={onToggleProfile}
          disabled={!host}
        />
      </Section>

      <Section
        title="Erweitert – eigene Größe"
        footer={`Erlaubt: Breite ${MIN_WIDTH}–${MAX_WIDTH} px, Höhe ${MIN_HEIGHT}–${MAX_HEIGHT} px (CSS-Pixel, entspricht window.innerWidth).`}
      >
        <View style={styles.custom}>
          <View style={styles.inputs}>
            <View style={styles.inputBox}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Breite</Text>
              <TextInput
                value={widthText}
                onChangeText={setWidthText}
                keyboardType="number-pad"
                maxLength={4}
                returnKeyType="done"
                onSubmitEditing={applyCustom}
                style={[styles.input, { color: colors.text, backgroundColor: colors.fieldBackground }]}
                accessibilityLabel="Breite in Pixel"
              />
            </View>
            <Text style={[styles.times, { color: colors.textSecondary }]}>×</Text>
            <View style={styles.inputBox}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Höhe</Text>
              <TextInput
                value={heightText}
                onChangeText={setHeightText}
                keyboardType="number-pad"
                maxLength={4}
                returnKeyType="done"
                onSubmitEditing={applyCustom}
                style={[styles.input, { color: colors.text, backgroundColor: colors.fieldBackground }]}
                accessibilityLabel="Höhe in Pixel"
              />
            </View>
          </View>
          <Pressable
            onPress={applyCustom}
            accessibilityRole="button"
            style={({ pressed }) => [styles.apply, { backgroundColor: colors.tint }, pressed ? { opacity: 0.85 } : null]}
          >
            <Text style={[styles.applyText, { color: colors.onTint }]}>Übernehmen</Text>
          </Pressable>
          {customWidth >= LARGE_WIDTH ? (
            <View style={styles.warning}>
              <Ionicons name="warning-outline" size={16} color={colors.warning} />
              <Text style={[styles.note, { color: colors.warning }]}>
                {MEMORY_HINT} – bei sehr großen Seiten kann die Darstellung ruckeln.
              </Text>
            </View>
          ) : null}
          {customNote ? <Text style={[styles.note, { color: colors.textSecondary }]}>{customNote}</Text> : null}
        </View>
      </Section>
    </Sheet>
  );
}

const schematic = StyleSheet.create({
  phone: {
    width: 26,
    height: 42,
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 2,
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  fill: { flex: 1, borderRadius: 2 },
  exact: { height: 12, borderRadius: 1 },
});

const styles = StyleSheet.create({
  current: { fontSize: fontSize.footnote, marginHorizontal: spacing.lg, marginBottom: spacing.lg, lineHeight: 18 },
  segmentWrap: { padding: spacing.md },
  segment: { flexDirection: 'row', borderRadius: radius.md, padding: 3 },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm + 2, borderRadius: radius.sm + 2, minHeight: HIT },
  segmentActive: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentText: { fontSize: fontSize.subhead - 1, fontWeight: '600' },
  custom: { padding: spacing.lg, gap: spacing.md },
  inputs: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  inputBox: { flex: 1 },
  inputLabel: { fontSize: fontSize.caption, marginBottom: 4 },
  input: {
    height: HIT,
    borderRadius: radius.sm + 2,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.body,
    fontVariant: ['tabular-nums'],
  },
  times: { fontSize: fontSize.title, paddingBottom: 10 },
  apply: { height: HIT, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  applyText: { fontSize: fontSize.body, fontWeight: '600' },
  warning: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  note: { fontSize: fontSize.footnote, flexShrink: 1 },
});
