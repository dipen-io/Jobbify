const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth')
const { create, list, singleJob, search, update, deletejob } = require('./job.controller');
const { createJobValidator, updateJobValidator, paginationValidator } = require('./job.validator');

router.post('/', protect, authorize('recruiter'), createJobValidator, create);
router.get('/', paginationValidator ,list);
router.get('/search', search);

router.get('/:id', singleJob);
router.delete('/:id', protect,authorize('recruiter'), deletejob );
router.patch('/:id', protect,authorize('recruiter'), updateJobValidator, update );

module.exports = router;
