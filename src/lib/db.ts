import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = import.meta.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL não está configurada.');
  return neon(url);
}

export default getDb;
