const { validationResult } = require('express-validator')
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const { createJob, getJobs, getJobById, searchJobs, updateJobs, deleteJob, getStats } = require('./job.service');

const create = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array());

    const job = await createJob(req.body, req.user._id);
    res.status(201).json(new ApiResponse(201, 'Job Created ', job));
})

const list = asyncHandler(async (req, res) => {
    const { limit, cursor, search, location, status, tag, skills, jobType, workMode } = req.query;
    const result = await getJobs({ limit, cursor, search, location, jobType, tag, status, skills, workMode });
    res.status(200).json(new ApiResponse(200, 'Job Fetched', result.jobs  ,{ nextCursor: result.nextCursor, totalJobs: result.totalJobs }));
});

const singleJob = asyncHandler(async (req, res) => {
    const job = await getJobById(req.params.id);
    res.status(200).json(new ApiResponse(200, "fetch single job", job));
});

const search = asyncHandler(async (req, res) => {
    console.log("search working ");
    const result = await searchJobs(req.query);
    res.status(200).json(new ApiResponse(200, "Search result", result.jobs, {total: result.total}));
})

const update = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, "Validation failed", errors.array());
    }
    const job = await updateJobs(req.params.id, req.body, req.user._id);
    res.status(200).json(new ApiResponse(200, "updated job successfully", job));
});

const deletejob = asyncHandler(async(req, res) => {
    await deleteJob(req.params.id, req.user._id);
    res.status(200).json(new ApiResponse(200, "job deleted"));
})

const stats = asyncHandler(async(req, res) => {
    const data = await getStats();  
    res.status(200).json(new ApiResponse(200, 'Stats fetched', data));
});

module.exports = { create, list, singleJob, search, update, deletejob, stats };
