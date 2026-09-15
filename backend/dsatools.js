const { Type } = require("@google/genai");
const dsaTools = [{
            functionDeclarations: [
                {
                    name: "code_review",
                    description: "Review a user's DSA code snippet for time/space complexity.",
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            code: { type: Type.STRING, description: "The exact code snippet provided by the user." }
                        },
                        required: ["code"]
                    }
                },
                {
                    name: "search_contest",
                    description: "Find upcoming LeetCode or competitive programming contests."
                }              
            ]
}];

module.exports=dsaTools;