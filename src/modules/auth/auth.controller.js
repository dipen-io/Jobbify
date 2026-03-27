const {validationResult} = require('express-validator');
const { loginUser, registerUser, refreshAccessToken } = require('./auth.service');
const  asyncHandler = require('../../utils/asyncHandler')
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const redis   = require('../../config/redis');

const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation falied', errors.array());
    }

    const result  = await registerUser(req.body);
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,      // true in production (HTTPS)
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(201).json(new ApiResponse(201, 'Registration Successfull', result));
})

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation Failed', errors.array());
    }
    const result = await loginUser(res, req.body);
    res.status(200).json(new ApiResponse(200, "Login Successfull", result));
})

const refreshToken = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body
    const result = await refreshAccessToken(refreshToken);

    res.status(200).json(new ApiResponse(200, "Token Refreshed", result));
})

const getMe = asyncHandler(async(req,res)=> {
    res.status(200).json(new ApiResponse(200, "fetch user", req.user));
})

module.exports = { register, login, getMe, refreshToken };
