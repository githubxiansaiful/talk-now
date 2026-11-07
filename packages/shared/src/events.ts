export const SOCKET_EVENTS = {
  // Client to Server
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  MESSAGE_SEND: 'message:send',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  ROOM_MEMBERS_REQUEST: 'room:members:request',
  ROOM_CLOSE: 'room:close',
  ROOM_EXTEND: 'room:extend',
  MESSAGE_REACT: 'message:react',

  // Server to Client
  ROOM_JOINED: 'room:joined',
  ROOM_ERROR: 'room:error',
  ROOM_MEMBER_JOINED: 'room:member:joined',
  ROOM_MEMBER_LEFT: 'room:member:left',
  ROOM_MEMBERS: 'room:members',
  MESSAGE_NEW: 'message:new',
  MESSAGE_REJECTED: 'message:rejected',
  MESSAGE_REACTION_UPDATE: 'message:reaction:update',
  TYPING_UPDATE: 'typing:update',
  ROOM_CLOSED: 'room:closed',
  ROOM_EXPIRED: 'room:expired',
  ROOM_TIME_EXTENDED: 'room:time_extended',
  PRESENCE_UPDATE: 'presence:update',
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
