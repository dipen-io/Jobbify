const mongoose = require('mongoose');
const ApiError = require('../../utils/ApiError');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxLength : [100, 'Title cannot be exceded 100 character'],
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        maxLength : [5000, 'Title cannot be exceded 5000 character'],
    },
    company: {
        name : {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        website: {
            type : String,
        },
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    salary: {
        min: {type: Number, default: 0},
        max: {type: Number, default: 0},
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    workMode: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        default: 'onsite'
    },
    experienceLevel : {
        type: String,
        enum: ['junior', 'mid', 'senior'],
        defualt: 'junior'
    },
    skills: [
        {
            type: String,
            trim: true
        }
    ],
    deadline: {
        type: Date,
    },
    tags: {
        type: [String],
        defautl: []
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        defautl: 'open'
    },
    views: {
        type: Number,
        default: 0
    },
    applicantsCount: {
        type: Number,
        default: 0
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true })

// prevent invalid salary
jobSchema.pre('save', async function () {
    if (this.salary?.min && this.salary?.max) {
        if (this.salary.min > this.salary.max) {
            throw new Error("Min salary can't be greater than max salary");
        }
    }
});

// auto close expired jobs
jobSchema.pre('find', function () {
    this.where({
        $or: [
            { deadline: { $exists: false } },
            { deadline: { $gte: new Date()} }
        ]
    });
});

//indexes
jobSchema.index({location: 1, status: 1});
jobSchema.index({title: 'text', description: 'text', skills: 'text'});
jobSchema.index({createdAt: -1});
jobSchema.index({createdAt: -1, _id: -1}); // cursor pagination

module.exports = mongoose.model('Job', jobSchema);
