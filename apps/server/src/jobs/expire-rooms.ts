import { prisma } from '../lib/prisma';
import { broadcastRoomExpired } from '../socket';

export async function expireRoomsJob() {
  try {
    const now = new Date();

    // Find rooms that should expire
    const expiringRooms = await prisma.room.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lte: now,
        },
      },
      select: { id: true, code: true },
    });

    if (expiringRooms.length > 0) {
      await prisma.room.updateMany({
        where: {
          id: { in: expiringRooms.map((r) => r.id) },
        },
        data: {
          status: 'EXPIRED',
        },
      });

      console.log(`[Expiry Job] Marked ${expiringRooms.length} room(s) as EXPIRED at ${now.toISOString()}`);

      // Broadcast expiry to connected sockets in each room
      for (const r of expiringRooms) {
        broadcastRoomExpired(r.code);
      }
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
  expireRoomsJob();
  return setInterval(expireRoomsJob, intervalMs);
}
