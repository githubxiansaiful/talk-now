'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocketClient } from '@/lib/socket-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = getSocketClient();
    setSocket(s);

    if (!s.connected) {
      s.connect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    if (s.connected) {
      setIsConnected(true);
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, []);

  return { socket, isConnected };
}
