/**
 * Think of this as your "Mongoose Schema" for Redis.
 * It defines the structure and the TTL (Expiration).
 */
const REDIS_SCHEMA = {
    refreshToken: {
        prefix: 'auth:refresh:',
        ttl: 7 * 24 * 60 * 60,
        getKey: (userId) => `auth:refresh:${userId}`,

        // Helper to save specifically for ioredis
        save: async (redisClient, userId, token) => {
            const key = `auth:refresh:${userId}`;
            return await redisClient.set(key, token, 'EX', 604800);
        }
    },
    userSession: {
        prefix: 'sess:',
        ttl: 3600, // 1 hour
        getKey: (sessId) => `sess:${sessId}`
    }
};

module.exports = REDIS_SCHEMA;
