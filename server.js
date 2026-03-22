const app = require('./src/app');
const http = require('http');
const  connectToDatabase  = require('./src/config/db');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectToDatabase()
        // await redis.connect();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server');
        process.exit(1);
    }
};

startServer();

