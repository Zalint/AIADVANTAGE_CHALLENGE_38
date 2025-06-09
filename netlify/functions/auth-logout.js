exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    // Allow GET requests for logout
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Clear the authentication cookie
        const cookieOptions = [
            'auth-token=',
            'HttpOnly',
            'Path=/',
            'Max-Age=0', // Expire immediately
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
                message: 'Logged out successfully'
            })
        };

    } catch (error) {
        console.error('Logout error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: 'Logout failed'
            })
        };
    }
}; 