const router = require('express').Router();
const {login, register} = require('./auth.controller');
const { registerValidator, loginValidator } = require("./auth.validator")

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
// router.post('/register',registerValidator, register);

module.exports = router;
