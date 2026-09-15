const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
    // --- CORE AUTHENTICATION FIELDS ---
    username: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    name: {
        type: String,
        required: true, 
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
    },

    // --- AI AGENT / MCP INTEGRATION FIELDS ---
    
    // 1. Coding Profiles: For the Agent to fetch recent contest submissions/ratings
    handles: {
        leetcode: {
            username: { type: String, default: "" },
            solved: {
                all: { type: Number, default: 0 },
                easy: { type: Number, default: 0 },
                medium: { type: Number, default: 0 },
                hard: { type: Number, default: 0 }
            },
            contest: {
                rating: { type: mongoose.Schema.Types.Mixed, default: "Unrated" },
                globalRanking: { type: mongoose.Schema.Types.Mixed, default: "N/A" }
            }
        }
    },

    // 2. Skills: For teammate matching & targeted hackathon recommendations
    // Add these fields to your UserSchema
skills: { 
    type: [String], // e.g., ["C++", "React", "Node.js"]
    default: [] 
},
preferredRoles: { 
    type: [String], // e.g., ["Backend", "Full Stack"]
    default: [] 
},
experienceLevel: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced"], // Restricts what can be saved
    default: "Beginner" 
}

}, { timestamps: true });

UserSchema.methods.passwordcheck = async function(password){
   const ans = await bcrypt.compare(password,this.password)
    return ans;
}

UserSchema.methods.getJWT = function(){
    const token =  jwt.sign(
        {username: this.username,
        email: this.email},
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
    );
    return token;
}

const User = mongoose.model("user", UserSchema); 
module.exports = User;