import secureLocalStorage from 'react-secure-storage';

export const clearAetherCache = () => {
  secureLocalStorage.removeItem('aether_payload');
  secureLocalStorage.removeItem('aether_timestamp');
};

export const checkCacheTTL = () => {
  const timestamp = secureLocalStorage.getItem('aether_timestamp');
  if (timestamp) {
    const age = Date.now() - parseInt(timestamp as string, 10);
    if (age > 24 * 60 * 60 * 1000) { // 24 hours
      clearAetherCache();
      return false; // Cache invalid
    }
    return true; // Cache valid
  }
  return false;
};

export const saveToCache = (payload: any) => {
  secureLocalStorage.setItem('aether_payload', JSON.stringify(payload));
  secureLocalStorage.setItem('aether_timestamp', Date.now().toString());
};

export const getFromCache = () => {
  const payload = secureLocalStorage.getItem('aether_payload');
  if (payload && typeof payload === 'string') {
    try {
      return JSON.parse(payload);
    } catch (e) {
      console.error("Failed to parse encrypted payload", e);
      return null;
    }
  }
  return null;
};
