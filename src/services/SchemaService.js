import { Logger } from '../utils/Logger';
import { CacheService } from './CacheService';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/github-schemas';

export const SchemaService = {
  async fetchScreen(screenName, forceRefresh = false) {
    Logger.info(`Fetching schema for screen: ${screenName}`);

    if (!forceRefresh) {
      const cached = await CacheService.get(screenName);
      if (cached) {
        Logger.info(`Returning cached schema for: ${screenName}`);
        return cached;
      }
    }

    try {
      const url = `${GITHUB_BASE_URL}/${screenName}.json`;
      Logger.debug(`Fetching from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const schema = await response.json();
      
      if (!schema || !schema.type) {
        throw new Error('Invalid schema: missing required "type" field');
      }

      await CacheService.set(screenName, schema);
      
      Logger.info(`Schema fetched and cached for: ${screenName}`);
      return schema;

    } catch (error) {
      Logger.error(`Failed to fetch schema "${screenName}":`, error.message);
      
      const stale = await CacheService.get(screenName);
      if (stale) {
        Logger.warn(`Returning stale cache for: ${screenName}`);
        return stale;
      }
      
      throw error;
    }
  },

  async fetchMultipleScreens(screenNames) {
    const results = {};
    
    await Promise.all(
      screenNames.map(async (name) => {
        try {
          results[name] = await this.fetchScreen(name);
        } catch (error) {
          Logger.error(`Failed to fetch ${name}:`, error.message);
          results[name] = null;
        }
      })
    );
    
    return results;
  },

  async invalidateScreen(screenName) {
    await CacheService.clear(screenName);
    Logger.info(`Invalidated cache for: ${screenName}`);
  },

  async invalidateAll() {
    await CacheService.clearAll();
    Logger.info('All screen caches invalidated');
  },
};