const { loginUser, registerUser, refreshAccessToken } = require('./auth.service');
const  asyncHandler = require('../../utils/asyncHandler')
const ApiResponse = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../constants/httpStatus');


const register = asyncHandler(async (req, res) => {
    const result  = await registerUser(req.body);
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,      // true in production (HTTPS)
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(201, 'Registration Successfull', result));
})

const login = asyncHandler(async (req, res) => {
    const result = await loginUser(res, req.body);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "Login Successfull", result));
})

const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await refreshAccessToken(res,refreshToken);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "Token Refreshed", result));
})

const getMe = asyncHandler(async(req,res)=> {
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "fetch user", req.user));
})

module.exports = { register, login, getMe, refreshToken };
