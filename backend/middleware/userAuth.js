const jwt = require("jsonwebtoken");
const redisClient = require("../databases/redis");

async function userAuth(req, res, next) {
    try {
        // 1. Read the cookie (requires 'cookie-parser' package)
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Please log in first");
        }

        if(await redisClient.exists(`TOKEN:${token}`)){
            throw new Error("Error Bad request");
        }

        // 2. Verify the token using the same SECRET_KEY
        const decodedObj = jwt.verify(token, process.env.SECRET_KEY);
        
        // 3. Attach the decoded user data (username, email) to the request
        req.user = decodedObj; 
        
        next(); // Move on to the route
    } catch (error) {
        res.status(401).send("Unauthorized: " + error.message);
    }
}

module.exports = userAuth;