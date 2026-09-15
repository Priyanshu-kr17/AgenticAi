const express = require("express");
const User = require("../schema/UserSchema");
const authRouter= express.Router();
const bcrypt = require("bcrypt");
const userAuth = require("../middleware/userAuth");
// const validator =require("../")
const registerValidation = require("../validation/registervalidation");
// const redisClient=require("../redis")
const redisClient = require("../databases/redis")
const JWT = require('jsonwebtoken')
const { error } = require("console");


authRouter.post("/register", async (req, res) => {
    try {
        // 1. Validate incoming data (assuming this throws an error if invalid)
          console.log(req.body); 
        const isallowed = registerValidation(req.body); 
        console.log(isallowed);  

        // 2. Destructure the fields you expect from the frontend
        // This prevents users from injecting unwanted fields into your database
        const { username, name, email, password, leetcode } = req.body;

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Build the user object to match your Schema structure
        const newUser = new User({
            username: username,
            name: name,
            email: email,
            password: hashedPassword,
            handles: {
                leetcode: leetcode || "" // Maps the frontend input to the nested schema field
            }
        });

        // 5. Save to database
        await newUser.save();

        res.status(201).send("User registered successfully");
    } 
    catch(error) {
        // Use standard HTTP status codes for errors
        res.status(400).send(error.message);
    }
});

authRouter.post("/login", async (req,res)=>{
    try{
        
        const userdata = await User.findOne({ username: req.body.username });
        if(!userdata){
            throw new Error("enter correct username");
        }

        // console.log(userdata);
        const isallowed = userdata.passwordcheck(req.body.password);
        if(!isallowed){
            throw new Error("Wrong password");
        }

        const token = userdata.getJWT();
        res.cookie("token", token);
        res.send("Login Successfully");

    }
    catch(error){
        res.send(error.message);
    }
})

authRouter.post("/logout",userAuth,async (req,res)=>{
    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);
        await redisClient.set(`TOKEN:${payload}`,"blocked");
        await redisClient.expireAt(`TOKEN:${token}`,payload.exp)
        // res.cookie("token",null,{expires: new Date(Date.now())}); // sending an invalid token and expiring it instantly
        res.clearCookie("token");
        res.send("Logout Successfully");
    }
    catch(error){
        res.send(error.message);
    }
})

module.exports = authRouter;