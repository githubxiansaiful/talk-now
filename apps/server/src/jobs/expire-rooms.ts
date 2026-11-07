import { prisma } from '../lib/prisma';

export async function expireRoomsJob() {
  try {
    const now = new Date();
    const result = await prisma.room.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (result.count > 0) {
      console.log(`[Expiry Job] Marked ${result.count} room(s) as EXPIRED at ${now.toISOString()}`);
    }

    // Retention cleanup: purge rooms closed or expired more than 24 hours ago
    const retentionThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const purged = await prisma.room.deleteMany({
      where: {
        OR: [
          { status: 'EXPIRED', expiresAt: { lte: retentionThreshold } },
          { status: 'CLOSED', closedAt: { lte: retentionThreshold } },
        ],
      },
    });

    if (purged.count > 0) {
      console.log(`[Retention Job] Purged ${purged.count} expired/closed room(s) beyond retention threshold`);
    }
  } catch (error) {
    console.error('[Expiry Job] Error executing room expiry cleanup:', error);
  }
}

export function startExpiryScheduler(intervalMs = 30000): NodeJS.Timeout {
  console.log(`[Scheduler] Room expiry scheduler started (interval: ${intervalMs / 1000}s)`);
  // Run once immediately
  expireRoomsJob();
  return setInterval(expireRoomsJob, intervalMs);
}
