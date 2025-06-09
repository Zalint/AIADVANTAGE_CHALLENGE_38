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
        const { name, email, password } = JSON.parse(event.body);

        // Validate input
        if (!name || !email || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Name, email, and password are required' })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Validate password strength
        if (password.length < 6) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Password must be at least 6 characters long' })
            };
        }

        // Check if user already exists
        const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
        const existingUserResult = await pool.query(existingUserQuery, [email.toLowerCase()]);

        if (existingUserResult.rows.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'User with this email already exists' })
            };
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        const insertUserQuery = `
            INSERT INTO users (name, email, password_hash, created_at, updated_at) 
            VALUES ($1, $2, $3, NOW(), NOW()) 
            RETURNING id, name, email, created_at
        `;
        
        const newUserResult = await pool.query(insertUserQuery, [
            name.trim(),
            email.toLowerCase(),
            hashedPassword
        ]);

        const user = newUserResult.rows[0];

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key';
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email 
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
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.created_at
                }
            })
        };

    } catch (error) {
        console.error('Signup error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to create user'
            })
        };
    }
}; 