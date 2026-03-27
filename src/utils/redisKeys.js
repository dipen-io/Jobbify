// redisKeys.js

/**
 * A central place to manage all Redis key patterns.
 * This acts as your "Schema" definition.
 */
const REDIS_KEYS = {
    // Auth related keys
    refreshToken: (userId) => `auth:refresh:${userId}`,
    
    // User profile cache
    userProfile: (userId) => `cache:user:${userId}`,
    
    // Rate limiting
    otpAttempt: (email) => `limit:otp:${email}`,
};

exports.module = REDIS_KEYS;
