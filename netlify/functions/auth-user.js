const { authenticateUser } = require('./utils/auth');
const { getUserStats, getTotalQuoteCount } = require('./utils/database');

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { authenticated, user } = await authenticateUser(event.headers);
    
    if (!authenticated) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authenticated: false })
      };
    }

    // Get user statistics
    const [stats, totalQuotes] = await Promise.all([
      getUserStats(user.userId),
      getTotalQuoteCount(user.userId)
    ]);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authenticated: true,
        user: {
          id: user.userId,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        },
        stats: {
          totalQuotes,
          vibeStats: stats
        }
      })
    };

  } catch (error) {
    console.error('Auth user error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        authenticated: false
      })
    };
  }
}; 