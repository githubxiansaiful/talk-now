import { CorsOptions } from 'cors';
import { ENV } from './env';

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;

  const normalized = origin.trim().replace(/\/$/, '');
  const webOrigin = (ENV.WEB_ORIGIN || '').trim().replace(/\/$/, '');
  const allowedList = webOrigin
    ? webOrigin.split(',').map((o) => o.trim().replace(/\/$/, ''))
    : [];

  if (
    webOrigin === '*' ||
    allowedList.includes('*') ||
    normalized === 'http://localhost:3000' ||
    normalized === 'http://127.0.0.1:3000' ||
    allowedList.includes(normalized)
  ) {
    return true;
  }

  // Allow Vercel (*.vercel.app) and Cloudflare Pages (*.pages.dev) deployments
  try {
    const url = new URL(origin);
    if (
      url.hostname.endsWith('.vercel.app') ||
      url.hostname.endsWith('.pages.dev') ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'
    ) {
      return true;
    }
  } catch {}

  return false;
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-creator-token',
    'x-session-token',
    'x-room-code',
  ],
  optionsSuccessStatus: 200,
};
