const { Client, Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to execute queries
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// User operations for email/password auth
async function createUser(email, password, name) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const queryText = `
    INSERT INTO users (email, password_hash, name, google_id)
    VALUES ($1, $2, $3, NULL)
    RETURNING id, email, name, created_at
  `;
  
  const result = await query(queryText, [email, hashedPassword, name]);
  return result.rows[0];
}

async function getUserByEmail(email) {
  try {
    const queryText = 'SELECT * FROM users WHERE email = $1';
    const result = await query(queryText, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    // If password_hash column doesn't exist, return null for now
    if (error.message.includes('password_hash')) {
      console.warn('password_hash column not found. Please run the database migration.');
      return null;
    }
    throw error;
  }
}

async function verifyPassword(email, password) {
  const user = await getUserByEmail(email);
  if (!user || !user.password_hash) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (isValid) {
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

async function getUserByGoogleId(googleId) {
  const queryText = 'SELECT * FROM users WHERE google_id = $1';
  const result = await query(queryText, [googleId]);
  return result.rows[0];
}

async function getUserById(userId) {
  const queryText = 'SELECT * FROM users WHERE id = $1';
  const result = await query(queryText, [userId]);
  return result.rows[0];
}

// Quote operations
async function saveUserQuote(userId, vibe, quoteText, language = 'english') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert the quote
    const insertQuoteQuery = `
      INSERT INTO user_quotes (user_id, vibe, quote_text, language)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const quoteResult = await client.query(insertQuoteQuery, [userId, vibe, quoteText, language]);
    
    // Update or insert user stats
    const upsertStatsQuery = `
      INSERT INTO user_stats (user_id, vibe, quote_count, last_generated)
      VALUES ($1, $2, 1, NOW())
      ON CONFLICT (user_id, vibe) DO UPDATE
      SET quote_count = user_stats.quote_count + 1,
          last_generated = NOW()
    `;
    await client.query(upsertStatsQuery, [userId, vibe]);
    
    await client.query('COMMIT');
    return quoteResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getUserQuotes(userId, limit = 50, startDate = null, endDate = null) {
  let queryText = `
    SELECT * FROM user_quotes 
    WHERE user_id = $1
  `;
  let params = [userId];
  let paramCount = 1;

  // Add date filtering if provided
  if (startDate) {
    paramCount++;
    queryText += ` AND created_at >= $${paramCount}`;
    params.push(startDate);
  }

  if (endDate) {
    paramCount++;
    queryText += ` AND created_at <= $${paramCount}`;
    params.push(endDate);
  }

  queryText += `
    ORDER BY created_at DESC 
    LIMIT $${paramCount + 1}
  `;
  params.push(limit);

  const result = await query(queryText, params);
  return result.rows;
}

async function getUserStats(userId) {
  const queryText = `
    SELECT 
      vibe,
      quote_count,
      last_generated
    FROM user_stats 
    WHERE user_id = $1
    ORDER BY quote_count DESC
  `;
  const result = await query(queryText, [userId]);
  return result.rows;
}

async function getTotalQuoteCount(userId) {
  const queryText = 'SELECT COUNT(*) as total FROM user_quotes WHERE user_id = $1';
  const result = await query(queryText, [userId]);
  return parseInt(result.rows[0].total);
}

module.exports = {
  query,
  createUser,
  getUserByEmail,
  verifyPassword,
  getUserByGoogleId,
  getUserById,
  saveUserQuote,
  getUserQuotes,
  getUserStats,
  getTotalQuoteCount
}; 