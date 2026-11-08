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
    normalized === 'http://localhost:3000' ||
    normalized === 'http://127.0.0.1:3000' ||
    allowedList.includes(normalized)
  ) {
    return true;
  }

  // Allow Cloudflare Pages deployments (*.pages.dev)
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith('.pages.dev')) {
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
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
