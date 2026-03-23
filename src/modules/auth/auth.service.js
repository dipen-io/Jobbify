const jwt = require('jsonwebtoken');
const User = require('./user.model')
const ApiError = require('../../utils/ApiError');

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
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };


}

const loginUser = async({email, password}) => {
    const user = await User.findOne({email}).select('+password');
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid email or password');

    const { accessToken ,  refreshToken } = generateToken(user._id, user.role);
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false });
  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
}

module.exports = { registerUser, loginUser };
