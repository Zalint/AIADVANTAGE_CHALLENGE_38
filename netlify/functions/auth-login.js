const { verifyPassword } = require('./utils/database');
const { generateToken, getCookieOptions } = require('./utils/auth');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    // Verify credentials
    const user = await verifyPassword(email, password);
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    // Generate JWT token
    const token = generateToken(user);
    const cookieOptions = getCookieOptions();
    
    // Set cookie
    const cookieString = `auth_token=${token}; HttpOnly; Max-Age=${cookieOptions.maxAge}; Path=${cookieOptions.path}; SameSite=${cookieOptions.sameSite}${cookieOptions.secure ? '; Secure' : ''}`;
    
    // Check if this is an AJAX request or direct form submission
    const acceptHeader = event.headers.accept || '';
    const isAjaxRequest = acceptHeader.includes('application/json') || event.headers['content-type']?.includes('application/json');
    
    if (isAjaxRequest) {
      // Return JSON response for AJAX requests
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Set-Cookie': cookieString
        },
        body: JSON.stringify({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          },
          redirect: '/dashboard.html'
        })
      };
    } else {
      // Redirect for direct form submissions
      return {
        statusCode: 302,
        headers: {
          'Set-Cookie': cookieString,
          'Location': '/dashboard.html',
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

  } catch (error) {
    console.error('Login error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 