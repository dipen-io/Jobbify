const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler");
const redis  = require('../config/redis');
const { userProfile } = require('../redis/schema');

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new ApiError(401, 'No Token Provided');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired token');
    }

    // 1. GENERATE KEY (using just the ID from the decoded token)
    const profileKey = userProfile.getKey(decoded.id);

    // 2. TRY CACHE (Lowercase hgetall for ioredis)
    const cachedUser = await redis.hgetall(profileKey);

    // ioredis returns an empty object {} if the key doesn't exist
    if (cachedUser && Object.keys(cachedUser).length > 0) {
        req.user = cachedUser; 
        return next(); // Exit early! No need to touch MongoDB.
    }

    // 3. CACHE MISS -> NOW hit MongoDB
    const user = await User.findById(decoded.id).lean(); // .lean() makes it a plain JS object

    if (!user) throw new ApiError(401, "User no longer exists");

    // 4. SAVE TO CACHE (Lowercase hset)
    const userData = userProfile.prepare(user); 
    await redis.hset(profileKey, userData);
    await redis.expire(profileKey, userProfile.ttl); // Set expiration!

    req.user = user;
    next();
});

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new ApiError(403, `Access defined for role ${req.user.role}`)
    }
    next();
}
module.exports = { protect, authorize };
