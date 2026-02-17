const memoryStorage = new Map<string, string>();

const localStorageShim: Storage = {
  get length(): number {
    return memoryStorage.size;
  },
  clear(): void {
    memoryStorage.clear();
  },
  getItem(key: string): string | null {
    return memoryStorage.has(key) ? (memoryStorage.get(key) as string) : null;
  },
  key(index: number): string | null {
    return [...memoryStorage.keys()][index] ?? null;
  },
  removeItem(key: string): void {
    memoryStorage.delete(key);
  },
  setItem(key: string, value: string): void {
    memoryStorage.set(key, value);
  },
};

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorageShim,
  });
}
