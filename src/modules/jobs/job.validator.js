const {body, query} = require('express-validator');

const createJobValidator = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('company.name').trim().notEmpty().withMessage('Company Name is required'),
    body('company.website').optional().isURL().withMessage('Company website must be a valid url'),
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

    body('jobType')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('Invalid Job type'),

    body('workMode')
    .optional()
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Invalid work mode'),

    body('experienceLevel')
    .optional()
    .isIn(['junior', 'senior', 'mid'])
    .withMessage('Invalid experience level'),

    body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),

    body('skills.*')
    .optional()
    .isString()
    .withMessage('Each Skills must be a string'),

    body('dealine')
    .optional()
    .isString()
    .withMessage('Deadline must be a valid date')
];

const updateJobValidator = [
    body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

    body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

    body('company.name')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty'),

    body('company.website')
    .optional()
    .isURL().withMessage('Invalid company website URL'),

    body('location')
    .optional()
    .trim()
    .notEmpty().withMessage('Location cannot be empty'),

    body('salary.min')
    .optional()
    .isNumeric().withMessage('Min salary must be a number'),

    body('salary.max')
    .optional()
    .isNumeric().withMessage('Max salary must be a number'),

    // custom validator for salary logic
    body('salary')
    .optional()
    .custom((value) => {
        if (value.min != null && value.max != null && value.min > value.max) {
            throw new Error("Min salary can't be greater than max salary");
        }
        return true;
    }),

    body('jobType')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('Invalid job type'),

    body('workMode')
    .optional()
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Invalid work mode'),

    body('experienceLevel')
    .optional()
    .isIn(['junior', 'mid', 'senior'])
    .withMessage('Invalid experience level'),

    body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),

    body('skills.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Skill cannot be empty'),

    body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),

    body('tags.*')
    .optional()
    .trim(),

    body('deadline')
    .optional()
    .isISO8601().withMessage('Invalid date format'),

    body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Invalid status'),
];

const paginationValidator  = [
    query('limit')
    .optional()
    .isIn({min: 1, max: 50})
    .withMessage('Limit must be between 1 and 50'),
    query('cursor').optional().isString(),
];

module.exports = { createJobValidator, updateJobValidator, paginationValidator };

