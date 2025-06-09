// Netlify Function: getBestQuote
// Handles two-step quote generation: generate 3 quotes, then select the best one

const fetch = require('node-fetch');
const { authenticateUser } = require('./utils/auth');
const { saveUserQuote, query } = require('./utils/database');

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
    
    console.log('🔑 API Key status:');
    console.log('  - Key present:', !!apiKey);
    console.log('  - Key length:', apiKey ? apiKey.length : 0);
    console.log('  - Key prefix:', apiKey ? apiKey.substring(0, 7) + '...' : 'N/A');
    console.log('  - Environment:', process.env.NODE_ENV || 'development');
    console.log('  - Function name:', context.functionName || 'getBestQuote');

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
        
        // Log detailed context information
        console.log('=== CONTEXT ANALYSIS ===');
        console.log('Raw context received:', JSON.stringify(context, null, 2));
        
        if (context.userContext) {
            console.log('✅ User custom context found:', context.userContext);
        } else {
            console.log('❌ No user custom context provided');
        }
        
        if (context.longerQuotes) {
            console.log('✅ Longer quotes requested');
        } else {
            console.log('ℹ️ Standard quote length requested');
        }
        
        if (context.holiday) {
            console.log('🎉 Holiday context:', context.holiday);
        }
        
        console.log('========================');
        
        const rateLimitResultLog = checkDailyRateLimit(event);
        console.log(`Daily usage: ${rateLimitResultLog.usage}/${DAILY_REQUEST_LIMIT}`);

        // Step 1: Generate 3 quotes
        const numQuotes = 3;
        let quotes;
        let bestQuote;
        let usedFallback = false;
        
        const startTime = Date.now();
        console.log(`⏱️ Starting AI quote generation at ${new Date().toISOString()}`);
        
        try {
            quotes = await generateQuotes(apiKey, vibe, language, context, numQuotes);
            const generationTime = Date.now() - startTime;
            console.log(`⏱️ Quote generation completed in ${generationTime}ms`);
            console.log(`Generated ${numQuotes} quotes:`, quotes);

            // Step 2: Select the best quote
            const selectionStartTime = Date.now();
            bestQuote = await selectBestQuote(apiKey, vibe, language, quotes, context);
            const selectionTime = Date.now() - selectionStartTime;
            const totalTime = Date.now() - startTime;
            
            console.log(`⏱️ Quote selection completed in ${selectionTime}ms`);
            console.log(`⏱️ Total AI processing time: ${totalTime}ms`);
            console.log(`Selected best quote:`, bestQuote);
        } catch (error) {
            console.error('❌ Error with AI quote generation:', error);
            
            // Check if it's a 502 error or other API failure
            if (error.message.includes('502') || error.message.includes('Bad Gateway') || 
                error.message.includes('OpenAI API error') || error.message.includes('timeout') ||
                error.message.includes('ECONNRESET') || error.message.includes('ETIMEDOUT') ||
                error.message.includes('fetch failed') || error.code === 'ECONNREFUSED') {
                
                console.log('🔄 AI service unavailable, attempting database fallback...');
                
                try {
                    bestQuote = await getFallbackQuoteFromDB(vibe, language);
                    if (bestQuote) {
                        usedFallback = true;
                        console.log('✅ Using stored quote from database as fallback:', bestQuote);
                        console.log('📊 DB stored quotes used due to AI service unavailability');
                    } else {
                        throw new Error('No fallback quotes available in database');
                    }
                } catch (dbError) {
                    console.error('❌ Database fallback also failed:', dbError);
                    throw new Error('Both AI generation and database fallback failed. Please try again later.');
                }
            } else {
                throw error;
            }
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
            saved: authenticated && user, // Indicate if quote was saved
            usedFallback: usedFallback
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
    console.log('🎯 Starting generateQuotes function');
    console.log('🎯 Input parameters:', { vibe, language, numQuotes });
    console.log('🎯 Context received:', JSON.stringify(context, null, 2));
    
    // Build contextual information for the prompt
    let contextualInfo = '';
    
    // Add user's custom context if provided
    if (context.userContext) {
        contextualInfo += ` Personal context: The user is currently ${context.userContext}. Tailor the quote to be especially relevant and supportive for their current situation.`;
        console.log('📝 Added user context to prompt:', context.userContext);
    }
    
    if (context.holiday) {
        contextualInfo += ` It's ${context.holiday}, so naturally incorporate that joyful spirit into the quote without being too obvious or cliché.`;
        console.log('🎉 Added holiday context to prompt:', context.holiday);
    }
    
    if (context.season) {
        contextualInfo += ` The season is ${context.season}, so let that natural rhythm subtly influence the quote.`;
        console.log('🍂 Added seasonal context to prompt:', context.season);
    }

    // Determine quote length based on user preference
    const longerQuotes = context.longerQuotes === true;
    const quoteLengthInstruction = longerQuotes 
        ? 'Generate multi-sentence quotes (2-3 sentences each) with deeper insights and expanded wisdom.'
        : 'Generate exactly one sentence per quote that is profound and emotionally impactful.';
    
    const maxTokens = longerQuotes ? 400 : 200;
    
    console.log('📏 Quote length preference:', longerQuotes ? 'LONGER (multi-sentence)' : 'STANDARD (single sentence)');
    console.log('🔧 Max tokens set to:', maxTokens);

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
    
    console.log('🌍 Target language:', targetLanguage.name);
    console.log('🌍 Language instruction:', languageInstruction || 'English (default)');

    // Build the complete prompt
    const prompt = `You are a master quote generator with deep emotional intelligence. 

Generate exactly ${numQuotes} unique, inspiring quotes about ${vibe}. ${quoteLengthInstruction}${contextualInfo}

${languageInstruction}

Style requirements:
- ${longerQuotes ? 'Multi-sentence quotes with deeper philosophical insights' : 'One sentence per quote'}
- Original and authentic 
- Emotionally resonant and memorable
- Universal wisdom that speaks to the human condition
- Avoid clichés and overused phrases
- Make each quote distinctly different from others
${context.userContext ? '- Make the quotes personally relevant to the user\'s current situation' : ''}

Format your response as a JSON array with ${numQuotes} quotes:
["Quote 1", "Quote 2", "Quote 3"]

Focus on the emotional theme of ${vibe} and create quotes that would inspire someone seeking that particular feeling or mindset.`;

    // Log the final prompt for debugging
    console.log('🤖 FINAL PROMPT SENT TO AI:');
    console.log('=====================================');
    console.log(prompt);
    console.log('=====================================');

    const requestData = {
        model: GENERATION_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.95,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
        max_tokens: maxTokens
    };

    console.log('⚙️ Full request data being sent to OpenAI:');
    console.log('=====================================');
    console.log(JSON.stringify(requestData, null, 2));
    console.log('=====================================');

    const response = await callOpenAI(apiKey, requestData);
    console.log('📋 Raw response from OpenAI:', response);
    
    const quotes = parseQuotesFromResponse(response);
    console.log('📋 Parsed quotes:', quotes);
    
    // Validate we got the right number of quotes
    const minQuotes = 2;
    const maxQuotes = 3;
    if (quotes.length < minQuotes || quotes.length > maxQuotes) {
        console.error(`❌ Quote count validation failed: Expected ${minQuotes}-${maxQuotes} quotes, got ${quotes.length}`);
        throw new Error(`Expected ${minQuotes}-${maxQuotes} quotes, got ${quotes.length}`);
    }

    console.log('✅ Quote generation completed successfully');
    return quotes;
}

