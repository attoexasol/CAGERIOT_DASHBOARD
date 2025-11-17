/**
 * Demo Storage - In-memory storage for demo mode
 * Persists created/updated data during demo mode session
 */

interface DemoStorage {
  releases: any[];
  artists: any[];
  tracks: any[];
  videos: any[];
  labels: any[];
  publishers: any[];
  writers: any[];
  producers: any[];
  performers: any[];
  payouts: any[];
  royalties: any[];
  user: any | null;
}

// In-memory storage for demo mode
const storage: DemoStorage = {
  releases: [],
  artists: [],
  tracks: [],
  videos: [],
  labels: [],
  publishers: [],
  writers: [],
  producers: [],
  performers: [],
  payouts: [],
  royalties: [],
  user: null,
};

export const demoStorage = {
  // Generic add method
  add<T>(key: keyof DemoStorage, item: T): void {
    storage[key].push(item);
  },

  // Generic get all method
  getAll<T>(key: keyof DemoStorage): T[] {
    return storage[key] as T[];
  },

  // Generic get by ID method
  getById<T extends { id: string }>(key: keyof DemoStorage, id: string): T | undefined {
    return storage[key].find((item: any) => item.id === id) as T | undefined;
  },

  // Generic update method
  update<T extends { id: string }>(key: keyof DemoStorage, id: string, data: Partial<T>): T | undefined {
    const index = storage[key].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      storage[key][index] = { ...storage[key][index], ...data };
      return storage[key][index] as T;
    }
    return undefined;
  },

  // Generic delete method
  delete(key: keyof DemoStorage, id: string): boolean {
    const index = storage[key].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      storage[key].splice(index, 1);
      return true;
    }
    return false;
  },

  // Clear all storage (for testing)
  clear(): void {
    Object.keys(storage).forEach(key => {
      storage[key as keyof DemoStorage] = [];
    });
  },

  // Clear specific storage
  clearKey(key: keyof DemoStorage): void {
    if (key === 'user') {
      storage[key] = null;
    } else {
      storage[key] = [];
    }
  },

  // User-specific methods
  setUser(user: any): void {
    storage.user = user;
  },

  getUser(): any | null {
    return storage.user;
  },
};
