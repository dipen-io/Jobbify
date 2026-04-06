const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth')
const { create, list, singleJob, search, update, deletejob, stats } = require('./job.controller');
const { createJobValidator, updateJobValidator, paginationValidator } = require('./job.validator');
const validate = require('../../middleware/validate');

router.post('/', protect, authorize('recruiter'), createJobValidator, validate, create);
router.get('/', paginationValidator ,list);
router.get('/search', search);
router.get('/stats', stats);

router.get('/:id', singleJob);
router.delete('/:id', protect,authorize('recruiter'), deletejob );
router.patch('/:id', protect,authorize('recruiter'), updateJobValidator, validate, update );

module.exports = router;
