import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler .env manualmente
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=["']?(.+?)["']?(\s|$)/);
const databaseUrl = dbUrlMatch ? dbUrlMatch[1] : null;

if (!databaseUrl) {
    console.error("ERRO: DATABASE_URL não encontrada no .env");
    process.exit(1);
}

const sql = neon(databaseUrl);

async function setup() {
    console.log("Iniciando criação da tabela de administradores...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS administrators (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("✅ Tabela 'administrators' criada de forma DURÁVEL com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar tabela:", error);
    }
}

setup();
