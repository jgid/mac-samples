import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { displayUrl, TEST_PAGE_URL } from '../core/url';
import { useAppState } from '../state/AppState';
import { Row, Section, Separator, Sheet } from './Sheet';
import { fontSize, HIT, spacing, useTheme } from './theme';

export interface BookmarksSheetProps {
  visible: boolean;
  onClose(): void;
  currentUrl: string;
  currentTitle: string;
  onOpen(url: string): void;
}

function shortUrl(url: string): string {
  return url === TEST_PAGE_URL ? 'Testseite' : displayUrl(url);
}

export function BookmarksSheet({ visible, onClose, currentUrl, currentTitle, onOpen }: BookmarksSheetProps) {
  const { colors } = useTheme();
  const { bookmarks, addBookmark, removeBookmark } = useAppState();
  const alreadySaved = bookmarks.some((b) => b.url === currentUrl);
  const canAdd = !!currentUrl && !alreadySaved;

  return (
    <Sheet visible={visible} title="Lesezeichen" onClose={onClose}>
      <Section footer={alreadySaved ? 'Diese Seite ist bereits gespeichert.' : undefined}>
        <Row
          icon="add-circle-outline"
          title="Aktuelle Seite hinzufügen"
          subtitle={currentUrl ? currentTitle || shortUrl(currentUrl) : undefined}
          disabled={!canAdd}
          onPress={() => addBookmark({ title: currentTitle || shortUrl(currentUrl), url: currentUrl })}
        />
      </Section>

      <Section title="Gespeichert">
        {bookmarks.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={28} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Noch keine Lesezeichen. Öffne eine Seite und tippe auf „Aktuelle Seite hinzufügen“.
            </Text>
          </View>
        ) : (
          bookmarks.map((b, i) => (
            <View key={b.id}>
              {i > 0 ? <Separator /> : null}
              <Row
                title={b.title}
                subtitle={shortUrl(b.url)}
                onPress={() => {
                  onOpen(b.url);
                  onClose();
                }}
                accessibilityLabel={`${b.title} öffnen`}
                right={
                  <Pressable
                    onPress={() => removeBookmark(b.id)}
                    style={styles.trash}
                    accessibilityRole="button"
                    accessibilityLabel={`Lesezeichen ${b.title} löschen`}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                }
              />
            </View>
          ))
        )}
      </Section>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  emptyText: { fontSize: fontSize.subhead, textAlign: 'center', lineHeight: 21 },
  trash: { width: HIT, height: HIT, alignItems: 'center', justifyContent: 'center', marginRight: -spacing.sm },
});
