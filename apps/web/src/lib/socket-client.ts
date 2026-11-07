import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from './constants';

let socket: Socket | null = null;

export function getSocketClient(): Socket {
  if (!socket) {
    socket = io(APP_CONFIG.SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
