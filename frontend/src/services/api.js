/**
 * Centralized API client for AI DSA Mentor
 * Connects to the local Express backend with seamless fallback mocks when offline.
 */

const BACKEND_BASE_URL = 'http://localhost:1800';
const REQUEST_TIMEOUT_MS = 6000;

// Curated library of authentic LeetCode problems by topic & difficulty for offline mock
const MOCK_PROBLEMS = [
  {
    topic: 'Array',
    difficulty: 'Easy',
    name: 'Two Sum',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    markdown: `### 🧩 Recommended Problem: Two Sum
- **Platform:** LeetCode (Problem #1)
- **Difficulty:** Easy
- **Direct Link:** [https://leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/)

#### Summary
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`. You may assume each input would have exactly one solution, and you may not use the same element twice.

#### 💡 Core Concept Hint
Instead of a nested $O(N^2)$ brute-force check, maintain a hash map storing value $\\rightarrow$ index. For each number $x$, instantly check if the complement $(\\text{target} - x)$ has already been seen in $O(1)$ average time.`,
    boilerplate: `// Problem: Two Sum (LeetCode #1)
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`
  },
  {
    topic: 'Binary Search',
    difficulty: 'Medium',
    name: 'Search in Rotated Sorted Array',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    markdown: `### 🧩 Recommended Problem: Search in Rotated Sorted Array
- **Platform:** LeetCode (Problem #33)
- **Difficulty:** Medium
- **Direct Link:** [https://leetcode.com/problems/search-in-rotated-sorted-array/](https://leetcode.com/problems/search-in-rotated-sorted-array/)

#### Summary
Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`. You must write an algorithm with $O(\\log n)$ runtime complexity.

#### 💡 Core Concept Hint
Even though the array is rotated, at least one half (either from \`low\` to \`mid\` or from \`mid\` to \`high\`) is guaranteed to be strictly sorted. Determine which half is sorted first, then check if \`target\` lies within its boundary!`,
    boilerplate: `// Problem: Search in Rotated Sorted Array (LeetCode #33)
#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int low = 0, high = nums.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            
            // Identify sorted half
            if (nums[low] <= nums[mid]) {
                if (target >= nums[low] && target < nums[mid]) {
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            } else {
                if (target > nums[mid] && target <= nums[high]) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
        }
        return -1;
    }
};`
  },
  {
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    name: 'Longest Increasing Subsequence',
    leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    markdown: `### 🧩 Recommended Problem: Longest Increasing Subsequence
- **Platform:** LeetCode (Problem #300)
- **Difficulty:** Medium
- **Direct Link:** [https://leetcode.com/problems/longest-increasing-subsequence/](https://leetcode.com/problems/longest-increasing-subsequence/)

#### Summary
Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence. Can you achieve $O(N \\log N)$ using patient sorting / binary search?

#### 💡 Core Concept Hint
Formulate state: let \`tails[k]\` be the smallest tail of all increasing subsequences of length \`k+1\`. When processing the next number, use \`std::lower_bound\` to update or extend \`tails\`.`,
    boilerplate: `// Problem: Longest Increasing Subsequence (LeetCode #300)
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) {
                tails.push_back(x);
            } else {
                *it = x;
            }
        }
        return tails.size();
    }
};`
  },
  {
    topic: 'Graphs',
    difficulty: 'Medium',
    name: 'Course Schedule (Cycle Detection)',
    leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
    markdown: `### 🧩 Recommended Problem: Course Schedule
- **Platform:** LeetCode (Problem #207)
- **Difficulty:** Medium
- **Direct Link:** [https://leetcode.com/problems/course-schedule/](https://leetcode.com/problems/course-schedule/)

#### Summary
There are a total of \`numCourses\` you have to take, labeled from \`0\` to \`numCourses - 1\`. Return \`true\` if you can finish all courses; otherwise, return \`false\`.

#### 💡 Core Concept Hint
This problem reduces to detecting a cycle in a Directed Graph. Model prerequisites as directed edges $(v \\rightarrow u)$ and run Kahn's algorithm (indegrees with BFS) or DFS with 3-color node state tracking (UNVISITED, VISITING, VISITED).`,
    boilerplate: `// Problem: Course Schedule (LeetCode #207)
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        for (auto& edge : prerequisites) {
            adj[edge[1]].push_back(edge[0]);
            inDegree[edge[0]]++;
        }
        
        queue<int> q;
        for (int i = 0; i < numCourses; ++i) {
            if (inDegree[i] == 0) q.push(i);
        }
        
        int processed = 0;
        while (!q.empty()) {
            int curr = q.front();
            q.pop();
            processed++;
            for (int neighbor : adj[curr]) {
                if (--inDegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        return processed == numCourses;
    }
};`
  },
  {
    topic: 'Dynamic Programming',
    difficulty: 'Hard',
    name: 'Trapping Rain Water',
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    markdown: `### 🧩 Recommended Problem: Trapping Rain Water
- **Platform:** LeetCode (Problem #42)
- **Difficulty:** Hard
- **Direct Link:** [https://leetcode.com/problems/trapping-rain-water/](https://leetcode.com/problems/trapping-rain-water/)

#### Summary
Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

#### 💡 Core Concept Hint
The trapped water above index $i$ is bounded by $\\min(\\text{max\\_left}[i], \\text{max\\_right}[i]) - \\text{height}[i]$. Optimize space from $O(N)$ to $O(1)$ by using a two-pointer technique converging from left and right!`,
    boilerplate: `// Problem: Trapping Rain Water (LeetCode #42)
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int waterTrapped = 0;

        while (left < right) {
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else waterTrapped += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else waterTrapped += rightMax - height[right];
                right--;
            }
        }
        return waterTrapped;
    }
};`
  },
  {
    topic: 'Two Pointers',
    difficulty: 'Easy',
    name: 'Valid Palindrome',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    markdown: `### 🧩 Recommended Problem: Valid Palindrome
- **Platform:** LeetCode (Problem #125)
- **Difficulty:** Easy
- **Direct Link:** [https://leetcode.com/problems/valid-palindrome/](https://leetcode.com/problems/valid-palindrome/)

#### Summary
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

#### 💡 Core Concept Hint
Use two pointers moving inward (\`left = 0\`, \`right = s.size() - 1\`). Skip non-alphanumeric characters using \`std::isalnum()\` and compare with \`std::tolower()\`.`,
    boilerplate: `// Problem: Valid Palindrome (LeetCode #125)
#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};`
  }
];

// Helper to execute fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = REQUEST_TIMEOUT_MS, credentials = 'include', ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      credentials,
      ...rest,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Health check to verify if backend is reachable
 */
export async function checkBackendHealth() {
  const probeUrls = [
    '/chatting/recommend-problem?difficulty=Easy&topic=Array',
    `${BACKEND_BASE_URL}/chatting/recommend-problem?difficulty=Easy&topic=Array`,
  ];

  for (const url of probeUrls) {
    try {
      const res = await fetchWithTimeout(url, {
        method: 'GET',
        timeout: 5000,
      });
      if (res.status < 500) return true;
    } catch {
      // continue probe
    }
  }
  return false;
}

/**
 * Request problem recommendation
 * GET /chatting/recommend-problem?difficulty={diff}&topic={top}
 */
export async function fetchProblemRecommendation(difficulty = 'Medium', topic = 'Array') {
  const diffParam = encodeURIComponent(difficulty);
  const topicParam = encodeURIComponent(topic);

  // Candidate endpoints to test (proxy and direct backend at port 1800)
  const candidateUrls = [
    `/chatting/recommend-problem?difficulty=${diffParam}&topic=${topicParam}`,
    `${BACKEND_BASE_URL}/chatting/recommend-problem?difficulty=${diffParam}&topic=${topicParam}`,
  ];

  for (const url of candidateUrls) {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: { 'Accept': 'text/plain, application/json' },
      });

      if (response.ok) {
        const text = await response.text();
        let markdown = text;
        try {
          const parsed = JSON.parse(text);
          if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
            markdown = parsed.candidates[0].content.parts[0].text;
          }
        } catch {
          // standard raw markdown
        }

        return {
          success: true,
          markdown,
          isMock: false,
          source: 'Live AI Gemini Backend',
          metadata: { difficulty, topic }
        };
      }
    } catch {
      // Continue to next candidate or fallback
    }
  }

  // Graceful Fallback Mock
  const matched = MOCK_PROBLEMS.find(p => 
    p.topic.toLowerCase() === topic.toLowerCase() && 
    p.difficulty.toLowerCase() === difficulty.toLowerCase()
  ) || MOCK_PROBLEMS.find(p => p.difficulty.toLowerCase() === difficulty.toLowerCase())
    || MOCK_PROBLEMS[0];

  return {
    success: true,
    markdown: matched.markdown,
    boilerplate: matched.boilerplate,
    isMock: true,
    source: 'Offline Smart Mock (Local Server Offline)',
    metadata: {
      difficulty,
      topic,
      name: matched.name,
      leetcodeUrl: matched.leetcodeUrl,
    }
  };
}

