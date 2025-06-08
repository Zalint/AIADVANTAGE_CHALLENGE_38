// Netlify Function: generate-welcome-message
// Generates personalized welcome messages using AI based on user stats

const fetch = require('node-fetch');
const { authenticateUser } = require('./utils/auth');

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('OPENAI_API_KEY is not set');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'OpenAI API key not configured' })
        };
    }

    try {
        // Check if user is authenticated
        const { authenticated, user } = await authenticateUser(event.headers);
        
        if (!authenticated) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Authentication required' })
            };
        }

        // Parse request body
        const body = JSON.parse(event.body);
        const { 
            userName, 
            totalQuotes, 
            favoriteVibe, 
            streakDays, 
            language = 'english',
            timeOfDay = 'morning'
        } = body;

        console.log(`Generating welcome message for ${userName}: ${totalQuotes} quotes, favorite: ${favoriteVibe}`);

        // Generate personalized welcome message
        const welcomeMessage = await generateWelcomeMessage(
            apiKey, 
            userName, 
            totalQuotes, 
            favoriteVibe, 
            streakDays, 
            language, 
            timeOfDay
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                title: welcomeMessage.title,
                subtitle: welcomeMessage.subtitle,
                success: true
            })
        };

    } catch (error) {
        console.error('Error generating welcome message:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to generate welcome message',
                message: error.message,
                success: false
            })
        };
    }
};

/**
 * Generate personalized welcome message using OpenAI
 */
async function generateWelcomeMessage(apiKey, userName, totalQuotes, favoriteVibe, streakDays, language, timeOfDay) {
    // Map language codes to language names
    const languageMap = {
        'english': 'English',
        'french': 'French',
        'german': 'German', 
        'spanish': 'Spanish',
        'portuguese': 'Portuguese',
        'italian': 'Italian',
        'slovak': 'Slovak'
    };
    
    const targetLanguage = languageMap[language] || 'English';
    
    // Build user context
    let userContext = '';
    if (totalQuotes === 0) {
        userContext = 'This is their first time using the app';
    } else if (totalQuotes < 5) {
        userContext = `They are a new user with ${totalQuotes} quotes`;
    } else if (totalQuotes < 20) {
        userContext = `They are a regular user with ${totalQuotes} quotes`;
    } else {
        userContext = `They are an active user with ${totalQuotes} quotes`;
    }
    
    if (streakDays > 1) {
        userContext += ` and a ${streakDays}-day streak`;
    }
    
    // Time-based greeting
    const timeGreeting = {
        'morning': 'morning',
        'afternoon': 'afternoon', 
        'evening': 'evening',
        'night': 'late evening'
    }[timeOfDay] || 'day';

    const prompt = `Generate a very short, personalized, and friendly welcome message for a user named ${userName}.

Context:
- It's ${timeGreeting} time
- ${userContext}
- Their favorite vibe/theme is "${favoriteVibe}"
- Language: ${targetLanguage}
- This is a personal quote generation app for self-inspiration
- The user generates quotes for their own motivation and growth

Generate exactly 2 lines in ${targetLanguage}:
1. A greeting with their name (max 8 words)
2. A personalized subtitle about their journey or next inspiration (max 12 words)

Tone guidelines:
- Warm and encouraging
- Focus on personal growth and inspiration
- Reference their progress or favorite theme
- AVOID: mentioning "sharing", "us", "we", or "with us"
- Focus on THEIR personal journey and inspiration
- Use motivational language about their next quote or continued growth

Examples of good subtitles:
- "Ready for more ${favoriteVibe} inspiration?"
- "${totalQuotes} quotes of wisdom and counting!"
- "Your ${favoriteVibe} journey continues!"
- "Time for another dose of ${favoriteVibe}?"

Format:
Line 1: [greeting]
Line 2: [subtitle]`;

    const requestBody = {
        model: MODEL,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 100,
        temperature: 0.8,
        top_p: 0.9
    };

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI');
    }

    const content = data.choices[0].message.content.trim();
    const lines = content.split('\n').filter(line => line.trim());
    
    // Parse the two lines
    let title = lines[0] || `Good ${timeGreeting}, ${userName}!`;
    let subtitle = lines[1] || `Ready for some ${favoriteVibe} inspiration?`;
    
    // Clean up the lines (remove "Line 1:", "Line 2:" etc.)
    title = title.replace(/^(Line\s*1\s*:\s*|1\.\s*)/i, '').trim();
    subtitle = subtitle.replace(/^(Line\s*2\s*:\s*|2\.\s*)/i, '').trim();
    
    // Add appropriate emoji based on time
    const timeEmojis = {
        'morning': '🌅',
        'afternoon': '☀️',
        'evening': '🌅', 
        'night': '🌙'
    };
    
    if (!title.includes('🌅') && !title.includes('☀️') && !title.includes('🌙')) {
        title += ` ${timeEmojis[timeOfDay] || '✨'}`;
    }

    return {
        title,
        subtitle
    };
} 