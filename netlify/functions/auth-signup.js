const { createUser, getUserByEmail } = require('./utils/database');
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
    const { email, password, name } = JSON.parse(event.body);

    // Validate input
    if (!email || !password || !name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Email, password, and name are required' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Validate password strength
    if (password.length < 6) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Password must be at least 6 characters long' })
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 409,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'User with this email already exists' })
      };
    }

    // Create new user
    const user = await createUser(email, password, name);

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
        statusCode: 201,
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
    console.error('Signup error:', error);
    
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