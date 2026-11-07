import { Router, Request, Response } from 'express';
import { roomService } from './room.service';
import { ZodError } from 'zod';

const router = Router();

/**
 * POST /api/rooms - Create a new room
 */
router.post('/', async (req: Request, res: Response) => {
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
router.post('/:code/join', async (req: Request, res: Response) => {
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

export const roomRouter = router;
