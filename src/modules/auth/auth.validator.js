const { body } = require('express-validator');

const registerValidator = [
    body('name').trim().notEmpty().withMessage('Name is requried'),
    body('email').isEmail().withMessage('Email is requried'),
    body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 character '),
    body('role')
    .optional()
    .isIn(['recruiter', 'applicant'])
    .withMessage('Role must be recruiter or applicant')
];

const loginValidator = [
    body('email').isEmail().withMessage('Valid email is requried'),
    body('password')
    .isLength({min: 6})
    .withMessage('Password is required'),
]

module.exports = { registerValidator, loginValidator };
