import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function createTable() {
  try {
    console.log('Criando tabela doctors...');
    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        crm TEXT NOT NULL,
        specialty TEXT NOT NULL,
        photo_url TEXT,
        instagram_url TEXT,
        website_url TEXT,
        about TEXT,
        address TEXT,
        phone TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Tabela criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
}

createTable();
