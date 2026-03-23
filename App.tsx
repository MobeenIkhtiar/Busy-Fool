import 'react-native-gesture-handler';
import { StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import 'react-native-reanimated';
import { ToastProvider } from './src/components/toast';

const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={styles.container}>
      <ToastProvider>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'dark-content'} />
      <AppNavigator />
      </ToastProvider>
    </SafeAreaView>
  )
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
};

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})