import { useEffect, useRef, useState, useCallback } from 'react';
import { GITHUB_BASE_URL } from '../services/SchemaService';
import { SchemaService } from '../services/SchemaService';
import { Logger } from '../utils/Logger';

const POLL_INTERVAL = 5000;
const IS_DEV = __DEV__;

export function useSchemaHotReload(screenName, onChange) {
  const [isActive, setIsActive] = useState(false);      // User toggle
  const [isWatching, setIsWatching] = useState(false);   // Actually polling
  const [lastChecked, setLastChecked] = useState(null);
  const lastHashRef = useRef(null);
  const intervalRef = useRef(null);

  // Toggle hot reload on/off
  const toggle = useCallback(() => {
    setIsActive(prev => {
      const next = !prev;
      Logger.info(`🔥 Hot reload ${next ? 'ENABLED' : 'DISABLED'}`);
      return next;
    });
  }, []);

  // Manual refresh on demand
  const refreshNow = useCallback(() => {
    Logger.info('🔥 Manual refresh triggered');
    SchemaService.invalidateScreen(screenName).then(() => {
      onChange();
      setLastChecked(new Date().toLocaleTimeString());
    });
  }, [screenName, onChange]);

  // Start/stop polling based on isActive
  useEffect(() => {
    if (!IS_DEV) return;
    if (!screenName) return;
    
    // STOP if not active
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsWatching(false);
      return;
    }

    // START polling
    if (!GITHUB_BASE_URL || GITHUB_BASE_URL.includes('YOUR_USERNAME')) {
      Logger.warn('🔥 Hot reload: GITHUB_BASE_URL not configured');
      setIsActive(false);
      return;
    }

    Logger.info(`🔥 Hot reload watching: ${screenName}`);
    setIsWatching(true);

    fetchSchemaHash(screenName).then(hash => {
      lastHashRef.current = hash;
      setLastChecked(new Date().toLocaleTimeString());
    });

    intervalRef.current = setInterval(async () => {
      try {
        const newHash = await fetchSchemaHash(screenName);
        setLastChecked(new Date().toLocaleTimeString());

        if (lastHashRef.current && newHash !== lastHashRef.current) {
          Logger.info(`🔥 Schema changed! Reloading ${screenName}...`);
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
    };
  }, [screenName, isActive, onChange]);

  return { isActive, isWatching, toggle, refreshNow, lastChecked };
}

async function fetchSchemaHash(screenName) {
  try {
    const url = `${GITHUB_BASE_URL}/${screenName}.json?t=${Date.now()}`;
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