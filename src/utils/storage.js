/**
 * Safe LocalStorage utility helpers for BookBridge
 */

const STORAGE_PREFIX = 'bookbridge_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing BookBridge storage:', error);
      return false;
    }
  }
};

