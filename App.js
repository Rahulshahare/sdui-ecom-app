import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';  
import AppNavigator from './src/navigation/AppNavigator';
import { Logger } from './src/utils/Logger';

export default function App() {
  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    checkForOTAUpdates();
  }, []);

  async function checkForOTAUpdates() {
    try {
      Logger.info('Checking for OTA updates...');
      
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        Logger.info('New update found! Fetching...');
        await Updates.fetchUpdateAsync();
        Logger.info('Update fetched. Reloading app...');
        await Updates.reloadAsync();
      } else {
        Logger.info('App is up to date');
      }
    } catch (error) {
      Logger.error('OTA Update check failed:', error.message);
      setUpdateError(error.message);
    } finally {
      setIsUpdateChecked(true);
    }
  }

  if (!isUpdateChecked) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Checking for updates...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
});