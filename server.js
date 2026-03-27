const app = require('./src/app');
const http = require('http');
const redis = require('./src/config/redis');
const Redis =require("ioredis");
const  redisClient = new Redis();
const connectToDatabase  = require('./src/config/db');
const gracefulShutdown = require('./src/utils/shutdown');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectToDatabase()
        await redis.connect();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server');
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown(server, redisClient, 'SIGTERM'));
process.on('SIGINT', () => gracefulShutdown(server, redisClient, 'SIGINT'));
process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));

startServer();

