import { neon } from '@neondatabase/serverless';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

// Database connection string from environment - try multiple methods
const DATABASE_URL = env.DATABASE_URL || env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Debug logging for environment variables
console.log('🔍 Environment check:', {
  dev,
  DATABASE_URL_exists: !!DATABASE_URL,
  DATABASE_URL_length: DATABASE_URL?.length || 0,
  env_DATABASE_URL: !!env.DATABASE_URL,
  env_POSTGRES_URL: !!env.POSTGRES_URL,
  process_DATABASE_URL: !!process.env.DATABASE_URL,
  process_POSTGRES_URL: !!process.env.POSTGRES_URL,
  all_env_keys: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES'))
});

// Initialize Neon client (might be null if no DATABASE_URL)
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// In-memory fallback storage
const memoryConversations = new Map<string, Array<{role: 'user' | 'assistant', content: string, timestamp: number}>>();

// Database availability flag
let isDatabaseAvailable = false;

// Initialize database schema (graceful failure)
export async function initializeDatabase() {
  console.log('🚀 Initializing database...');
  if (!sql) {
    console.log('📝 Database not configured - using in-memory storage for this session');
    console.log('💡 To enable database: Set DATABASE_URL environment variable');
    return;
  }
  
  console.log('✅ Database connection available, attempting to initialize schema...');

  try {
    // Create conversations table
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        client_ip VARCHAR(45) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_client_ip ON conversations (client_ip)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations (updated_at)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages (timestamp)
    `;

    isDatabaseAvailable = true;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('⚠️  Database initialization failed, falling back to in-memory storage:', (error as Error).message);
    isDatabaseAvailable = false;
  }
}

// Helper functions with graceful fallback
export async function getOrCreateConversation(clientIP: string): Promise<number | string> {
  if (!isDatabaseAvailable || !sql) {
    // Return client IP as conversation identifier for in-memory storage
    return clientIP;
  }

  try {
    // First try to get existing conversation
    const existing = await sql`
      SELECT id FROM conversations 
      WHERE client_ip = ${clientIP} 
      ORDER BY updated_at DESC 
      LIMIT 1
    `;

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new conversation if none exists
    const newConversation = await sql`
      INSERT INTO conversations (client_ip) 
      VALUES (${clientIP}) 
      RETURNING id
    `;

    return newConversation[0].id;
  } catch (error) {
    console.error('⚠️  Database error in getOrCreateConversation, falling back to in-memory:', (error as Error).message);
    isDatabaseAvailable = false;
    return clientIP;
  }
}

export async function saveMessage(conversationId: number | string, role: 'user' | 'assistant', content: string) {
  if (!isDatabaseAvailable || !sql || typeof conversationId === 'string') {
    // Use in-memory storage
    const clientIP = conversationId as string;
    if (!memoryConversations.has(clientIP)) {
      memoryConversations.set(clientIP, []);
    }
    const conversation = memoryConversations.get(clientIP)!;
    conversation.push({ role, content, timestamp: Date.now() });
    
    // Keep only last 20 messages per conversation
    if (conversation.length > 20) {
      conversation.splice(0, conversation.length - 20);
    }
    
    return;
  }

  try {
    // Insert the message
    await sql`
      INSERT INTO messages (conversation_id, role, content) 
      VALUES (${conversationId}, ${role}, ${content})
    `;

    // Update conversation timestamp
    await sql`
      UPDATE conversations 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${conversationId}
    `;
  } catch (error) {
    console.error('⚠️  Database error in saveMessage, message not persisted:', (error as Error).message);
    isDatabaseAvailable = false;
  }
}

export async function getRecentMessages(conversationId: number | string, limit: number = 10) {
  if (!isDatabaseAvailable || !sql || typeof conversationId === 'string') {
    // Use in-memory storage
    const clientIP = conversationId as string;
    const conversation = memoryConversations.get(clientIP) || [];
    return conversation.slice(-limit).map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp).toISOString()
    }));
  }

  try {
    const messages = await sql`
      SELECT role, content, timestamp 
      FROM messages 
      WHERE conversation_id = ${conversationId} 
      ORDER BY timestamp DESC 
      LIMIT ${limit}
    `;

    // Reverse to get chronological order
    return messages.reverse();
  } catch (error) {
    console.error('⚠️  Database error in getRecentMessages, using empty history:', (error as Error).message);
    isDatabaseAvailable = false;
    return [];
  }
}

export async function getAllConversations() {
  if (!isDatabaseAvailable || !sql) {
    // Convert in-memory conversations to admin format
    const conversations = [];
    for (const [clientIP, messages] of memoryConversations.entries()) {
      if (messages.length > 0) {
        conversations.push({
          id: Math.abs(clientIP.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)), // Simple hash for display
          client_ip: clientIP,
          created_at: new Date(messages[0].timestamp).toISOString(),
          updated_at: new Date(messages[messages.length - 1].timestamp).toISOString(),
          message_count: messages.length,
          last_message_at: new Date(messages[messages.length - 1].timestamp).toISOString()
        });
      }
    }
    return conversations.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  try {
    const conversations = await sql`
      SELECT 
        c.id,
        c.client_ip,
        c.created_at,
        c.updated_at,
        COUNT(m.id) as message_count,
        MAX(m.timestamp) as last_message_at
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      GROUP BY c.id, c.client_ip, c.created_at, c.updated_at
      ORDER BY c.updated_at DESC
    `;

    return conversations;
  } catch (error) {
    console.error('⚠️  Database error in getAllConversations:', (error as Error).message);
    isDatabaseAvailable = false;
    return [];
  }
}

export async function getConversationMessages(conversationId: number) {
  if (!isDatabaseAvailable || !sql) {
    return [];
  }

  try {
    const messages = await sql`
      SELECT id, role, content, timestamp 
      FROM messages 
      WHERE conversation_id = ${conversationId} 
      ORDER BY timestamp ASC
    `;

    return messages;
  } catch (error) {
    console.error('⚠️  Database error in getConversationMessages:', (error as Error).message);
    isDatabaseAvailable = false;
    return [];
  }
}

// Cleanup function for in-memory storage
export function cleanupMemoryConversations() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [ip, messages] of memoryConversations.entries()) {
    const recentMessages = messages.filter(msg => msg.timestamp > oneHourAgo);
    if (recentMessages.length === 0) {
      memoryConversations.delete(ip);
    } else {
      memoryConversations.set(ip, recentMessages);
    }
  }
}

// Clean up memory every 10 minutes
setInterval(cleanupMemoryConversations, 10 * 60 * 1000);

// Types
export interface ConversationSummary {
  id: number;
  client_ip: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_at: string | null;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
} 