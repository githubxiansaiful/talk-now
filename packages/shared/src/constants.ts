export const ROOM_CONSTANTS = {
  MIN_DISPLAY_NAME_LENGTH: 2,
  MAX_DISPLAY_NAME_LENGTH: 32,
  MIN_ROOM_NAME_LENGTH: 2,
  MAX_ROOM_NAME_LENGTH: 64,
  MAX_MESSAGE_LENGTH: 1000,
  DEFAULT_DURATION_MINUTES: 60,
  DEFAULT_MAX_MEMBERS: 50,
  ABSOLUTE_MAX_MEMBERS: 200,
  TYPING_TIMEOUT_MS: 3000,
  ROOM_CODE_LENGTH: 8,
} as const;

export const ROOM_DURATIONS = [
  { label: '30 minutes', value: 30, description: 'Quick sprint or sync' },
  { label: '1 hour', value: 60, description: 'Standard group meeting (Recommended)' },
  { label: '6 hours', value: 360, description: 'Extended working session' },
  { label: '24 hours', value: 1440, description: 'Full day collaboration' },
] as const;

export type RoomDurationValue = (typeof ROOM_DURATIONS)[number]['value'];
