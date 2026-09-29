import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BrowserScreen } from './src/screens/BrowserScreen';
import { AppStateProvider, useAppState } from './src/state/AppState';
import { useTheme } from './src/ui/theme';

function Root() {
  const { ready } = useAppState();
  const { colors } = useTheme();
  // Wait for persisted settings so the first page loads with the right size and start page.
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.chrome }} />;
  return <BrowserScreen />;
}

export default function App() {
  useEffect(() => {
    // Allow landscape: a large virtual monitor is far more readable sideways.
    ScreenOrientation.unlockAsync().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="auto" />
        <Root />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
