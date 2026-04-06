require('dotenv').config();
require('./config/env');
const errorHandler = require('../src/middleware/errorHandler');
const { globalLimiter } = require("./middleware/rateLimit");
const loadRoutes = require('./routes');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// core middleware
app.use(cors())
app.use(express.json());
app.use(globalLimiter);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


//Routes
// routes(app);
loadRoutes(app);

// Health check 
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Jobbify API is running' });
})


// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
})

//Global error handler
app.use(errorHandler);

module.exports = app;
