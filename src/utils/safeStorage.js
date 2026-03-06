const memoryStore = new Map();

const getBrowserStorage = () => {
  try {
    if (typeof window === "undefined") return null;
    const storage = window.localStorage;
    const probeKey = "__unicx_storage_probe__";
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
};

export const storageAvailable = () => getBrowserStorage() !== null;

export const safeGetItem = (key) => {
  const storage = getBrowserStorage();
  if (storage) {
    try {
      return storage.getItem(key);
    } catch {
      // fallback to memory store
    }
  }
  return memoryStore.has(key) ? memoryStore.get(key) : null;
};

export const safeSetItem = (key, value) => {
  const normalizedValue = String(value);
  memoryStore.set(key, normalizedValue);
  const storage = getBrowserStorage();
  if (!storage) return;
  try {
    storage.setItem(key, normalizedValue);
  } catch {
    // keep memory fallback only
  }
};

export const safeRemoveItem = (key) => {
  memoryStore.delete(key);
  const storage = getBrowserStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
};

export const safeKeysWithPrefix = (prefix) => {
  const keySet = new Set();

  memoryStore.forEach((_, key) => {
    if (key.startsWith(prefix)) keySet.add(key);
  });

  const storage = getBrowserStorage();
  if (!storage) return Array.from(keySet);

  try {
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) {
        keySet.add(key);
      }
    }
  } catch {
    // ignore
  }

  return Array.from(keySet);
};

