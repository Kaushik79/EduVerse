const { LeetcodeStats } = require('../models');
const axios = require('axios');

/**
 * Fetches LeetCode stats for a given username using the public GraphQL API.
 * Caches the result in the database to avoid rate limiting.
 */
async function fetchLeetcodeStats(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          starRating
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
    }
  `;

  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      }
    });

    const data = response.data;
    
    if (!data.data?.matchedUser) {
      return null;
    }

    const user = data.data.matchedUser;
    const allQuestions = data.data.allQuestionsCount;
    const submissions = user.submitStatsGlobal.acSubmissionNum;

    const easySolved = submissions.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submissions.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = submissions.find(s => s.difficulty === 'Hard')?.count || 0;
    const totalSolved = submissions.find(s => s.difficulty === 'All')?.count || 0;

    const totalEasy = allQuestions.find(q => q.difficulty === 'Easy')?.count || 0;
    const totalMedium = allQuestions.find(q => q.difficulty === 'Medium')?.count || 0;
    const totalHard = allQuestions.find(q => q.difficulty === 'Hard')?.count || 0;

    return {
      username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalEasy,
      totalMedium,
      totalHard,
      ranking: user.profile?.ranking || 0,
      streak: user.userCalendar?.streak || 0,
      lastFetched: new Date()
    };
  } catch (error) {
    console.error('LeetCode API error:', error.message);
    return null;
  }
}

/**
 * Fetches and caches LeetCode stats for a user.
 * Only re-fetches if cache is older than 6 hours.
 */
async function getLeetcodeStatsForUser(userId, username) {
  // Check cache
  let stats = await LeetcodeStats.findOne({ where: { userId } });
  
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  
  if (stats && stats.lastFetched && stats.lastFetched > sixHoursAgo) {
    return stats;
  }

  // Fetch fresh data
  const freshStats = await fetchLeetcodeStats(username);
  
  if (!freshStats) {
    return stats; // Return cached data if fetch fails
  }

  if (stats) {
    await stats.update(freshStats);
  } else {
    stats = await LeetcodeStats.create({ userId, ...freshStats });
  }

  return stats;
}

module.exports = { fetchLeetcodeStats, getLeetcodeStatsForUser };
