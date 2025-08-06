import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native'
import React from 'react'
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  )
};

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})