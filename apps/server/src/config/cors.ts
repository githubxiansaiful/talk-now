import { CorsOptions } from 'cors';
import { ENV } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching origin
    if (!origin || origin === ENV.WEB_ORIGIN || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
