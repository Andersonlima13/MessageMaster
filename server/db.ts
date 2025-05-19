import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configuração do Neon para usar WebSockets
neonConfig.webSocketConstructor = ws;

// Verificação da variável de ambiente
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida. Você criou o banco de dados?');
}

// Criação do pool de conexões
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Criação do cliente Drizzle com esquema
export const db = drizzle(pool, { schema });