/**
 * Send interactive chat message
 * POST http://localhost:5000/chat/message with payload { message, currentCode }
 */
export async function sendChatMessage(message, currentCode = '', chatId = null) {
  const payload = {
    message,
    currentCode,
    chatId
  };

  const candidateUrls = [
    `/chatting/chat/message`,
    `${BACKEND_BASE_URL}/chatting/chat/message`,
  ];

  for (const url of candidateUrls) {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain, application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const reply = await response.text();
        let replyText = reply;
        try {
          const parsed = JSON.parse(reply);
          if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
            replyText = parsed.candidates[0].content.parts[0].text;
          } else if (parsed.reply) {
            replyText = parsed.reply;
          }
        } catch {
          // raw text
        }

        return {
          success: true,
          reply: replyText,
          isMock: false,
          source: 'Live Gemini Mentor'
        };
      }
    } catch {
      // Fallback
    }
  }

  // Graceful Smart AI Mentor Fallback Response
  await new Promise((r) => setTimeout(r, 800)); // Simulate realistic mentor reasoning latency

  const lowerMsg = message.toLowerCase();
  let generatedReply = "";

  if (lowerMsg.includes("tle") || lowerMsg.includes("time limit") || lowerMsg.includes("slow")) {
    generatedReply = `### ⏱️ Time Limit Exceeded (TLE) Analysis

Your current algorithm is likely performing redundant operations within nested loops.

#### ❌ Potential Bottlenecks:
1. **$O(N^2)$ Comparison Loops:** If $N \\ge 10^5$, an $O(N^2)$ solution requires $\\approx 10^{10}$ operations, exceeding LeetCode's $10^8$ ops/second threshold.
2. **Repeated State Computations:** Recalculating subproblems without memoization or dynamic programming tables.

### 💡 Mentor Hint
Can you invert the search using a **Hash Map** ($O(N)$ time, $O(N)$ space) or sort the array first to apply **Two Pointers / Binary Search** ($O(N \\log N)$ time)?

> What is the expected constraint on $N$ for this problem?`;
  } else if (lowerMsg.includes("review") || lowerMsg.includes("check my code") || currentCode.trim().length > 0) {
    if (currentCode.includes("while") && !currentCode.includes("++") && !currentCode.includes("+=") && !currentCode.includes("mid")) {
      generatedReply = `### ❌ Bug Detected
Your \`while\` loop condition might not be advancing its loop pointer on all execution branches, risking an **Infinite Loop**.

### 💡 Mentor Hint
Trace the loop variable manually for an edge case where conditions are not met. Did you forget to increment/decrement the index inside the loop body?`;
    } else {
      generatedReply = `### ✅ Code Review & Complexity Analysis

Your C++ implementation structure is clean and adheres to standard DSA idiomatic practices.

### ⏱️ Time Complexity
- **$O(N \\log N)$** if sorting or binary search is used; or **$O(N)$** linear scan if using hash maps.

### 💾 Space Complexity
- **$O(1)$** auxiliary space if working in-place, or **$O(N)$** if allocating auxiliary containers.

### 🎯 Optimal Complexity
- Aim for the theoretical lower bound: if every element must be inspected at least once, $O(N)$ is the optimal target.

### 📚 Topics & Patterns
- Two Pointers / Binary Search / Hash Table state caching.`;
    }
  } else if (lowerMsg.includes("contest") || lowerMsg.includes("upcoming")) {
    generatedReply = `### 🏆 Upcoming Competitive Programming Contests
- **LeetCode Weekly Contest:** Sundays at 08:00 AM IST (4 problems, 90 mins)
- **LeetCode Biweekly Contest:** Alternate Saturdays at 08:00 PM IST (4 problems, 90 mins)
- **Codeforces Round (Div 2/3):** Check Codeforces calendar for upcoming rated rounds.

> *Tip: Solve the first 2 problems within 25 minutes to boost your contest rating efficiently!*`;
  } else {
    generatedReply = `### 💡 Mentor Guidance

I analyzed your question: *"${message}"*

To tackle this effectively:
1. **Understand Constraints:** Identify the maximum bounds for input sizes ($N \\le 10^4$ allows $O(N^2)$, but $N \\ge 10^5$ mandates $O(N)$ or $O(N \\log N)$).
2. **Invariant Proof:** What property remains true after each iteration or recursion step?
3. **Edge Cases:** Always verify empty inputs, single element, negative integers, and maximum integer overflows (\`INT_MAX\` / \`long long\`).

Feel free to paste your C++ code and enable **"Send Code with Message"** for a line-by-line review!`;
  }

  return {
    success: true,
    reply: generatedReply,
    isMock: true,
    source: 'Offline Smart Mentor Mock'
  };
}
