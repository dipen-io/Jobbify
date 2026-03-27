const mongoose = require('mongoose');

const connectToDatabase = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('💀 FATAL: MONGO_URI is not defined');
        process.exit(1);
    }

    // Set up listeners ONLY ONCE (outside the try/catch or before connecting)
    mongoose.connection.on('connected', () => console.log('✅ MongoDB: Connected'));
    mongoose.connection.on('error', (err) => console.error(`❌ MongoDB: ${err.message}`));
    // mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB: Disconnected'));

    const options = {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 50, // Increase for production high-traffic
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        family: 4 
    };

    try {
        await mongoose.connect(uri, options);
    } catch (error) {
        console.error(`❌ Initial Connection Failed: ${error.message}`);
        // In production, let your Process Manager (PM2 or Docker) handle the restart
        // instead of a manual setTimeout loop to avoid memory leaks.
        process.exit(1); 
    }
};

module.exports = connectToDatabase;
