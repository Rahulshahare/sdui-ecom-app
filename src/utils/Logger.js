const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

export const Logger = {
  debug: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(`[SDUI-DEBUG] ${message}`, ...args);
    }
  },

  info: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.log(`[SDUI-INFO] ${message}`, ...args);
    }
  },

  warn: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(`[SDUI-WARN] ${message}`, ...args);
    }
  },

  error: (message, ...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(`[SDUI-ERROR] ${message}`, ...args);
    }
  },
};