const Job = require('./job.model');
const User = require('../auth/user.model');
// const redis = require('../../config/redis');

const CACHE_TTL = 60; // seconds 

// create
const createJob = async(data, userId)  => {
    const job = await Job.create({...data, postedBy: userId});
    // await redis.del('jobbify:stats'); //invalidate status cache
    return job;
};

// -- Get all jobs(cursor pagination + filters)
const getJobs = async ({ limit = 10, cursor, location, status, tag }) => {
    const filter = {};
    if (location) filter.location = new RegExp(location, 'i');
    if (status) filter.status = status;
    if (tag) filter.tag = tag;

    if (cursor) {
        const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
        filter.$or = [
            {createdAt: {$lt: new Date(decoded.createdAt) } },
            {
                createdAt: new Date(decoded.createdAt),
                _id: { $lt: decoded._id },
            },
        ];
    }

    const jobs = await Job.find(filter)
    .sort({ createdAt: -1, _id: -1})
    .limit(Number(limit) + 1) // fetch one extra to check i fnext page exists
    .populate('postedBy', 'name email');

    //encoded next cousor
    const hasNext = jobs.length > limit;
    if (hasNext) jobs.pop();

    //
};
