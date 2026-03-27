const COOKIE_OPTIONS  = {
    httpOnly: true,
    // Ensure this is true in production to only send over HTTPS
    secure: process.env.NODE_ENV === "production", 
    sameSite: 'strict',
    // 7 days in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000

};

module.exports  = { COOKIE_OPTIONS };
