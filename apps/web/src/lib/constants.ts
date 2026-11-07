export * from '@talknow/shared';

export const APP_CONFIG = {
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
