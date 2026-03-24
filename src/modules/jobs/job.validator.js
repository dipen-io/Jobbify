const {body, query} = require('express-validator');

const createJobValidator = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('location').trim().notEmpty().withMessage('location is required'),
    body('salary.min')
    .optional()
    .isNumeric()
    .withMessage('Salary min must be a number'),
    body('salary.max')
    .optional()
    .isNumeric()
    .withMessage('salary max must be a nunber'),
    body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be an open or closed'),
];

const updateJobValidator = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('Description').optional().trim().notEmpty(),
    body('salary.min').optional().isNumeric(),
    body('salary.max').optional().isNumeric(),
    body('status').optional().isIn(['open', 'closed'])
];

const paginationValidator  = [
    query('limit')
    .optional()
    .isIn({min: 1, max: 50})
    .withMessage('Limit must be between 1 and 50'),
    query('cursor').optional().isString(),
];

module.exports = { createJobValidator, updateJobValidator, paginationValidator };

