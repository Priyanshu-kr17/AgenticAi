const express = require("express");
const User = require("../schema/UserSchema");
const updateRouter= express.Router();
const userAuth = require("../middleware/userAuth");
const { error } = require("console");
const { fetchLeetCodeStats } = require('../leetcodeService/leetcodeService');

updateRouter.patch("/onboarding", userAuth, async (req, res) => {
    try {
        // 1. Destructure ALL the fields you expect from the frontend form
        const { leetcode, skills, preferredRoles, experienceLevel } = req.body;

        if (!leetcode) {
            throw new Error("LeetCode username is required");
        }

        // 2. Find the user
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            throw new Error("User not found");
        }

        // SAFETY CHECK: Prevent them from running onboarding twice
        if (user.handles?.leetcode?.username) {
            throw new Error("This account has already completed onboarding.");
        }

        // 3. Fetch stats BEFORE updating the database
        const fetchedStats = await fetchLeetCodeStats(leetcode);

        if (!fetchedStats) {
            throw new Error("Could not find that LeetCode account. Please check the spelling.");
        }

        // 4. Save LeetCode data
        user.handles.leetcode.username = leetcode;
        user.handles.leetcode.solved = fetchedStats.solved;
        user.handles.leetcode.contest = fetchedStats.contest;

        // 5. Save the manual profile data 
        // (We use || to provide safe defaults just in case the frontend sends empty data)
        user.skills = skills || [];
        user.preferredRoles = preferredRoles || [];
        user.experienceLevel = experienceLevel || "Beginner";

        // 6. Save everything to the database at once
        await user.save();

        res.json({
            message: "Profile setup completed successfully!",
            user: {
                username: user.username,
                skills: user.skills,
                leetcodeStats: fetchedStats
            }
        });
        // res.send("addedSuccessfully");

    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = updateRouter;