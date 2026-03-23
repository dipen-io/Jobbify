const mongoose = require('mongoose');

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
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
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
    tags: {
        type: [String],
        defautl: []
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        defautl: 'open'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true})

//indexes
jobSchema.index({location: 1, status: 1});
jobSchema.index({title: 'text', description: 'text'});
jobSchema.index({createdAt: -1});
jobSchema.index({createdAt: -1, _id: -1}); // cursor pagination

module.exports = mongoose.model('Job', jobSchema);
