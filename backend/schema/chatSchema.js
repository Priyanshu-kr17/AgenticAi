const mongoose = require("mongoose");

// 1. Define the embedded Message subdocument
const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        // 'user' = human, 'assistant' = AI, 'system' = hidden context
        enum: ["user", "assistant", "system"], 
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { 
    // We only need to know when a message was sent, not updated
    timestamps: { createdAt: true, updatedAt: false } 
});

// 2. Define the Chat parent document
const ChatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // CRITICAL: Add an index here because you will frequently query 
        // the database for "all chats belonging to this username"
        index: true 
    },
    title: {
        type: String,
        default: "New Chat"
    },
    // The messages array uses the subdocument schema defined above
    messages: [MessageSchema]
}, {
    // Tracks when the chat thread was created and last active
    timestamps: true 
});

module.exports = mongoose.model("Chat", ChatSchema);