const { authenticateUser } = require('./utils/auth');
const { getUserPreferences, saveUserPreferences, clearUserContext } = require('./utils/database');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

    try {
        // Authenticate user
        const { authenticated, user } = await authenticateUser(event.headers);
        
        if (!authenticated || !user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Authentication required' })
            };
        }

        // Handle different HTTP methods
        switch (event.httpMethod) {
            case 'GET':
                return await handleGetPreferences(user.userId, headers);
            case 'POST':
            case 'PUT':
                return await handleSavePreferences(user.userId, event.body, headers);
            case 'DELETE':
                return await handleClearContext(user.userId, headers);
            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }

    } catch (error) {
        console.error('User preferences error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to process request'
            })
        };
    }
};

async function handleGetPreferences(userId, headers) {
    try {
        const preferences = await getUserPreferences(userId);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                preferences: preferences || {
                    custom_context: null,
                    longer_quotes: false
                }
            })
        };
    } catch (error) {
        throw error;
    }
}

async function handleSavePreferences(userId, requestBody, headers) {
    try {
        const { customContext, longerQuotes } = JSON.parse(requestBody);
        
        // Validate input
        if (customContext && typeof customContext !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Custom context must be a string' })
            };
        }

        if (customContext && customContext.length > 200) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Custom context must be 200 characters or less' })
            };
        }

        if (typeof longerQuotes !== 'boolean') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Longer quotes must be a boolean' })
            };
        }

        const updatedPreferences = await saveUserPreferences(
            userId, 
            customContext || null, 
            longerQuotes
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Preferences saved successfully',
                preferences: updatedPreferences
            })
        };
    } catch (error) {
        throw error;
    }
}

async function handleClearContext(userId, headers) {
    try {
        const updatedPreferences = await clearUserContext(userId);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Context cleared successfully',
                preferences: updatedPreferences
            })
        };
    } catch (error) {
        throw error;
    }
} 