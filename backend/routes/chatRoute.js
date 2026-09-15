const express = require("express");
// const User = require("../schema/chatSchema");
const chatRouter= express.Router();
const Chat = require("../schema/chatSchema")
const dsaTools=require("../dsatools")
const callGemini = require("../geminiApi")
const code_review=require("../code_review");
const search_contest=require("../search_contest");
const userAuth = require("../middleware/userAuth");
const { fetchLeetCodeStats } = require('../leetcodeService/leetcodeService');


chatRouter.post("/chat/message", userAuth, async (req, res) => {
    try {
        // The frontend sends the message, and OPTIONALLY a chatId
        const { chatId, message } = req.body;
        // console.log(message)
        
        if (!message) throw new Error("Message is required");

        let chat;

        // SCENARIO 1: CONTINUING AN EXISTING CHAT
        if (chatId) {
            // We search by BOTH _id and username to ensure users 
            // can't access someone else's chat thread by guessing an ID
            chat = await Chat.findOne({ 
                _id: chatId, 
                username: req.user.username 
            });

            if (!chat) throw new Error("Chat thread not found");
        } 
        // SCENARIO 2: STARTING A BRAND NEW CHAT
        else {
            chat = new Chat({
                username: req.user.username, // req.user -> contains tokens payload handled in userAuth
                title: message.substring(0, 30) + "...", // Auto-generate a quick title
                messages: []
            });
        }


       // 1. Add the user's new message to the DB array BEFORE sending to AI
        chat.messages.push({ role: "user", content: message });

        // 2. Map your MongoDB history to the format the Gemini SDK expects
        // (Gemini uses the role "model" instead of "assistant")
        const chatHistory = chat.messages.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));


       const response = await callGemini(chatHistory, dsaTools);

        let aiResponseText = "";

        // 2. Check the response object for tool calls
        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];
            
            if (call.name === "code_review") {
                const reviewResult = await code_review(call.args.code);
                aiResponseText = `*Code Review:*\n${reviewResult}`;
            }
            else if (call.name === "search_contest") {
                const contests = await search_contest();
                aiResponseText = `Here are the upcoming contests:\n${contests}`;
            } 
            // else if (call.name === "one_to_one_match") {
            //     const match = await OnetoOne_Match(req.user.username);
            //     aiResponseText = `Match found! You are battling ${match}.`;
            // }
        } else {
            // 3. If no tools were called, grab the standard text
            aiResponseText = response.text; 
        }
        // 6. Save the AI's response to your database
        chat.messages.push({ role: "assistant", content: aiResponseText });
        await chat.save();

        // 7. Return everything to the frontend
        res.json({
            chatId: chat._id,
            reply: aiResponseText
        });
        // res.send(aiResponseText);

    } catch (error) {
        res.status(400).send(error.message);
    }
});


chatRouter.get('/recommend-problem', async (req, res) => {
    try {
        const { difficulty, topic } = req.query;

        // Construct the prompt with user filters
       const problemFinderPrompt = `
        You are an expert Competitive Programmer and DSA Mentor. 
        The user wants a recommendation with these filters:
        - Difficulty: ${difficulty || 'Any'}
        - Topic: ${topic || 'Any'}

        Recommend a real, well-known problem from LeetCode matching this criteria.

        Provide your response in this exact Markdown format:

        ### 🧩 Recommended Problem: [Problem Name]
        - **Platform:** LeetCode
        - **Difficulty:** [Easy / Medium / Hard]
        - **Direct Link:** [Provide the exact URL, e.g., https://leetcode.com/problems/sqrtx/]

        `;

        // Pass the prompt as chatHistory (array) and null for tools
        const aiResponse = await callGemini(problemFinderPrompt);

        res.status(200).send(aiResponse);
    } catch (error) {
        console.error("Error generating recommendation:", error);
        res.status(500).json({ error: "Failed to fetch a problem recommendation." });
    }
});

module.exports = chatRouter;