import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { displayUrl, resolveInput, TEST_PAGE_URL } from '../core/url';
import type { SearchEngineId } from '../types';
import { fontSize, HIT, radius, spacing, useTheme } from './theme';

export interface AddressBarProps {
  url: string;
  loading: boolean;
  /** 0..1 */
  progress: number;
  searchEngine: SearchEngineId;
  onNavigate(url: string): void;
  onReload(): void;
  onStop(): void;
}

function AddressBarImpl({ url, loading, progress, searchEngine, onNavigate, onReload, onStop }: AddressBarProps) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');

  const isTestPage = url === TEST_PAGE_URL;
  const secure = url.startsWith('https://');
  const shown = isTestPage ? 'Testseite' : url ? displayUrl(url) : '';

  const onFocus = useCallback(() => {
    setText(url);
    setFocused(true);
  }, [url]);

  const onBlur = useCallback(() => setFocused(false), []);

  const onSubmit = useCallback(() => {
    const target = resolveInput(text.trim(), searchEngine);
    inputRef.current?.blur();
    if (target) onNavigate(target);
  }, [text, searchEngine, onNavigate]);

  const cancel = useCallback(() => inputRef.current?.blur(), []);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.chrome, borderBottomColor: colors.separator }]}>
      <View style={styles.line}>
        <View style={[styles.field, { backgroundColor: colors.fieldBackground }]}>
          {!focused ? (
            <Ionicons
              name={isTestPage ? 'information-circle' : secure ? 'lock-closed' : 'globe-outline'}
              size={14}
              color={colors.textSecondary}
              style={styles.leading}
              accessibilityLabel={isTestPage ? 'Testseite' : secure ? 'Sichere Verbindung' : 'Unverschlüsselte Verbindung'}
            />
          ) : (
            <Ionicons name="search" size={15} color={colors.textSecondary} style={styles.leading} />
          )}
          <TextInput
            ref={inputRef}
            value={focused ? text : shown}
            onChangeText={setText}
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmitEditing={onSubmit}
            placeholder="Adresse oder Suchbegriff"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text, textAlign: focused ? 'left' : 'center' }]}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            keyboardType="web-search"
            returnKeyType="go"
            selectTextOnFocus
            clearButtonMode="while-editing"
            accessibilityLabel="Adressleiste"
            accessibilityHint="Adresse oder Suchbegriff eingeben"
          />
          {!focused ? (
            <Pressable
              onPress={loading ? onStop : onReload}
              hitSlop={8}
              style={styles.trailing}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Laden stoppen' : 'Neu laden'}
            >
              <Ionicons name={loading ? 'close' : 'refresh'} size={18} color={colors.text} />
            </Pressable>
          ) : null}
        </View>
        {focused ? (
          <Pressable onPress={cancel} style={styles.cancel} accessibilityRole="button" accessibilityLabel="Abbrechen">
            <Text style={[styles.cancelText, { color: colors.tint }]}>Abbrechen</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.progressTrack} pointerEvents="none">
        {loading ? (
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.tint, width: `${Math.max(5, Math.min(100, progress * 100))}%` },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

export const AddressBar = memo(AddressBarImpl);

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm - 2,
    gap: spacing.sm,
  },
  field: {
    flex: 1,
    height: 40,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leading: { marginLeft: spacing.md, width: 16 },
  input: { flex: 1, height: 40, fontSize: fontSize.body - 1, paddingHorizontal: spacing.sm },
  trailing: { width: HIT - 4, height: 40, alignItems: 'center', justifyContent: 'center' },
  cancel: { height: HIT, justifyContent: 'center' },
  cancelText: { fontSize: fontSize.body },
  progressTrack: { height: 2 },
  progressBar: { height: 2 },
});
