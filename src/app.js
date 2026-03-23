require('dotenv').config();
require('./config/env');

const express = require('express');
const cors = require('cors');
const errorHandler = require('../src/middleware/errorHandler');
const morgan = require('morgan');

const app = express();

// core middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Routes
// app.use('api/v1/auth', require(./modules/auth/auth.router)); 
app.use('/api/v1/auth', require("./modules/auth/auth.router")); 
// app.use('api/v1/jobs', require(./modules/jobs/jobs.router)); 
// app.use('api/v1/upload', require(./modules/upload/upload.router)); 

// Health check 
app.get('/health', (req, res) => {
    res.json({success: true, message: 'Jobbify API is running'});
})

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
})

//Global error handler
app.use(errorHandler);

module.exports = app;
