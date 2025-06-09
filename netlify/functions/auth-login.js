const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse request body
        const { email, password } = JSON.parse(event.body);

        // Validate input
        if (!email || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email and password are required' })
            };
        }

        // Find user by email
        const userQuery = 'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email.toLowerCase()]);

        if (userResult.rows.length === 0) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid email or password' })
            };
        }

        const user = userResult.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid email or password' })
            };
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                name: user.name
            },
            jwtSecret,
            { expiresIn: '7d' }
        );

        // Set HTTP-only cookie
        const cookieOptions = [
            `auth-token=${token}`,
            'HttpOnly',
            'Path=/',
            'Max-Age=604800', // 7 days
            'SameSite=Lax'
        ];

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
        }

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Set-Cookie': cookieOptions.join('; ')
            },
            body: JSON.stringify({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.created_at
                }
            })
        };

    } catch (error) {
        console.error('Login error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Login failed'
            })
        };
    }
}; 