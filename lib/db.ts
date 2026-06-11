import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const isDev = process.env.NODE_ENV !== 'production'

  if (isDev) {
    // Development: SQLite via better-sqlite3
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path')
      const dbPath = path.join(process.cwd(), 'dev.db')
      const adapter = new PrismaBetterSqlite3({ url: dbPath })
      return new PrismaClient({ adapter, log: ['error'] } as ConstructorParameters<typeof PrismaClient>[0])
    } catch {
      // Fallback if better-sqlite3 not available
      return new PrismaClient({ log: ['error'] })
    }
  }

  // Production: Neon PostgreSQL (serverless)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool, neonConfig } = require('@neondatabase/serverless')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaNeon } = require('@prisma/adapter-neon')

  // Use ws for non-edge environments (Node.js on Vercel)
  if (typeof WebSocket === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    neonConfig.webSocketConstructor = require('ws')
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)

  return new PrismaClient({ adapter, log: ['error'] } as ConstructorParameters<typeof PrismaClient>[0])
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
