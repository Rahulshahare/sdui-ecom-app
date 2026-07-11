import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from '../utils/Logger';

const CACHE_PREFIX = '@sdui_cache_';
const DEFAULT_TTL = 5 * 60 * 1000;

export const CacheService = {
  async get(key) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const { data, timestamp, ttl } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > ttl) {
        Logger.info(`Cache expired for key: ${key}`);
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }
      
      Logger.debug(`Cache hit for key: ${key}`);
      return data;
    } catch (error) {
      Logger.error('Cache get error:', error.message);
      return null;
    }
  },

  async set(key, data, ttl = DEFAULT_TTL) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      Logger.debug(`Cache set for key: ${key}`);
    } catch (error) {
      Logger.error('Cache set error:', error.message);
    }
  },

  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sduiKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(sduiKeys);
      Logger.info('All SDUI cache cleared');
    } catch (error) {
      Logger.error('Cache clear error:', error.message);
    }
  },

  async clear(key) {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      Logger.debug(`Cache cleared for key: ${key}`);
    } catch (error) {
      Logger.error('Cache clear error:', error.message);
    }
  },
};