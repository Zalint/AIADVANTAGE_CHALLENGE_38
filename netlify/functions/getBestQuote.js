// Netlify Function: getBestQuote
// Handles two-step quote generation: generate 3 quotes, then select the best one

const fetch = require('node-fetch');

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GENERATION_MODEL = 'gpt-4o';
const EVALUATION_MODEL = 'gpt-4.1-mini';

// Rate limiting configuration
const DAILY_REQUEST_LIMIT = parseInt(process.env.DAILY_REQUEST_LIMIT) || 100;

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
        console.log(`Daily usage: ${rateLimitResult.usage}/${DAILY_REQUEST_LIMIT}`);

        // Step 1: Generate 3 quotes
        const quotes = await generateThreeQuotes(apiKey, vibe, language, context);
        console.log(`Generated 3 quotes:`, quotes);

        // Step 2: Select the best quote
        const bestQuote = await selectBestQuote(apiKey, vibe, language, quotes, context);
        console.log(`Selected best quote:`, bestQuote);

        // Return the result
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                quote: bestQuote,
                vibe: vibe,
                language: language,
                context: context,
                timestamp: Date.now(),
                success: true,
                usage: {
                    daily: rateLimitResult.usage + 1,
                    limit: DAILY_REQUEST_LIMIT,
                    remaining: DAILY_REQUEST_LIMIT - (rateLimitResult.usage + 1)
                }
            })
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
 * Step 1: Generate three quotes using OpenAI
 */
async function generateThreeQuotes(apiKey, vibe, language, context) {
    // Build contextual information for the prompt
    let contextualInfo = '';
    
    if (context.holiday) {
        contextualInfo += `It's currently ${context.holiday}. `;
    }
    
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
    
    const prompt = `You are an inspiring quote generator.
Generate exactly 3 short motivational quotes (one sentence each) that match the vibe: "${vibe}".

IMPORTANT: Generate all quotes in ${targetLanguage}. Make sure the quotes are natural and inspirational in ${targetLanguage}.

${contextualInfo ? `IMPORTANT CONTEXT: ${contextualInfo}Please incorporate this context naturally into the quotes when relevant. For holidays, reference the spirit of the occasion.` : ''}

Format them as a numbered list:
1. [quote 1]
2. [quote 2]  
3. [quote 3]

Make each quote unique, impactful, and directly related to the "${vibe}" theme.
Each quote should be complete in one sentence and ready to inspire someone.
If there's relevant context provided, subtly weave it into the quotes to make them more timely and personal.
Remember: ALL quotes must be in ${targetLanguage}.`;

    const response = await callOpenAI(apiKey, prompt);
    
    // Parse the numbered list response
    const quotes = parseQuotesFromResponse(response);
    
    if (quotes.length !== 3) {
        throw new Error(`Expected 3 quotes, got ${quotes.length}`);
    }
    
    return quotes;
}

/**
 * Step 2: Select the best quote from the three generated
 */
async function selectBestQuote(apiKey, vibe, language, quotes, context) {
    const quotesJson = quotes.map((quote, index) => ({
        numero: index + 1,
        citation: quote
    }));
    
    // Map language codes to language names for the jury prompt
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
    
    const systemPrompt = `Tu es un jury littéraire expert en citations inspirantes. Tu dois évaluer 3 citations selon les critères suivants:
- Impact émotionnel et force inspirante
- Pertinence avec le thème "${vibe}"
- Qualité littéraire et beauté de l'expression
- Originalité et mémorabilité
${context.holiday ? `- Pertinence avec le contexte actuel (${context.holiday})` : ''}

Tu dois choisir la MEILLEURE citation parmi les 3 proposées.
Renvoie strictement : {"best": n} où n est le numéro de la meilleure citation.`;

    const requestBody = {
        model: EVALUATION_MODEL,
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: JSON.stringify(quotesJson)
            }
        ],
        temperature: 0,
        max_tokens: 50
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
        console.error('OpenAI API error for evaluation:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI for evaluation');
    }

    try {
        const evaluationResult = JSON.parse(data.choices[0].message.content.trim());
        const selectedIndex = evaluationResult.best - 1; // Convert to 0-based index
        
        if (selectedIndex >= 0 && selectedIndex < quotes.length) {
            return quotes[selectedIndex];
        } else {
            console.error('Invalid selection index from evaluation:', evaluationResult);
            return quotes[0]; // Fallback to first quote
        }
    } catch (error) {
        console.error('Error parsing evaluation result:', error);
        return quotes[0]; // Fallback to first quote
    }
}

/**
 * Make a call to OpenAI API
 */
async function callOpenAI(apiKey, prompt, modelConfig = {}) {
    const defaultConfig = {
        model: GENERATION_MODEL,
        max_tokens: 200,
        temperature: 0.95,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
    };

    const config = { ...defaultConfig, ...modelConfig };

    const requestBody = {
        model: config.model,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: config.max_tokens,
        temperature: config.temperature,
        top_p: config.top_p,
        frequency_penalty: config.frequency_penalty,
        presence_penalty: config.presence_penalty
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

    return data.choices[0].message.content.trim();
}

/**
 * Parse quotes from the numbered list response
 */
function parseQuotesFromResponse(response) {
    const lines = response.split('\n').filter(line => line.trim());
    const quotes = [];
    
    for (const line of lines) {
        // Match numbered list items (1. 2. 3. etc.)
        const match = line.trim().match(/^\d+\.\s*(.+)$/);
        if (match) {
            let quote = match[1].trim();
            // Remove surrounding quotes if present
            quote = quote.replace(/^["']|["']$/g, '');
            quotes.push(quote);
        }
    }
    
    // Fallback: if numbered parsing fails, try to extract any quotes
    if (quotes.length === 0) {
        const fallbackQuotes = response.split('\n')
            .filter(line => line.trim() && !line.toLowerCase().includes('here are'))
            .map(line => line.trim().replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, ''))
            .filter(line => line.length > 10)
            .slice(0, 3);
        
        return fallbackQuotes;
    }
    
    return quotes;
}

/**
 * Check daily rate limit for the user
 */
function checkDailyRateLimit(event) {
    // Get client identifier (IP address as fallback)
    const clientIP = event.headers['x-forwarded-for'] || 
                     event.headers['x-real-ip'] || 
                     'unknown';
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const key = `${clientIP}-${today}`;
    
    // Clean up old entries (simple cleanup - remove entries from previous days)
    cleanupOldEntries();
    
    // Get current usage
    const currentUsage = dailyUsage.get(key) || 0;
    
    // Calculate reset time (midnight UTC)
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    
    if (currentUsage >= DAILY_REQUEST_LIMIT) {
        return {
            allowed: false,
            usage: currentUsage,
            resetTime: tomorrow.toISOString()
        };
    }
    
    // Increment usage
    dailyUsage.set(key, currentUsage + 1);
    
    return {
        allowed: true,
        usage: currentUsage,
        resetTime: tomorrow.toISOString()
    };
}

/**
 * Clean up old usage entries to prevent memory leaks
 */
function cleanupOldEntries() {
    const today = new Date().toISOString().split('T')[0];
    
    for (const [key, value] of dailyUsage.entries()) {
        const [ip, date] = key.split('-');
        if (date && date !== today) {
            dailyUsage.delete(key);
        }
    }
}

/**
 * Validation helper for vibe input
 */
function isValidVibe(vibe) {
    const validVibes = [
        'gratitude', 'resilience', 'ambition', 'creativity', 
        'serenity', 'courage', 'wisdom', 'joy'
    ];
    
    return validVibes.includes(vibe.toLowerCase());
} 