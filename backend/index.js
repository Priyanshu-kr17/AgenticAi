const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const app = express();

// CORS & Credentials Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin || "http://localhost:5173";
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
require('dotenv').config();
const registerValidation = require("./validation/registervalidation")
const bcrypt = require('bcrypt');
const User = require("./schema/UserSchema")
const main = require("./database");

app.use(require('cookie-parser')());
const { fetchLeetCodeStats } = require('./leetcodeService/leetcodeService');

const userAuth = require("./middleware/userAuth");
const redisClient =  require("./databases/redis");
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/Authroutes");
const upadteRouter = require("./routes/updateRoute");
const chatRouter = require("./routes/chatRoute");

const initializeConnection =  async()=>{
    try{
        await Promise.all([redisClient.connect(),main()]);
        console.log("Connected to db and redis client also");
        app.listen(process.env.PORT,()=>{
            console.log("Listening Succesfully");
        })
    }
    catch(error){
        console.log(error);
    }

}
initializeConnection();

// CRUD operations

app.use("/auth",authRouter);
app.use("/update",upadteRouter);
app.use("/chatting",chatRouter);










