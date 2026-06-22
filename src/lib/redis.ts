import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  __redis: Redis | undefined;
};

const redis =
  globalForRedis.__redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 0,
    connectTimeout: 500,
    lazyConnect: true,
    enableOfflineQueue: false,
  });

// Evita crash por unhandled error event quando Redis não está disponível
redis.on("error", () => {});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.__redis = redis;
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (err) {
    console.error(`[Redis] getCache error for key "${key}":`, err);
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error(`[Redis] setCache error for key "${key}":`, err);
  }
}

export async function delCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`[Redis] delCache error for key "${key}":`, err);
  }
}

export default redis;
