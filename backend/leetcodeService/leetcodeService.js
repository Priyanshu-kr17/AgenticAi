// leetcodeService.js


// Helper function to format the messy GraphQL response into a clean object
function extractUsefulData(graphqlData) {
    const problems = graphqlData.matchedUser.submitStats.acSubmissionNum;
    const contest = graphqlData.userContestRanking;

    return {
        solved: {
            all: problems.find(p => p.difficulty === "All")?.count || 0,
            easy: problems.find(p => p.difficulty === "Easy")?.count || 0,
            medium: problems.find(p => p.difficulty === "Medium")?.count || 0,
            hard: problems.find(p => p.difficulty === "Hard")?.count || 0,
        },
        contest: {
            rating: contest ? Math.round(contest.rating) : "Unrated",
            globalRanking: contest ? contest.globalRanking : "N/A"
        }
    };
}

async function fetchLeetCodeStats(username) {
    const endpoint = "https://leetcode.com/graphql";

    // This GraphQL query asks for exactly what we need: 
    // Contest rating and the count of solved problems (Easy, Medium, Hard)
    const query = `
        query getUserStats($username: String!) {
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
            userContestRanking(username: $username) {
                rating
                globalRanking
            }
        }
    `;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query,
                variables: { username: username }
            })
        });

        if (!response.ok) {
            throw new Error(`LeetCode API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // Check if the user actually exists on LeetCode
        if (!data.data.matchedUser) {
            throw new Error("LeetCode user not found");
        }

        return extractUsefulData(data.data);

    } catch (error) {
        console.error("Error fetching LeetCode data:", error.message);
        return null;
    }
}



module.exports = { fetchLeetCodeStats };