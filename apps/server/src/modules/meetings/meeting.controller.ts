import { Router, Request, Response } from 'express';
import { meetingService } from './meeting.service';
import { roomRepository } from '../rooms/room.repository';
import {
  broadcastMeetingStarted,
  broadcastMeetingEnded,
  broadcastMeetingParticipantJoined,
  broadcastMeetingParticipantLeft,
} from '../../socket';

const router = Router({ mergeParams: true });

/**
 * POST /api/rooms/:code/meetings - Start a meeting
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const sessionToken = (req.headers['x-session-token'] as string) || req.body?.sessionToken;
    if (!sessionToken) {
      res.status(401).json({ success: false, error: 'Session token required' });
      return;
    }

    const { meeting, tokenData } = await meetingService.startMeeting(code, sessionToken);

    // Broadcast meeting:started to all members in the room channel
    broadcastMeetingStarted(code, meeting, tokenData.displayName);

    res.status(201).json({
      success: true,
      data: {
        meeting,
        tokenData,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to start meeting';
    const status = message.includes('Unauthorized')
      ? 401
      : message.includes('not found')
      ? 404
      : 400;
    res.status(status).json({ success: false, error: message });
  }
});

/**
 * GET /api/rooms/:code/meetings/active - Get active meeting for room
 */
router.get('/active', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const meeting = await meetingService.getActiveMeeting(code);

    res.json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get active meeting';
    res.status(400).json({ success: false, error: message });
  }
});

/**
 * POST /api/rooms/:code/meetings/:meetingId/join - Join an active meeting
 */
router.post('/:meetingId/join', async (req: Request, res: Response) => {
  try {
    const { code, meetingId } = req.params;
    const sessionToken = (req.headers['x-session-token'] as string) || req.body?.sessionToken;
    if (!sessionToken) {
      res.status(401).json({ success: false, error: 'Session token required' });
      return;
    }

    const { meeting, tokenData } = await meetingService.joinMeeting(code, meetingId, sessionToken);

    // Broadcast participant joined
    broadcastMeetingParticipantJoined(code, {
      meetingId,
      participant: {
        id: tokenData.participantId,
        meetingId,
        memberId: tokenData.participantId,
        displayName: tokenData.displayName,
        isHost: tokenData.isHost,
        isMuted: false,
        isSpeaking: false,
        joinedAt: new Date().toISOString(),
      },
      participantCount: meeting.participantCount || 1,
    });

    res.json({
      success: true,
      data: {
        meeting,
        tokenData,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join meeting';
    const status = message.includes('Unauthorized')
      ? 401
      : message.includes('not found')
      ? 404
      : 400;
    res.status(status).json({ success: false, error: message });
  }
});

/**
 * POST /api/rooms/:code/meetings/:meetingId/leave - Leave meeting
 */
router.post('/:meetingId/leave', async (req: Request, res: Response) => {
  try {
    const { code, meetingId } = req.params;
    const sessionToken = (req.headers['x-session-token'] as string) || req.body?.sessionToken;
    const memberId = req.body?.memberId;

    let actuallyLeft = false;
    if (sessionToken) {
      actuallyLeft = await meetingService.leaveMeeting(meetingId, sessionToken);
    }

    if (actuallyLeft && memberId) {
      broadcastMeetingParticipantLeft(code, {
        meetingId,
        memberId,
      });
    }

    res.json({ success: true, actuallyLeft });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to leave meeting';
    res.status(400).json({ success: false, error: message });
  }
});

/**
 * POST /api/rooms/:code/meetings/:meetingId/end - End meeting (host or room creator only)
 */
router.post('/:meetingId/end', async (req: Request, res: Response) => {
  try {
    const { code, meetingId } = req.params;
    const sessionToken = (req.headers['x-session-token'] as string) || req.body?.sessionToken;
    const creatorToken = (req.headers['x-creator-token'] as string) || req.body?.creatorToken;

    if (!sessionToken && !creatorToken) {
      res.status(401).json({ success: false, error: 'Authorization required' });
      return;
    }

    const meeting = await meetingService.endMeeting(
      meetingId,
      sessionToken || '',
      creatorToken
    );

    let endedByName: string | undefined;
    if (sessionToken) {
      try {
        const room = await roomRepository.findByCode(code);
        if (room) {
          const member = await roomRepository.verifySession(room.id, sessionToken);
          if (member) endedByName = member.displayName;
        }
      } catch {}
    }

    // Broadcast meeting:ended to room channel
    broadcastMeetingEnded(code, meetingId, endedByName);

    res.json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to end meeting';
    const status = message.includes('Unauthorized') ? 401 : 400;
    res.status(status).json({ success: false, error: message });
  }
});

/**
 * GET /api/rooms/:code/meetings/:meetingId/participants - Get participants
 */
router.get('/:meetingId/participants', async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const participants = await meetingService.getParticipants(meetingId);

    res.json({
      success: true,
      data: participants,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get participants';
    res.status(400).json({ success: false, error: message });
  }
});

export const meetingRouter = router;
