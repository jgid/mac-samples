import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AGENTS } from '../core/agents';
import { findPreset, formatResolution } from '../core/resolution';
import { resolveInput, SEARCH_ENGINES, TEST_PAGE_URL } from '../core/url';
import { useAppState } from '../state/AppState';
import type { SiteProfile } from '../types';
import { Row, Section, Separator, Sheet, SwitchRow } from './Sheet';
import { fontSize, HIT, radius, spacing, useTheme } from './theme';

const APP_VERSION = '1.0.0';

const DESKTOP_CHANGES: { title: string; detail: string }[] = [
  { title: 'Bildschirmgröße', detail: 'screen.width/height und outerWidth/Height entsprechen der gewählten Größe' },
  { title: 'Plattform', detail: 'navigator.platform und vendor passend zur Browser-Kennung (z. B. MacIntel)' },
  { title: 'Keine Touch-Erkennung', detail: 'navigator.maxTouchPoints = 0, kein ontouchstart' },
  { title: 'Maus als Zeigegerät', detail: 'Media Queries (hover: hover) und (pointer: fine) treffen zu' },
  { title: 'Viewport-Tag ignoriert', detail: '<meta name="viewport"> wird wie im Desktop-Browser nicht beachtet' },
];

export const AGENT_FOOTER =
  'Alle Browser auf dem iPhone nutzen die Safari-Engine (WebKit). Die Kennung ändert nur, wie sich die App gegenüber Websites ausgibt – Darstellungsfehler, die nur Chrome hat, lassen sich hier nicht nachstellen.';

export function describeProfile(p: SiteProfile): string {
  const preset = findPreset(p.resolution);
  const mode = p.scaleMode === 'fill' ? 'Ganzer Bildschirm' : 'Originalformat';
  return `${preset ? `${preset.label} · ` : ''}${formatResolution(p.resolution)} · ${mode}`;
}

export interface SettingsSheetProps {
  visible: boolean;
  onClose(): void;
  currentUrl: string;
  onOpenUrl(url: string): void;
  onCopyPageInfo(): void;
  onShowIntro(): void;
}

