import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Initializes SQLite pragmas (WAL mode) and ensures all required tables and indexes exist.
 * Fully idempotent, sub-millisecond execution.
 */
export async function ensureDatabaseSchema(): Promise<void> {
  try {
    await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
    await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Room" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "code" TEXT NOT NULL,
        "name" TEXT,
        "creatorTokenHash" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "maxMembers" INTEGER,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" DATETIME NOT NULL,
        "closedAt" DATETIME
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Member" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "roomId" TEXT NOT NULL,
        "displayName" TEXT NOT NULL,
        "sessionTokenHash" TEXT NOT NULL,
        "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "leftAt" DATETIME,
        "isCreator" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Member_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "roomId" TEXT NOT NULL,
        "memberId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "messageType" TEXT NOT NULL DEFAULT 'TEXT',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "editedAt" DATETIME,
        "deletedAt" DATETIME,
        CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Message_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Reaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "messageId" TEXT NOT NULL,
        "memberId" TEXT NOT NULL,
        "emoji" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Reaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Room_code_key" ON "Room"("code");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Room_code_idx" ON "Room"("code");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Room_expiresAt_idx" ON "Room"("expiresAt");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Room_status_idx" ON "Room"("status");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Member_roomId_idx" ON "Member"("roomId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Member_sessionTokenHash_idx" ON "Member"("sessionTokenHash");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Message_roomId_createdAt_idx" ON "Message"("roomId", "createdAt");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Message_memberId_idx" ON "Message"("memberId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Reaction_messageId_idx" ON "Reaction"("messageId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Reaction_memberId_idx" ON "Reaction"("memberId");`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Reaction_messageId_memberId_emoji_key" ON "Reaction"("messageId", "memberId", "emoji");`);
  } catch (error) {
    console.error('Failed to initialize SQLite database schema:', error);
  }
}

export * from '@prisma/client';
