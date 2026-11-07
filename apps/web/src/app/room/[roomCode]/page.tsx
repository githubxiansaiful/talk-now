import { RoomClient } from './room-client';

interface PageProps {
  params: Promise<{ roomCode: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { roomCode } = await params;
  return <RoomClient roomCode={roomCode} />;
}
