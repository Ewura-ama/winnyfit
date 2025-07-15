/**
 * Storage utility for persistent data
 */

/**
 * Get a value from local storage
 * @param {string} key - The key to retrieve
 * @returns {any} The stored value, or null if not found
 */
export const getFromStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    // Special handling for token which might be a string rather than JSON
    if (key === 'token') {
      try {
        // Try to parse as JSON first
        return JSON.parse(value);
      } catch (parseError) {
        // If it fails, just return the raw string value
        return value;
      }
    }
    
    // For other keys, try JSON parse
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

/**
 * Set a value in local storage
 * @param {string} key - The key to store
 * @param {any} value - The value to store
 * @returns {boolean} True if successful, false otherwise
 */
export const setInStorage = (key, value) => {
  try {
    // Special handling for token which might be a string
    if (key === 'token' && typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in storage:`, error);
    return false;
  }
};

/**
 * Remove a value from local storage
 * @param {string} key - The key to remove
 * @returns {boolean} True if successful, false otherwise
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

/**
 * Clear all values from local storage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}; 