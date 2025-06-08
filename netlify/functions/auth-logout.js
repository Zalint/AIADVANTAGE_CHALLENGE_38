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
    // Clear the authentication cookie
    const cookieString = 'auth_token=; HttpOnly; Max-Age=0; Path=/; SameSite=lax';
    
    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': cookieString,
        'Location': '/',
        'Cache-Control': 'no-cache'
      },
      body: ''
    };

  } catch (error) {
    console.error('Logout error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Logout failed' 
      })
    };
  }
}; 