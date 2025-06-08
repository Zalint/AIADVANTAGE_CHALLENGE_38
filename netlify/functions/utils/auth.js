const jwt = require('jsonwebtoken');
const { getUserById } = require('./database');

const JWT_SECRET = process.env.SESSION_SECRET;
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// Generate JWT token for user
function generateToken(user) {
  const payload = {
    userId: user.id,
    googleId: user.google_id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extract token from cookie string
function extractTokenFromCookie(cookieString) {
  if (!cookieString) return null;
  
  const cookies = cookieString.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

// Middleware to authenticate requests
async function authenticateUser(headers) {
  try {
    const cookieString = headers.cookie;
    const token = extractTokenFromCookie(cookieString);
    
    if (!token) {
      return { authenticated: false, user: null };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return { authenticated: false, user: null };
    }
    
    // Optionally verify user still exists in database
    const user = await getUserById(decoded.userId);
    if (!user) {
      return { authenticated: false, user: null };
    }
    
    return { authenticated: true, user: decoded };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, user: null };
  }
}

// Generate secure cookie options
function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/'
  };
}

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromCookie,
  authenticateUser,
  getCookieOptions
}; 