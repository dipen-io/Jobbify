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
    },
    userProfile: {
        getKey: (userId) => `user:profile:${userId}`,
        ttl: 1800, // 30 minutes

        // Helper to prepare the object for Redis Hashes
        prepare: (user) => ({
            _id: user._id.toString(),
            name: String(user.name),
            email: String(user.email),
            role: String(user.role),
            // Add other fields here, but keep them as strings/numbers
        })
    },
    jobDetails: {
        getKey: (jobId) => `job:details${jobId}`,
        ttl: 3600,
    }

};

module.exports = REDIS_SCHEMA;
