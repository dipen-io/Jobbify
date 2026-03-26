const Job = require('./job.model');
const User = require('../auth/user.model');
const mongoose = require('mongoose');
const ApiError = require('../../utils/ApiError');
// const redis = require('../../config/redis');

const CACHE_TTL = 60; // seconds 

// create
const createJob = async (data, userId) => {
    const job = await Job.create({ ...data, postedBy: userId });
    // await redis.del('jobbify:stats'); //invalidate status cache
    return job;
};

// -- Get all jobs(cursor pagination + filters)
const getJobs = async ({ limit = 10, search, cursor, location, status, tag, skills, jobType, workMode }) => {
    const andConditions = [];

    if (search) {
        andConditions.push({ $text: { $search: search } });
    }
    if (workMode) {
        andConditions.push({ workMode })
    }
    if (jobType) {
        andConditions.push({ jobType})
    }
    if (skills) {
        andConditions.push({ skills })
    }
    // if (location) {
    //     andConditions.push({ location: new RegExp(location, 'i') });
    // }
    if (location) {
        andConditions.push({ location });
    }
    if (status) {
        andConditions.push({ status })
    }
    if (tag) {
        andConditions.push({ tag });
    }

    //Handle cursor pagination
    if (cursor) {
        try {
            const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
            // validate decoded has the valid fields
            if (!decoded.createdAt || !decoded._id) {
                throw new ApiError(401, "Invalid cursor format");
            }
            andConditions.push({
                $or: [
                    { createdAt: { $lt: new Date(decoded.createdAt) } },
                    {
                        createdAt: new Date(decoded.createdAt),
                        _id: { $lt: new mongoose.Types.ObjectId(decoded._id) }
                    }
                ]
            });
        } catch (error) {
            throw new ApiError(401, "Invalid cursor", error.message);
        }
    }


    // build the final filter
    const filter = andConditions.length > 0 ? { $and: andConditions } : {};
    // determine sort order 
    const sortOptions = search
        ? { score: { $meta: 'textScore' }, createdAt: -1, _id: -1 }
        : { createdAt: -1, _id: -1 };

    const jobs = await Job.find(filter)
        .sort(sortOptions)
        .limit(Number(limit) + 1) // fetch one extra to check if next page exists
        .lean()
        .populate('postedBy', 'name email');

    // handle pagination
    const hasNext = jobs.length > limit
    if (hasNext) jobs.pop();
    const totalJobs = await Job.countDocuments(filter);

    let nextCursor = null;
    if (hasNext) {
        const last = jobs[jobs.length - 1]
        nextCursor = Buffer.from(
            JOSN.stringify({
                createdAt: last.createdAt.toISOString(),
                _id: last._id.toString()
            })
        ).toString('base64');
    }
    return { jobs, nextCursor, totalJobs };
    // return { data: jobs, nextCursor, hasNext };
};

module.exports = {
    createJob, getJobs
};
