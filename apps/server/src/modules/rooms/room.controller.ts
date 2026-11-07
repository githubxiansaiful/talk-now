import { Router, Request, Response } from 'express';
import { roomService } from './room.service';
import { ZodError } from 'zod';
import { createIpRateLimiter } from '../../middleware/rate-limit';
import { broadcastRoomClosed, broadcastRoomTimeExtended } from '../../socket';
import { meetingRouter } from '../meetings/meeting.controller';

const router = Router();

// Mount nested meeting routes under /api/rooms/:code/meetings
router.use('/:code/meetings', meetingRouter);

// Rate limiters
const createRoomLimiter = createIpRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many rooms created from this IP. Please wait a few minutes.',
});

const joinRoomLimiter = createIpRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many join attempts. Please slow down.',
});

/**
 * POST /api/rooms - Create a new room
 */
router.post('/', createRoomLimiter, async (req: Request, res: Response) => {
  try {
    const result = await roomService.createRoom(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });
      return;
    }
    const message = error instanceof Error ? error.message : 'Failed to create room';
    res.status(500).json({ success: false, error: message });
  }
});

/**
 * GET /api/rooms/:code - Room preview and pre-join check
 */
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const room = await roomService.getRoomPreview(code);
    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Room not found';
    const status = message === 'Room not found' ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
});

/**
 * POST /api/rooms/:code/join - Join an existing active room
 */
router.post('/:code/join', joinRoomLimiter, async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const result = await roomService.joinRoom(code, req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });
      return;
    }
    const message = error instanceof Error ? error.message : 'Failed to join room';
    const status = message.includes('not found')
      ? 404
      : message.includes('expired') || message.includes('closed') || message.includes('limit')
      ? 403
      : 500;
    res.status(status).json({ success: false, error: message });
  }
});

/**
 * POST /api/rooms/:code/close - Close room (creator authorization required)
 */
router.post('/:code/close', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const creatorToken = (req.headers['x-creator-token'] as string) || req.body?.creatorToken;
    const result = await roomService.closeRoom(code, creatorToken);

    // Broadcast room:closed event to all connected sockets
    broadcastRoomClosed(code);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to close room';
    const status = message.includes('Unauthorized') ? 401 : message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
});

/**
 * POST /api/rooms/:code/extend - Extend room duration (creator only)
 */
router.post('/:code/extend', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const creatorToken = (req.headers['x-creator-token'] as string) || req.body?.creatorToken;
    if (!creatorToken) {
      res.status(401).json({ success: false, error: 'Unauthorized: Creator token required' });
      return;
    }

    const minutes = Number(req.body?.minutes) || 30;
    const result = await roomService.extendRoom(code, minutes, creatorToken);

    // Broadcast room:time_extended event to all connected sockets
    broadcastRoomTimeExtended(code, result.expiresAt);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extend room';
    const status = message.includes('Unauthorized') ? 401 : message.includes('not found') ? 404 : 400;
    res.status(status).json({ success: false, error: message });
  }
});

export const roomRouter = router;
