import { neon } from '@neondatabase/serverless';
import { dev } from '$app/environment';

// Database connection string from environment
const DATABASE_URL = dev 
  ? process.env.DATABASE_URL || process.env.POSTGRES_URL
  : process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not found. Database operations will fail.');
}

// Initialize Neon client
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Initialize database schema
export async function initializeDatabase() {
  if (!sql) {
    throw new Error('Database connection not available. Please set DATABASE_URL environment variable.');
  }

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

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Helper functions
export async function getOrCreateConversation(clientIP: string): Promise<number> {
  if (!sql) {
    throw new Error('Database connection not available');
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
    console.error('Error in getOrCreateConversation:', error);
    throw error;
  }
}

export async function saveMessage(conversationId: number, role: 'user' | 'assistant', content: string) {
  if (!sql) {
    throw new Error('Database connection not available');
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
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function getRecentMessages(conversationId: number, limit: number = 10) {
  if (!sql) {
    throw new Error('Database connection not available');
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
    console.error('Error getting recent messages:', error);
    throw error;
  }
}

export async function getAllConversations() {
  if (!sql) {
    throw new Error('Database connection not available');
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
    console.error('Error getting all conversations:', error);
    throw error;
  }
}

export async function getConversationMessages(conversationId: number) {
  if (!sql) {
    throw new Error('Database connection not available');
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
    console.error('Error getting conversation messages:', error);
    throw error;
  }
}

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