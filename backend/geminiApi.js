const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY
});

async function callGemini(chatHistory, tools) {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash", // Make sure you are using a valid model name
        contents: chatHistory,
        config: { 
            tools: tools 
        }
    });
    
    // CRITICAL: Return the FULL response object, not just the text!
    return response;
}

module.exports = callGemini;
