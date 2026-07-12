import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SchemaService } from '../services/SchemaService';
import { renderScreen, handleAction } from '../core/SDUIEngine';
import { useSchemaHotReload } from '../hooks/useSchemaHotReload';
import DevToolbar from '../components/DevToolbar';
import { Logger } from '../utils/Logger';

export default function SDUIScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { screenName } = route.params || {};
  
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchema = useCallback(async (forceRefresh = false) => {
    if (!screenName) {
      setError('No screen name provided');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await SchemaService.fetchScreen(screenName, forceRefresh);
      setSchema(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [screenName]);

  useEffect(() => { fetchSchema(); }, [fetchSchema]);

  // 🔥 Hot reload with toggle
  const { isActive, toggle, refreshNow } = useSchemaHotReload(
    screenName,
    () => fetchSchema(true)
  );

  const onAction = useCallback((action) => {
    handleAction(action, navigation, {
      addToCart: (payload) => Logger.info('Cart:', payload),
      addToWishlist: (payload) => Logger.info('Wishlist:', payload),
    });
  }, [navigation]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Failed to load</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Text style={styles.retryButton} onPress={() => fetchSchema(true)}>Tap to retry</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {schema && renderScreen(schema, onAction)}
      
      {/* 🔥 Dev Toolbar — tap 🛠️ to open */}
      <DevToolbar
        screenName={screenName}
        onRefresh={refreshNow}
        isHotReloadActive={isActive}
        onToggleHotReload={toggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorTitle: { fontSize: 18, fontWeight: 'bold', color: '#c62828', marginBottom: 8 },
  errorText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  retryButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
});