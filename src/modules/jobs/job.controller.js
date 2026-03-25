const { validationResult } = require('express-validator')
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const { createJob, getJobs } = require('./job.service');

const create = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array());

    const job = await createJob(req.body, req.user._id);
    res.status(201).json(new ApiResponse(201, 'Job Created ', job));
})

const list = asyncHandler(async (req, res) => {
    const { limit, cursor, search, location, status, tag } = req.query;
    const result = await getJobs({ limit, cursor, search, location, tag, status });
    res.status(200).json(new ApiResponse(200, 'Job Fetched', result.jobs, { nextCursor: result.nextCursor }));
});

module.exports = { create, list };
