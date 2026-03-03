export const clearAetherCache = () => {
  localStorage.removeItem('aether_payload');
  localStorage.removeItem('aether_timestamp');
};

export const checkCacheTTL = () => {
  const timestamp = localStorage.getItem('aether_timestamp');
  if (timestamp) {
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 24 * 60 * 60 * 1000) { // 24 hours
      clearAetherCache();
      return false; // Cache invalid
    }
    return true; // Cache valid
  }
  return false;
};

export const saveToCache = (payload: any) => {
  localStorage.setItem('aether_payload', JSON.stringify(payload));
  localStorage.setItem('aether_timestamp', Date.now().toString());
};

export const getFromCache = () => {
  const payload = localStorage.getItem('aether_payload');
  return payload ? JSON.parse(payload) : null;
};
