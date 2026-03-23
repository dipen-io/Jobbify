const {validationResult} = require('express-validator');
const { loginUser, registerUser } = require('./auth.service');
const  asyncHandler = require('../../utils/asyncHandler')
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation falied', errors.array());
    }

    const result  = await registerUser(req.body);
    res.status(201).json(new ApiResponse(201, 'Registration Successfull', result));
})

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation Failed', errors.array());
    }
    const result = await loginUser(req.body);
    res.status(200).json(new ApiResponse(200, "Login Successfull", result));
})

module.exports = { register, login };
