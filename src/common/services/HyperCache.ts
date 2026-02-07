interface CacheEntry<T> {
  data: T;
  expiry: number;
  key: string;
}

class HyperCacheService {
  private memoryCache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (entry && Date.now() < entry.expiry) return entry.data;
    this.memoryCache.delete(key);
    return undefined;
  }

  async set<T>(key: string, data: T, ttlMs?: number): Promise<void> {
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + (ttlMs ?? this.defaultTTL),
      key,
    });
  }

  invalidate(pattern: string): void {
    const toDelete: string[] = [];
    this.memoryCache.forEach((_value, key) => {
      if (key.indexOf(pattern) === 0) toDelete.push(key);
    });
    toDelete.forEach(key => this.memoryCache.delete(key));
  }

  clear(): void {
    this.memoryCache.clear();
  }
}

export const hyperCache = new HyperCacheService();
