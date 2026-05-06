import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node.js environments (like Windows/VS Code terminal)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

// Create the pool and adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// Use globalThis to prevent exhaustion of database connections during hot-reloads
const prisma = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

export default prisma;