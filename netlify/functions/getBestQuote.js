// Netlify Function: getBestQuote
// Handles two-step quote generation: generate 3 quotes, then select the best one

const fetch = require('node-fetch');
const { authenticateUser } = require('./utils/auth');
const { saveUserQuote } = require('./utils/database');

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GENERATION_MODEL = 'gpt-4o';
const EVALUATION_MODEL = 'gpt-4.1-mini';

// Rate limiting configuration
const DAILY_REQUEST_LIMIT = parseInt(process.env.DAILY_REQUEST_LIMIT) || 25;

// Simple in-memory storage for demo purposes
// In production, you'd want to use a proper database or Redis
let dailyUsage = new Map();

/**
 * Main handler for the Netlify Function
 */
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
        // Parse request body
        const body = JSON.parse(event.body);
        const { vibe, language = 'english', context = {} } = body;

        if (!vibe) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Vibe is required' })
            };
        }

        // Check if user is authenticated
        const { authenticated, user } = await authenticateUser(event.headers);
        console.log('Authentication status:', authenticated, user ? `User: ${user.name}` : 'Guest user');

        // Check daily rate limit
        const rateLimitResult = checkDailyRateLimit(event);
        if (!rateLimitResult.allowed) {
            console.log(`Rate limit exceeded: ${rateLimitResult.usage}/${DAILY_REQUEST_LIMIT}`);
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ 
                    error: 'Daily request limit exceeded',
                    message: `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} requests. Please try again tomorrow.`,
                    usage: rateLimitResult.usage,
                    limit: DAILY_REQUEST_LIMIT,
                    resetTime: rateLimitResult.resetTime
                })
            };
        }

        console.log(`Generating quotes for vibe: ${vibe} in ${language} with context:`, context);
        const rateLimitResultLog = checkDailyRateLimit(event);
        console.log(`Daily usage: ${rateLimitResultLog.usage}/${DAILY_REQUEST_LIMIT}`);

        // Step 1: Generate 3 quotes
        const numQuotes = 3;
        let quotes;
        let bestQuote;
        
        try {
            quotes = await generateQuotes(apiKey, vibe, language, context, numQuotes);
            console.log(`Generated ${numQuotes} quotes:`, quotes);

            // Step 2: Select the best quote
            bestQuote = await selectBestQuote(apiKey, vibe, language, quotes, context);
            console.log(`Selected best quote:`, bestQuote);
        } catch (error) {
            console.error('Error with quote generation:', error);
            throw error;
        }

        // Save quote to database if user is authenticated
        if (authenticated && user) {
            try {
                await saveUserQuote(user.userId, vibe, bestQuote, language);
                console.log(`Quote saved to database for user ${user.userId}`);
            } catch (dbError) {
                console.error('Error saving quote to database:', dbError);
                // Don't fail the request if saving fails, just log it
            }
        }

        // Generate background image for the best quote
        const backgroundImage = await generateQuoteImage(bestQuote, vibe, language);

        // Prepare response data
        const responseData = {
            quote: bestQuote,
            author: `AI Generated for ${vibe}`,
            vibe,
            context: context,
            backgroundImage: backgroundImage,
            timestamp: new Date().toISOString(),
            saved: authenticated && user // Indicate if quote was saved
        };

        // Add rate limit info
        const rateLimitResultFinal = checkDailyRateLimit(event);
        responseData.requestsRemaining = DAILY_REQUEST_LIMIT - rateLimitResultFinal.usage;

        // Return the result
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error('Error in getBestQuote function:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to generate quote',
                message: error.message,
                success: false
            })
        };
    }
};

/**
 * Step 1: Generate quotes using OpenAI
 */
