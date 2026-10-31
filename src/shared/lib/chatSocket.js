import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/shared/config';

let socketInstance = null;

/**
 * Returns an active socket instance, initializing one if not yet created.
 */
export const getSocket = () => {
  if (socketInstance?.connected) return socketInstance;

  const token = localStorage.getItem('token');
  const authPayload = token
    ? {
        token: `Bearer ${token}`,
        accessToken: token,
      }
    : {};

  if (!socketInstance) {
    socketInstance = io(SOCKET_CONFIG.URL, {
      auth: authPayload,
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    socketInstance.on('connect', () => {
      // Connected successfully
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Chat Socket] Connect error:', err?.message || err);
    });
  } else if (!socketInstance.connected) {
    socketInstance.auth = authPayload;
    socketInstance.connect();
  }

  return socketInstance;
};

/**
 * Join a direct or group room for realtime messages.
 * Emits common room-join event variants used across socket.io backends.
 *
 * @param {string} roomId
 */
export const joinChatRoom = (roomId) => {
  if (!roomId) return;
  const socket = getSocket();
  socket.emit('join_room', { roomId });
  socket.emit('joinRoom', roomId);
  socket.emit('join', roomId);
};

/**
 * Leave a chat room.
 *
 * @param {string} roomId
 */
export const leaveChatRoom = (roomId) => {
  if (!roomId) return;
  const socket = getSocket();
  socket.emit('leave_room', { roomId });
  socket.emit('leaveRoom', roomId);
  socket.emit('leave', roomId);
};

/**
 * Subscribes to incoming chat messages across common event names.
 *
 * @param {(message: any) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const subscribeToIncomingMessages = (callback) => {
  const socket = getSocket();
  const events = [
    'message',
    'new_message',
    'newMessage',
    'receive_message',
    'chat_message',
    'message_received',
  ];

  const handler = (payload) => {
    if (payload) {
      callback(payload);
    }
  };

  events.forEach((evt) => socket.on(evt, handler));

  return () => {
    events.forEach((evt) => socket.off(evt, handler));
  };
};

/**
 * Disconnect socket and reset instance.
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
