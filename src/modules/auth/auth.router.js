const router = require('express').Router();
const { protect } = require('../../middleware/auth');
const { login, register, refreshToken, getMe } = require('./auth.controller');
const { registerValidator, loginValidator } = require("./auth.validator")
const validate = require("../../middleware/validate");

router.post('/register', registerValidator, validate ,register);
router.post('/login', loginValidator,validate, login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

module.exports = router;
