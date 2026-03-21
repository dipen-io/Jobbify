const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'REDIS_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing required env variable: ${key}`);
    }
})
