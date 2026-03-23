const router = require('express').Router();
const protect = require('../../middleware/auth');
const {login, register, refreshToken, getMe } = require('./auth.controller');
const { registerValidator, loginValidator } = require("./auth.validator")

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/refresh', refreshToken);
router.get('/me', protect,  getMe);

module.exports = router;
