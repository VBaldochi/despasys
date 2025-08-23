// Cache simples em memória para desenvolvimento
interface CacheItem {
  data: any
  expiry: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem>()
  private defaultTTL = 1000 * 60 * 5 // 5 minutos

  set(key: string, data: any, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { data, expiry })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Limpeza automática de itens expirados
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new SimpleCache()

// Limpeza automática a cada 10 minutos
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 1000 * 60 * 10)
}

export function getCacheKey(prefix: string, tenantId: string, ...args: string[]): string {
  return `${prefix}:${tenantId}:${args.join(':')}`
}
