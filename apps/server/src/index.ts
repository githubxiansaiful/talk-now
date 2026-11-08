import http from 'http';
import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { corsOptions } from './config/cors';
import { initializeSocketServer } from './socket';
import { roomRouter } from './modules/rooms/room.controller';
import { startExpiryScheduler } from './jobs/expire-rooms';

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// REST API routes
app.use('/api/rooms', roomRouter);

const httpServer = http.createServer(app);

// Initialize real-time Socket.IO
initializeSocketServer(httpServer);

// Start background room expiry scheduler
startExpiryScheduler(30000);

httpServer.listen(ENV.PORT, () => {
  console.log(`🚀 [TalkNow Server] Running on http://localhost:${ENV.PORT}`);
  console.log(`🔌 [TalkNow Server] Socket.IO ready at http://localhost:${ENV.PORT}`);
  console.log(`🌐 [TalkNow Server] Allowed Web Origin: ${ENV.WEB_ORIGIN}`);
});

export { app, httpServer };
