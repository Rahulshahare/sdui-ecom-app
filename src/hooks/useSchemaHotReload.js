import { useEffect, useRef, useState } from 'react';
import { GITHUB_BASE_URL } from '../services/SchemaService';  // ← Import directly!
import { SchemaService } from '../services/SchemaService';
import { Logger } from '../utils/Logger';

const POLL_INTERVAL = 5000; // 5 seconds
const IS_DEV = __DEV__;

/**
 * useSchemaHotReload — Auto-refresh schema when GitHub changes (dev only)
 */
export function useSchemaHotReload(screenName, onChange) {
  const [isWatching, setIsWatching] = useState(false);
  const lastHashRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!IS_DEV) {
      Logger.info('Hot reload disabled in production');
      return;
    }

    if (!screenName) return;

    // Check if GitHub URL is configured
    if (!GITHUB_BASE_URL || GITHUB_BASE_URL.includes('YOUR_USERNAME')) {
      Logger.warn('🔥 Hot reload: GITHUB_BASE_URL not configured. Please update SchemaService.js');
      return;
    }

    Logger.info(`🔥 Hot reload watching: ${screenName}`);

    fetchSchemaHash(screenName).then(hash => {
      lastHashRef.current = hash;
      setIsWatching(true);
    });

    intervalRef.current = setInterval(async () => {
      try {
        const newHash = await fetchSchemaHash(screenName);
        
        if (lastHashRef.current && newHash !== lastHashRef.current) {
          Logger.info(`🔥 Schema changed for ${screenName}! Reloading...`);
          await SchemaService.invalidateScreen(screenName);
          onChange();
          lastHashRef.current = newHash;
        }
      } catch (error) {
        Logger.debug('Hot reload poll failed:', error.message);
      }
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsWatching(false);
      Logger.info(`🔥 Hot reload stopped for: ${screenName}`);
    };
  }, [screenName, onChange]);

  return { isWatching };
}

/**
 * Fetch schema and return a simple hash for comparison
 */
async function fetchSchemaHash(screenName) {
  try {
    const url = `${GITHUB_BASE_URL}/${screenName}.json?t=${Date.now()}`;
    
    Logger.debug(`🔥 Hot reload polling: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const text = await response.text();
    return `${text.length}-${text.slice(0, 100)}`;
  } catch (error) {
    return null;
  }
}