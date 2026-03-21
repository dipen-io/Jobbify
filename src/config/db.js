const mongoose = require('mongoose');

const connectToDatabase = async ( retries = 5 ) => {
    if (!process.env.MONGO_URI) {
        console.error('MONG_URI is not defined');
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(process.env.MONG_URI, {
            serverSelectionTimeoutMS: 5000, // fail fast if db not reachable
            maxPoolSize: 10, // connection pool
        });
        console.log(`db connected: ${conn.connection.host}`);

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongodb disconnected');
        })
        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB error: ${err.message}`);
        });


    } catch (error){
        console.error(`❌ Connection failed: ${err.message}`);

        if (retries > 0) {
            console.log(`🔁 Retrying... (${retries} left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error("❌ Could not connect to MongoDB. Exiting...");
            process.exit(1);
        }
    }
}
module.exports = connectToDatabase;
