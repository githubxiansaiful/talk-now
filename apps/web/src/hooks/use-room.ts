'use client';

import { useState } from 'react';
import { Room } from '@talknow/shared';

export function useRoom(initialRoom?: Room) {
  const [room, setRoom] = useState<Room | null>(initialRoom || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    room,
    setRoom,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
}
