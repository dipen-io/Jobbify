const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth')
const { create, list } = require('./job.controller');
const { createJobValidator, updateJobValidator, paginationValidator } = require('./job.validator');

router.post('/', protect, authorize('recruiter'), createJobValidator, create);
router.get('/', paginationValidator ,list);

module.exports = router;