async function generateQuotes(apiKey, vibe, language, context, numQuotes) {
    // Build contextual information for the prompt
    let contextualInfo = '';
    
    if (context.holiday) {
        contextualInfo += ` It's ${context.holiday}, so naturally incorporate that joyful spirit into the quote without being too obvious or cliché.`;
    }
    
    if (context.season) {
        contextualInfo += ` The season is ${context.season}, so let that natural rhythm subtly influence the quote.`;
    }

    // Language-specific configuration
    const languageMap = {
        'english': { name: 'English', code: 'en' },
        'french': { name: 'French', code: 'fr' },
        'german': { name: 'German', code: 'de' },
        'spanish': { name: 'Spanish', code: 'es' },
        'portuguese': { name: 'Portuguese', code: 'pt' },
        'italian': { name: 'Italian', code: 'it' },
        'slovak': { name: 'Slovak', code: 'sk' }
    };

    const targetLanguage = languageMap[language?.toLowerCase()] || languageMap['english'];
    const languageInstruction = language && language.toLowerCase() !== 'english' 
        ? `Write the quote in ${targetLanguage.name}. Use proper grammar and natural expression in ${targetLanguage.name}.`
        : '';

    // Simpler prompt for guest users (single sentence quotes)
    const prompt = `You are a master quote generator with deep emotional intelligence. 

Generate exactly ${numQuotes} unique, inspiring quotes about ${vibe}. Each quote should be exactly one sentence, profound, and emotionally impactful.${contextualInfo}

${languageInstruction}

Style requirements:
- One sentence per quote
- Original and authentic 
- Emotionally resonant and memorable
- Universal wisdom that speaks to the human condition
- Avoid clichés and overused phrases
- Make each quote distinctly different from others

Format your response as a JSON array with ${numQuotes} quotes:
["Quote 1", "Quote 2", "Quote 3"]

Focus on the emotional theme of ${vibe} and create quotes that would inspire someone seeking that particular feeling or mindset.`;

    const requestData = {
        model: GENERATION_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.95,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
        max_tokens: 200  // Shorter tokens for single sentence quotes
    };

    const response = await callOpenAI(apiKey, requestData);
    const quotes = parseQuotesFromResponse(response);
    
    // Validate we got the right number of quotes
    const minQuotes = 2;
    const maxQuotes = 3;
    if (quotes.length < minQuotes || quotes.length > maxQuotes) {
        throw new Error(`Expected ${minQuotes}-${maxQuotes} quotes, got ${quotes.length}`);
    }

    return quotes;
}

/**
 * Step 2: Select the best quote from the generated options
 */
async function selectBestQuote(apiKey, vibe, language, quotes, context) {
    // Language-specific configuration
    const languageMap = {
        'english': { name: 'English', code: 'en' },
        'french': { name: 'French', code: 'fr' },
        'german': { name: 'German', code: 'de' },
        'spanish': { name: 'Spanish', code: 'es' },
        'portuguese': { name: 'Portuguese', code: 'pt' },
        'italian': { name: 'Italian', code: 'it' },
        'slovak': { name: 'Slovak', code: 'sk' }
    };

    const targetLanguage = languageMap[language?.toLowerCase()] || languageMap['english'];
    const languageNote = language && language.toLowerCase() !== 'english' 
        ? ` The quotes are in ${targetLanguage.name}.`
        : '';

    let contextualInfo = '';
    if (context.holiday) {
        contextualInfo += ` Consider that these quotes should resonate with the ${context.holiday} spirit.`;
    }

    const evaluationPrompt = `You are a French literary jury expert evaluating inspirational quotes for emotional impact and literary quality.

Here are ${quotes.length} quotes about ${vibe}:
${quotes.map((quote, index) => `${index + 1}. "${quote}"`).join('\n')}

${languageNote}${contextualInfo}

Evaluate each quote based on:
1. Emotional resonance and inspirational power
2. Literary quality and elegance
3. Originality and authenticity
4. Universal appeal and wisdom
5. Memorability and impact

Select the quote that best embodies the essence of ${vibe} and would be most inspiring to someone seeking that emotional state.

Respond with ONLY a JSON object in this format:
{"best": 2}

Where the number corresponds to the quote's position in the list (1, 2, or 3).`;

    const evaluationData = {
        model: EVALUATION_MODEL,
        messages: [
            { role: 'system', content: 'You are a French literary jury expert who evaluates quotes based on emotional impact, literary quality, and inspirational power. Always respond with valid JSON.' },
            { role: 'user', content: evaluationPrompt }
        ],
        temperature: 0,
        max_tokens: 50
    };

    const evaluationResponse = await callOpenAI(apiKey, evaluationData);
    
    try {
        const result = JSON.parse(evaluationResponse.trim());
        const bestIndex = result.best;
        
        if (bestIndex < 1 || bestIndex > quotes.length) {
            console.warn(`Invalid quote selection: ${bestIndex}, using first quote`);
            return quotes[0];
        }
        
        return quotes[bestIndex - 1];
    } catch (parseError) {
        console.warn('Failed to parse evaluation response, using first quote:', parseError);
        return quotes[0];
    }
}

