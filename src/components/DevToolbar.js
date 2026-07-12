import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { CacheService } from '../services/CacheService';
import { Logger } from '../utils/Logger';

export default function DevToolbar({
  screenName,
  onRefresh,
  isHotReloadActive,
  onToggleHotReload,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const slideAnim = useState(new Animated.Value(0))[0];

  const IS_DEV = __DEV__;
  if (!IS_DEV) return null;

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setIsExpanded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  async function handleRefresh() {
    setLastRefresh(new Date().toLocaleTimeString());
    onRefresh();
    setIsExpanded(false);
  }

  async function handleClearCache() {
    await CacheService.clearAll();
    Logger.info('🗑️ Cache cleared manually');
    setCacheInfo('Cleared!');
    setTimeout(() => setCacheInfo(null), 1500);
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Floating Button */}
      {!isExpanded && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsExpanded(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>🛠️</Text>
          {isHotReloadActive && <View style={styles.hotIndicator} />}
        </TouchableOpacity>
      )}

      {/* Expanded Panel */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateY }] }]}
        pointerEvents={isExpanded ? 'auto' : 'none'}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>🛠️ SDUI Dev Tools</Text>
          <Pressable onPress={() => setIsExpanded(false)}>
            <Text style={styles.closeBtn}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Screen:</Text>
          <Text style={styles.value}>{screenName || 'None'}</Text>
        </View>

        {/* Hot Reload Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>🔥 Hot Reload</Text>
          <Pressable
            style={[
              styles.toggle,
              isHotReloadActive ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={onToggleHotReload}
          >
            <Text style={styles.toggleText}>
              {isHotReloadActive ? 'ON' : 'OFF'}
            </Text>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.actionBtn} onPress={handleRefresh}>
            <Text style={styles.actionBtnText}>🔄 Refresh</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={handleClearCache}>
            <Text style={styles.actionBtnText}>🗑️ Clear</Text>
          </Pressable>
        </View>

        {lastRefresh && (
          <Text style={styles.status}>Last refresh: {lastRefresh}</Text>
        )}
        {cacheInfo && <Text style={styles.status}>{cacheInfo}</Text>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 9999,
    elevation: 9999,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: { fontSize: 24 },
  hotIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#fff',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 280,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  closeBtn: { color: '#999', fontSize: 18, padding: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: { color: '#ccc', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '600' },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  toggleOn: { backgroundColor: '#34C759' },
  toggleOff: { backgroundColor: '#666' },
  toggleText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  status: { color: '#999', fontSize: 11, marginTop: 8, textAlign: 'center' },
});