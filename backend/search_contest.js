// We are using the native Node.js fetch API, so no need to install axios!

async function search_contest() {
    try {
        const response = await fetch("https://kontests.net/api/v1/all");
        
        if (!response.ok) {
            throw new Error(`Failed to fetch contests: ${response.status}`);
        }

        const data = await response.json();

        // 1. Filter out only the contests that haven't started yet ("BEFORE")
        const upcomingContests = data.filter(contest => contest.status === "BEFORE");

        // 2. Sort them by start time (closest first)
        upcomingContests.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        // 3. Take only the top 5 contests to avoid overwhelming the user (and LLM token limits)
        const top5Contests = upcomingContests.slice(0, 5);

        // 4. Format the output into a clean string
        if (top5Contests.length === 0) {
            return "There are no upcoming contests in the near future.";
        }

        let formattedString = "Here are the top 5 upcoming coding contests:\n\n";
        
        top5Contests.forEach((contest, index) => {
            // Convert ugly UTC timestamps into a readable format
            const startTime = new Date(contest.start_time).toLocaleString();
            
            formattedString += `${index + 1}. **${contest.name}**\n`;
            formattedString += `   - Platform: ${contest.site}\n`;
            formattedString += `   - Starts At: ${startTime}\n`;
            formattedString += `   - Link: [Register Here](${contest.url})\n\n`;
        });

        return formattedString;

    } catch (error) {
        console.error("Contest Fetch Error:", error);
        return "I had trouble fetching the contest schedule. Please try again later.";
    }
}

module.exports = search_contest;