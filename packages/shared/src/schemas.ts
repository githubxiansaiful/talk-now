import { z } from 'zod';
import { ROOM_CONSTANTS, ROOM_DURATIONS } from './constants';

export const createRoomSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(ROOM_CONSTANTS.MIN_DISPLAY_NAME_LENGTH, `Display name must be at least ${ROOM_CONSTANTS.MIN_DISPLAY_NAME_LENGTH} characters`)
    .max(ROOM_CONSTANTS.MAX_DISPLAY_NAME_LENGTH, `Display name cannot exceed ${ROOM_CONSTANTS.MAX_DISPLAY_NAME_LENGTH} characters`),
  roomName: z
    .string()
    .trim()
    .max(ROOM_CONSTANTS.MAX_ROOM_NAME_LENGTH, `Room name cannot exceed ${ROOM_CONSTANTS.MAX_ROOM_NAME_LENGTH} characters`)
    .optional()
    .or(z.literal('')),
  durationMinutes: z
    .number()
    .refine((val) => ROOM_DURATIONS.some((d) => d.value === val), {
      message: 'Invalid room duration selected',
    }),
  maxMembers: z
    .number()
    .int()
    .min(2, 'Minimum 2 members required')
    .max(ROOM_CONSTANTS.ABSOLUTE_MAX_MEMBERS, `Maximum members cannot exceed ${ROOM_CONSTANTS.ABSOLUTE_MAX_MEMBERS}`)
    .optional(),
});

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .min(4, 'Room code is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Room code contains invalid characters'),
  displayName: z
    .string()
    .trim()
    .min(ROOM_CONSTANTS.MIN_DISPLAY_NAME_LENGTH, `Display name must be at least ${ROOM_CONSTANTS.MIN_DISPLAY_NAME_LENGTH} characters`)
    .max(ROOM_CONSTANTS.MAX_DISPLAY_NAME_LENGTH, `Display name cannot exceed ${ROOM_CONSTANTS.MAX_DISPLAY_NAME_LENGTH} characters`),
});

export const sendMessageSchema = z.object({
  roomId: z.string().uuid().or(z.string().min(1)),
  content: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(ROOM_CONSTANTS.MAX_MESSAGE_LENGTH, `Message cannot exceed ${ROOM_CONSTANTS.MAX_MESSAGE_LENGTH} characters`),
});

export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>;
export type JoinRoomSchemaType = z.infer<typeof joinRoomSchema>;
export type SendMessageSchemaType = z.infer<typeof sendMessageSchema>;
