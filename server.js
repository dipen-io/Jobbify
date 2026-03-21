const app = require('./src/app');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // await connectDB();
        // await redis.connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server');
        process.exit(1);
    }
};

startServer();