export function SettingsSheet({ visible, onClose, currentUrl, onOpenUrl, onCopyPageInfo, onShowIntro }: SettingsSheetProps) {
  const { colors } = useTheme();
  const { settings, updateSettings, siteProfiles, setSiteProfile } = useAppState();
  const [showDetails, setShowDetails] = useState(false);
  const [customHome, setCustomHome] = useState(settings.homeUrl !== TEST_PAGE_URL);
  const [homeText, setHomeText] = useState(settings.homeUrl === TEST_PAGE_URL ? '' : settings.homeUrl);
  const [homeNote, setHomeNote] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    const custom = settings.homeUrl !== TEST_PAGE_URL;
    setCustomHome(custom);
    setHomeText(custom ? settings.homeUrl : '');
    setHomeNote(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const profiles = useMemo(
    () => Object.values(siteProfiles).sort((a, b) => a.host.localeCompare(b.host)),
    [siteProfiles],
  );

  const toggleDetails = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails((v) => !v);
  }, []);

  const saveHome = useCallback(
    (input: string) => {
      const url = resolveInput(input.trim(), settings.searchEngine);
      if (!url) {
        setHomeNote('Bitte eine Adresse eingeben.');
        return;
      }
      setHomeText(url);
      setHomeNote('Gespeichert.');
      updateSettings({ homeUrl: url });
    },
    [settings.searchEngine, updateSettings],
  );

  const chooseTestHome = useCallback(() => {
    setCustomHome(false);
    setHomeNote(null);
    updateSettings({ homeUrl: TEST_PAGE_URL });
  }, [updateSettings]);

  const openTestPage = useCallback(() => {
    onOpenUrl(TEST_PAGE_URL);
    onClose();
  }, [onOpenUrl, onClose]);

  const canUseCurrent = !!currentUrl && currentUrl !== TEST_PAGE_URL;

  return (
    <Sheet visible={visible} title="Einstellungen" onClose={onClose}>
      <Section title="Als Browser ausgeben" footer={AGENT_FOOTER}>
        {AGENTS.map((a, i) => (
          <View key={a.id}>
            {i > 0 ? <Separator /> : null}
            <Row title={a.label} checked={a.id === settings.agentId} onPress={() => updateSettings({ agentId: a.id })} />
          </View>
        ))}
      </Section>

      <Section
        footer={
          settings.desktopMode
            ? 'Websites halten dein iPhone für einen Computer mit Maus.'
            : 'Aus: Websites erkennen, dass ein Touch-Gerät verwendet wird.'
        }
      >
        <SwitchRow
          title="Desktop-Modus"
          subtitle="Website verhält sich wie auf einem Computer"
          value={settings.desktopMode}
          onValueChange={(v) => updateSettings({ desktopMode: v })}
        />
        <Separator />
        <Row
          title="Was wird geändert?"
          onPress={toggleDetails}
          right={<Ionicons name={showDetails ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />}
          accessibilityLabel={showDetails ? 'Details ausblenden' : 'Was wird geändert? Details anzeigen'}
        />
        {showDetails ? (
          <View style={styles.details}>
            {DESKTOP_CHANGES.map((c) => (
              <View key={c.title} style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.detailIcon} />
                <View style={styles.detailText}>
                  <Text style={[styles.detailTitle, { color: colors.text }]}>{c.title}</Text>
                  <Text style={[styles.detailSub, { color: colors.textSecondary }]}>{c.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Section>

      <Section title="Suchmaschine">
        {SEARCH_ENGINES.map((e, i) => (
          <View key={e.id}>
            {i > 0 ? <Separator /> : null}
            <Row title={e.label} checked={e.id === settings.searchEngine} onPress={() => updateSettings({ searchEngine: e.id })} />
          </View>
        ))}
      </Section>

      <Section title="Startseite" footer={homeNote ?? undefined}>
        <Row
          title="Testseite"
          subtitle="Zeigt Bildschirmgröße, Breakpoints und Maus-Erkennung"
          checked={!customHome}
          onPress={chooseTestHome}
        />
        <Separator />
        <Row title="Eigene Adresse" checked={customHome} onPress={() => setCustomHome(true)} />
        {customHome ? (
          <View style={styles.homeBox}>
            <TextInput
              value={homeText}
              onChangeText={setHomeText}
              onSubmitEditing={() => saveHome(homeText)}
              placeholder="z. B. example.com"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="done"
              style={[styles.input, { color: colors.text, backgroundColor: colors.fieldBackground }]}
              accessibilityLabel="Adresse der Startseite"
            />
            <View style={styles.homeButtons}>
              <Pressable
                onPress={() => saveHome(homeText)}
                accessibilityRole="button"
                style={[styles.smallButton, { backgroundColor: colors.tint }]}
              >
                <Text style={[styles.smallButtonText, { color: colors.onTint }]}>Speichern</Text>
              </Pressable>
              {canUseCurrent ? (
                <Pressable
                  onPress={() => saveHome(currentUrl)}
                  accessibilityRole="button"
                  style={[styles.smallButton, { backgroundColor: colors.fieldBackground }]}
                >
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>Aktuelle Seite</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}
      </Section>

      <Section title="Screenshot" footer="Unter dem Screenshot stehen dann Adresse, Bildschirmgröße, Browser-Kennung und Uhrzeit.">
        <SwitchRow
          title="Info-Leiste im Screenshot"
          value={settings.screenshotInfoBar}
          onValueChange={(v) => updateSettings({ screenshotInfoBar: v })}
        />
        <Separator />
        <Row
          icon="copy-outline"
          title="Seiteninfo kopieren"
          subtitle="Adresse, Größe, Kennung und Uhrzeit als Text"
          onPress={onCopyPageInfo}
        />
      </Section>

      <Section
        title="Website-Profile"
        footer={
          profiles.length === 0
            ? 'Noch keine. Tippe oben auf die Größenanzeige und wähle „Für … merken“, damit eine Website immer in derselben Größe öffnet.'
            : 'Diese Websites öffnen automatisch in der gespeicherten Größe.'
        }
      >
        {profiles.length === 0 ? (
          <Row title="Keine Website-Profile" disabled />
        ) : (
          profiles.map((p, i) => (
            <View key={p.host}>
              {i > 0 ? <Separator /> : null}
              <Row
                title={p.host}
                subtitle={describeProfile(p)}
                right={
                  <Pressable
                    onPress={() => setSiteProfile(p.host, null)}
                    hitSlop={6}
                    style={styles.trash}
                    accessibilityRole="button"
                    accessibilityLabel={`Profil für ${p.host} löschen`}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                }
              />
            </View>
          ))
        )}
      </Section>

      <Section>
        <Row icon="speedometer-outline" title="Testseite öffnen" onPress={openTestPage} />
        <Separator />
        <Row
          icon="sparkles-outline"
          title="Einführung erneut zeigen"
          onPress={() => {
            onClose();
            onShowIntro();
          }}
        />
      </Section>

      <Text style={[styles.about, { color: colors.textSecondary }]}>
        Deskview {APP_VERSION}
        {'\n'}Sieh jede Website wie auf einem echten Monitor – und bediene sie wie mit einer Maus. Logins und Cookies bleiben
        gespeichert.
      </Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  details: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start' },
  detailIcon: { marginRight: spacing.md, marginTop: 1 },
  detailText: { flex: 1 },
  detailTitle: { fontSize: fontSize.subhead, fontWeight: '600' },
  detailSub: { fontSize: fontSize.footnote, marginTop: 1, lineHeight: 17 },
  homeBox: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  input: { height: HIT, borderRadius: radius.sm + 2, paddingHorizontal: spacing.md, fontSize: fontSize.body },
  homeButtons: { flexDirection: 'row', gap: spacing.sm },
  smallButton: { height: HIT - 6, paddingHorizontal: spacing.lg, borderRadius: radius.md, justifyContent: 'center' },
  smallButtonText: { fontSize: fontSize.subhead, fontWeight: '600' },
  trash: { width: HIT, height: HIT, alignItems: 'center', justifyContent: 'center', marginRight: -spacing.sm },
  about: { fontSize: fontSize.footnote, textAlign: 'center', lineHeight: 18, marginHorizontal: spacing.lg },
});
