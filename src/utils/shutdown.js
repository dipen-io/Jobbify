const mongoose = require('mongoose');

let isShuttingDown = false;

const gracefulShutdown = async (server, redisClient, signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\nRECEIVED ${signal}: Starting graceful shutdown...`);

    const timeout = setTimeout(() => {
        console.error('💀 FORCED EXIT: Cleanup timed out.');
        process.exit(1);
    }, 10000);

    try {
        // Close server
        await new Promise((resolve, reject) => {
            server.close(err => {
                if (err) return reject(err);
                console.log('✅ HTTP server closed.');
                resolve();
            });
        });

        // Close MongoDB
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('✅ MongoDB connection closed.');
        }

        // Close Redis
        if (redisClient) {
            await redisClient.quit();
            console.log('✅ Redis connection closed.');
        }

        clearTimeout(timeout);
        console.log('👋 Process terminated safely.');

        setTimeout(() => process.exit(0), 100);

    } catch (err) {
        console.error('❌ Error during cleanup:', err);
        process.exit(1);
    }
};

module.exports = gracefulShutdown;
