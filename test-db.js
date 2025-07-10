// Temporary test file - you can delete this after verifying your database setup
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

async function testDatabase() {
  console.log('🔍 Testing Neon PostgreSQL connection...\n');
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('\n📝 Create a .env file with:');
    console.log('DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require');
    return;
  }

  try {
    const sql = neon(DATABASE_URL);
    
    // Test connection
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Database connection successful!');
    console.log('📅 Current time:', result[0].current_time);
    console.log('🗄️  PostgreSQL version:', result[0].pg_version.split(' ')[0]);
    
    // Test table operations
    await sql`
      CREATE TABLE IF NOT EXISTS test_chat (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Table creation successful!');
    
    // Test insert
    await sql`INSERT INTO test_chat (message) VALUES ('Hello from test!')`;
    console.log('✅ Insert operation successful!');
    
    // Test select
    const rows = await sql`SELECT * FROM test_chat ORDER BY created_at DESC LIMIT 1`;
    console.log('✅ Select operation successful!');
    console.log('📄 Sample row:', { id: rows[0].id, message: rows[0].message });
    
    // Clean up
    await sql`DROP TABLE test_chat`;
    console.log('✅ Cleanup successful!');
    
    console.log('\n🎉 All database tests passed!');
    console.log('🚀 Your chat app is ready for persistent storage on Vercel!');
    console.log('\n💡 You can now delete this test file: rm test-db.js');
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your DATABASE_URL is correct in .env file');
    console.log('2. Check that your Neon database is active (not sleeping)');
    console.log('3. Ensure you have internet connectivity');
    console.log('4. Try refreshing your Neon connection string');
  }
}

testDatabase(); 