/**
 * Make OpenAI API call with error handling
 */
async function callOpenAI(apiKey, requestData) {
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API');
    }

    return data.choices[0].message.content;
}

/**
 * Parse quotes from OpenAI response
 */
function parseQuotesFromResponse(response) {
    try {
        // Try to parse as JSON array first
        const parsed = JSON.parse(response.trim());
        if (Array.isArray(parsed)) {
            return parsed.map(quote => 
                typeof quote === 'string' ? quote.trim().replace(/^["']|["']$/g, '') : String(quote).trim()
            ).filter(quote => quote.length > 0);
        }
    } catch (jsonError) {
        console.warn('Failed to parse as JSON, trying regex extraction:', jsonError);
    }

    // Fallback: extract quotes using regex patterns
    const patterns = [
        /"([^"]+)"/g,                    // "quoted text"
        /'([^']+)'/g,                    // 'quoted text'
        /(?:^|\n)\d+\.\s*(.+?)(?=\n|$)/g, // 1. numbered list
        /(?:^|\n)-\s*(.+?)(?=\n|$)/g,    // - bullet points
        /(?:^|\n)•\s*(.+?)(?=\n|$)/g     // • bullet points
    ];

    let quotes = [];
    for (const pattern of patterns) {
        const matches = [...response.matchAll(pattern)];
        if (matches.length > 0) {
            quotes = matches.map(match => match[1].trim()).filter(quote => quote.length > 10);
            if (quotes.length >= 2) break;
        }
    }

    // If no patterns match, split by common delimiters
    if (quotes.length === 0) {
        quotes = response.split(/[\n\r]+/)
            .map(line => line.trim())
            .filter(line => line.length > 10 && !line.match(/^\d+\.?\s*$/))
            .slice(0, 5); // Allow up to 5 quotes
    }

    return quotes;
}

/**
 * Check if user has exceeded daily rate limit
 */
function checkDailyRateLimit(event) {
    const today = new Date().toDateString();
    const clientIP = event.headers['x-forwarded-for'] || 
                    event.headers['x-real-ip'] || 
                    'unknown';
    
    const key = `${clientIP}_${today}`;
    
    // Get current usage
    const currentUsage = dailyUsage.get(key) || 0;
    
    // Check if limit exceeded
    if (currentUsage >= DAILY_REQUEST_LIMIT) {
        return {
            allowed: false,
            usage: currentUsage,
            limit: DAILY_REQUEST_LIMIT,
            resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
        };
    }
    
    // Increment usage
    dailyUsage.set(key, currentUsage + 1);
    
    // Cleanup old entries (run occasionally)
    if (Math.random() < 0.1) {
        cleanupOldEntries();
    }
    
    return {
        allowed: true,
        usage: currentUsage + 1,
        limit: DAILY_REQUEST_LIMIT,
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
    };
}

/**
 * Clean up old rate limit entries
 */
function cleanupOldEntries() {
    const today = new Date().toDateString();
    const keysToDelete = [];
    
    for (const [key] of dailyUsage) {
        if (!key.endsWith(today)) {
            keysToDelete.push(key);
        }
    }
    
    keysToDelete.forEach(key => dailyUsage.delete(key));
}

/**
 * Validate vibe parameter
 */
function isValidVibe(vibe) {
    const validVibes = ['gratitude', 'resilience', 'ambition', 'creativity', 'serenity', 'courage', 'wisdom', 'joy'];
    return validVibes.includes(vibe.toLowerCase());
}

// Generate background image for quote
const generateQuoteImage = async (quote, vibe, language) => {
    // Simplified version without authentication context
    const vibeColors = {
        gratitude: '#f4a261',
        resilience: '#e76f51', 
        ambition: '#2a9d8f',
        creativity: '#e9c46a',
        serenity: '#a8dadc',
        courage: '#457b9d',
        wisdom: '#f1faee',
        joy: '#ffb3ba'
    };
    
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${vibeColors[vibe] || '#2a9d8f'};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:${vibeColors[vibe] || '#2a9d8f'};stop-opacity:0.3" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg)"/>
            <text x="50%" y="50%" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" fill="white" opacity="0.9">
                ${vibe.charAt(0).toUpperCase() + vibe.slice(1)} Quote
            </text>
        </svg>
    `)}`; 
};