/**
 * Step 2: Select the best quote from the generated options
 */
async function selectBestQuote(apiKey, vibe, language, quotes, context) {
    console.log('🎯 Starting quote evaluation phase...');
    
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
    
    if (context.userContext) {
        contextualInfo += ` The user is currently ${context.userContext}, so prioritize the quote that would be most relevant and supportive for their specific situation.`;
        console.log('📝 Including user context in evaluation:', context.userContext);
    }
    
    if (context.longerQuotes) {
        contextualInfo += ` The user prefers longer, more detailed quotes with deeper insights.`;
        console.log('📖 Evaluating for longer quote preference');
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
${context.userContext ? '6. Relevance to the user\'s current personal situation' : ''}

Select the quote that best embodies the essence of ${vibe} and would be most inspiring to someone seeking that emotional state${context.userContext ? ', especially considering their current circumstances' : ''}.

Respond with ONLY a JSON object in this format:
{"best": 2}

Where the number corresponds to the quote's position in the list (1, 2, or 3).`;

    console.log('🤖 EVALUATION PROMPT SENT TO AI:');
    console.log('=====================================');
    console.log(evaluationPrompt);
    console.log('=====================================');

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
    console.log('🎯 Raw evaluation response:', evaluationResponse);
    
    try {
        const result = JSON.parse(evaluationResponse.trim());
        const bestIndex = result.best;
        
        console.log('🏆 AI selected quote #' + bestIndex + ' as the best');
        console.log('🎯 Selected quote:', quotes[bestIndex - 1]);
        
        if (bestIndex < 1 || bestIndex > quotes.length) {
            console.warn(`❌ Invalid quote selection: ${bestIndex}, using first quote instead`);
            return quotes[0];
        }
        
        return quotes[bestIndex - 1];
    } catch (parseError) {
        console.warn('❌ Failed to parse evaluation response, using first quote:', parseError);
        console.warn('Raw response that failed to parse:', evaluationResponse);
        return quotes[0];
    }
}

/**
 * Make OpenAI API call with error handling
 */
async function callOpenAI(apiKey, requestData) {
    console.log('🔧 Making OpenAI API call...');
    console.log('📋 Request model:', requestData.model);
    console.log('📋 Request temperature:', requestData.temperature);
    console.log('📋 Request max_tokens:', requestData.max_tokens || 'default');
    console.log('📋 Request messages length:', requestData.messages?.length || 0);
    
    try {
        console.log('🌐 Sending request to:', OPENAI_API_URL);
        console.log('🔑 API key present:', !!apiKey);
        console.log('🔑 API key length:', apiKey ? apiKey.length : 0);
        console.log('🔑 API key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
        
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response statusText:', response.statusText);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.log('❌ Error response body:', JSON.stringify(errorData, null, 2));
            } catch (parseError) {
                console.log('❌ Could not parse error response as JSON:', parseError.message);
                errorData = {};
            }
            
            const errorMessage = `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`;
            
            // Log specific error types for better debugging
            if (response.status === 502) {
                console.error('🚨 502 Bad Gateway error from OpenAI');
            } else if (response.status >= 500) {
                console.error(`🚨 Server error ${response.status} from OpenAI`);
            } else if (response.status === 429) {
                console.error('🚨 Rate limit exceeded on OpenAI API');
            } else if (response.status === 401) {
                console.error('🚨 Authentication failed - check API key');
            } else if (response.status === 400) {
                console.error('🚨 Bad request - check request format');
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('✅ OpenAI response received successfully');
        console.log('📊 Response data keys:', Object.keys(data));
        console.log('📊 Choices available:', data.choices?.length || 0);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('❌ Invalid response structure:', JSON.stringify(data, null, 2));
            throw new Error('Invalid response structure from OpenAI API');
        }

        console.log('📝 Response content length:', data.choices[0].message.content?.length || 0);
        console.log('📝 Response content preview:', data.choices[0].message.content?.substring(0, 100) + '...');
        
        return data.choices[0].message.content;
    } catch (fetchError) {
        console.error('❌ Fetch error details:', {
            name: fetchError.name,
            message: fetchError.message,
            code: fetchError.code,
            cause: fetchError.cause
        });
        throw fetchError;
    }
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

/**
 * Retrieve a fallback quote from the database using existing utilities
 */
async function getFallbackQuoteFromDB(vibe, language) {
    try {
        console.log(`🔍 Searching database for ${vibe} quotes in ${language}...`);
        
        // Query for quotes matching the vibe from the database
        // We'll get a random quote from existing stored quotes for this vibe
        const queryText = `
            SELECT quote_text, language 
            FROM user_quotes 
            WHERE vibe = $1 
            AND (language = $2 OR language = 'english')
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        
        const result = await query(queryText, [vibe, language]);
        
        if (result.rows.length > 0) {
            const fallbackQuote = result.rows[0];
            console.log(`💾 Found fallback quote in database (language: ${fallbackQuote.language})`);
            return fallbackQuote.quote_text;
        } else {
            console.log(`❌ No stored quotes found for vibe: ${vibe}, language: ${language}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Database query error in fallback:', error);
        return null;
    }
}