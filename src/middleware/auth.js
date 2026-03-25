const jwt = require('jsonwebtoken');
const User = require('../modules/auth/user.model');
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new ApiError(401, 'No Token Provided');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired token');
    }
    const user = await User.findById(decoded.id);

    if (!user) throw new ApiError(401, "User no longer exists")

    req.user = user;
    next();

})

const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new ApiError(403, `Access defined for role ${req.user.role}`)
    }
    next();
}
module.exports = { protect, authorize };
// module.exports.authorize = authorize;
