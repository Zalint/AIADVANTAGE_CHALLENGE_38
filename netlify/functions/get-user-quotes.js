const { authenticateUser } = require('./utils/auth');
const { getUserQuotes } = require('./utils/database');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Use the same authentication method as other functions
    const { authenticated, user } = await authenticateUser(event.headers);
    
    if (!authenticated) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    // Get limit from query parameters (default 50)
    const limit = parseInt(event.queryStringParameters?.limit) || 50;
    
    // Get date filters from query parameters
    const startDate = event.queryStringParameters?.startDate || null;
    const endDate = event.queryStringParameters?.endDate || null;

    // Validate date formats if provided (YYYY-MM-DD)
    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid startDate format. Use YYYY-MM-DD' })
      };
    }

    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid endDate format. Use YYYY-MM-DD' })
      };
    }

    // Convert dates to proper format for database if provided
    const dbStartDate = startDate ? `${startDate} 00:00:00` : null;
    const dbEndDate = endDate ? `${endDate} 23:59:59` : null;

    // Get user quotes from database with date filtering
    const quotes = await getUserQuotes(user.userId, limit, dbStartDate, dbEndDate);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotes)
    };

  } catch (error) {
    console.error('Error getting user quotes:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 