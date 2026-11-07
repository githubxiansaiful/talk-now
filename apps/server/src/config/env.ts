import dotenv from 'dotenv';
import path from 'path';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  WEB_ORIGIN: process.env.WEB_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  SESSION_SECRET: process.env.SESSION_SECRET || 'talknow_default_development_session_secret_32chars',
  IS_PROD: process.env.NODE_ENV === 'production',
  LIVEKIT_URL: process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || '',
  LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY || '',
  LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET || '',
};
