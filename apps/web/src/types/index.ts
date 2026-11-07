export * from '@talknow/shared';

export interface LocalUserSession {
  displayName: string;
  roomName?: string;
  isCreator: boolean;
  expiresAt: string;
  maxMembers?: number | null;
}
