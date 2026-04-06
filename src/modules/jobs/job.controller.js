const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { HTTP_STATUS } = require('../../constants/httpStatus');

const { createJob, getJobs, getJobById, searchJobs, updateJobs, deleteJob, getStats } = require('./job.service');

const create = asyncHandler(async (req, res) => {
    const job = await createJob(req.body, req.user._id);
    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(201, 'Job Created ', job));
})

const list = asyncHandler(async (req, res) => {
    const { limit, cursor, search, location, status, tag, skills, jobType, workMode } = req.query;
    const result = await getJobs({ limit, cursor, search, location, jobType, tag, status, skills, workMode });
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, 'Job Fetched', result.jobs  ,{ nextCursor: result.nextCursor, totalJobs: result.totalJobs }));
});

const singleJob = asyncHandler(async (req, res) => {
    const job = await getJobById(req.params.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "fetch single job", job));
});

const search = asyncHandler(async (req, res) => {
    const result = await searchJobs(req.query);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "Search result", result.jobs, {total: result.total}));
})

const update = asyncHandler(async (req, res) => {
    const job = await updateJobs(req.params.id, req.body, req.user._id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "updated job successfully", job));
});

const deletejob = asyncHandler(async(req, res) => {
    await deleteJob(req.params.id, req.user._id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, "job deleted"));
})

const stats = asyncHandler(async(req, res) => {
    const data = await getStats();  
    res.status(HTTP_STATUS.OK).json(new ApiResponse(200, 'Stats fetched', data));
});

module.exports = { create, list, singleJob, search, update, deletejob, stats };
