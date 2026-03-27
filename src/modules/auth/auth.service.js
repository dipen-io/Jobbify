const jwt = require('jsonwebtoken');
const User = require('./user.model')
const ApiError = require('../../utils/ApiError');
const bcrypt = require("bcryptjs");
const redis = require('../../config/redis');
const  REDIS_SCHEMA  = require('../../redis/schema');

const generateToken = async(userId, role) => {
   const accessToken = jwt.sign(
        {id: userId, role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || '15m'}
    ) 

    const refreshToken = jwt.sign(
        {id: userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'}
    )
    return { accessToken, refreshToken };
}

const registerUser = async ({name, email, password, role}) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, 'Email already in use');

    const user = await User.create({
        name, email, password, role 
    });
    const {accessToken, refreshToken} = await generateToken(user._id, user.role);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save({ validateBeforeSave: false });

  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };

}

const loginUser = async(res, { email, password}) => {
    const user = await User.findOne({email}).select('+password');
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid email or password');

    const { accessToken , refreshToken } = await  generateToken(user._id, user.role);
    /*
     * db hit on every login
     * harder to make multiple session
     * slower tokens validation
     * better approach is 
     * store in redis
    */

    const hashedToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedToken; 
    await user.save({ validateBeforeSave: false });
    const key = REDIS_SCHEMA.refreshToken.getKey(user._id);
    // await redis.set(
    //     key,
    //     refreshToken, 
    //     {
    //         EX: 7 * 24 * 60 * 60 // 7 days
    //     }
    // )
    await REDIS_SCHEMA.refreshToken.save(redis, user._id, hashedToken);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
}

const refreshAccessToken = async(res, token) => {
    if (!token) throw new ApiError(401, 'Refresh Token is required')
    let decoded; 
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
        throw new ApiError (401, 'User not found or token missing');
    } 

    // const storeToken = await redis.get(`refresh${user._id}`);
    const storeToken = await redis.get(REDIS_SCHEMA.refreshToken.getKey(user._id));

    const isMatch =  await bcrypt.compare(token, user.refreshToken);
    const isMatched = await bcrypt.compare(token, storeToken);
    if (!isMatch) {
        throw new ApiError(401, 'Refresh token missmatch');
    }
    if (!isMatched) {
        throw new ApiError(401, 'Refresh token missmatch');
    }
    const {accessToken, refreshToken} = await generateToken(user._id, user.role);
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedToken;
    await user.save({ validateBeforeSave: false }); 

    await REDIS_SCHEMA.refreshToken.save(redis, user._id, hashedToken);
    // UPDATE THE COOKIE (Overwrite the old one)
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return { accessToken, refreshToken };
}

module.exports = { registerUser, loginUser, refreshAccessToken };
