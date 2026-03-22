const mongoose = require('mongoose');

/**
 * @param {Object} server - Express server
 * @param {Object} redisClient - Your Redis connection instance
 * @param {string} signal - The exit signal
 */
const gracefulShutdown = async (server, redisClient, signal) => {
    console.log(`\nRECEIVED ${signal}: Starting graceful shutdown...`);

    // 1. Stop the HTTP server first (no more incoming traffic)
    server.close(async () => {
        console.log('✅ HTTP server closed.');

        try {
            // 2. Close MongoDB
            if (mongoose.connection.readyState !== 0) {
                await mongoose.connection.close();
                console.log('✅ MongoDB connection closed.');
            }

            // 3. Close Redis
            if (redisClient && redisClient.isOpen) {
                // For 'redis' v4+ use .quit(), for older versions use .end()
                await redisClient.quit(); 
                console.log('✅ Redis connection closed.');
            }

            console.log('👋 Process terminated safely.');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error during cleanup:', err);
            process.exit(1);
        }
    });

    // Force exit after 10s
    setTimeout(() => {
        console.error('💀 FORCED EXIT: Cleanup timed out.');
        process.exit(1);
    }, 10000);
};

module.exports = gracefulShutdown;
