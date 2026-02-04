import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let client: ReturnType<typeof createClient>;
let globalRedis: typeof globalThis & { _redisClientPromise?: ReturnType<typeof createClient> } = globalThis;

if (process.env.NODE_ENV === 'production') {
  client = createClient({ url: REDIS_URL });
  client.connect(); // Connect in production
} else {
  if (!globalRedis._redisClientPromise) {
    client = createClient({ url: REDIS_URL });
    globalRedis._redisClientPromise = client;
    client.connect().then(() => console.info('NextJS Redis client connected'));
  }
  client = globalRedis._redisClientPromise;
}

export { client };