import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/shared/config';

let socketInstance = null;

const getAuthToken = () => {
  const raw =
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    '';
  return String(raw).replace(/^Bearer\s+/i, '').trim();
};

const buildAuthPayload = (token) =>
  token
    ? {
        token,
        accessToken: token,
      }
    : {};

/**
 * Returns an active socket instance, initializing one if not yet created.
 */
export const getSocket = () => {
  const token = getAuthToken();
  const authPayload = buildAuthPayload(token);

  if (socketInstance?.connected) {
    socketInstance.auth = authPayload;
    return socketInstance;
  }

  if (!socketInstance) {
    socketInstance = io(SOCKET_CONFIG.URL, {
      auth: authPayload,
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      transports: ['websocket', 'polling'],
      autoConnect: Boolean(token),
      reconnection: true,
      reconnectionAttempts: 12,
      reconnectionDelay: 1500,
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      // Connected successfully
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Chat Socket] Connect error:', err?.message || err);
    });
  } else {
    socketInstance.auth = authPayload;
    if (token && !socketInstance.connected) {
      socketInstance.connect();
    }
  }

  return socketInstance;
};

/**
 * Join a direct chat room for realtime messages.
 *
 * @param {string} roomId
 */
export const joinChatRoom = (roomId) => {
  if (!roomId) return;
  const socket = getSocket();
  const payload = { roomId: String(roomId) };
  if (socket.connected) {
    socket.emit('join_room', payload);
  } else {
    socket.once('connect', () => {
      socket.emit('join_room', payload);
    });
  }
};

/**
 * Leave a chat room.
 *
 * @param {string} roomId
 */
export const leaveChatRoom = (roomId) => {
  if (!roomId) return;
  const socket = getSocket();
  socket.emit('leave_room', { roomId: String(roomId) });
};

/**
 * Notify peers that the current user is typing in a room.
 *
 * @param {string} roomId
 */
export const emitTyping = (roomId) => {
  if (!roomId) return;
  const socket = getSocket();
  socket.emit('typing', { roomId: String(roomId) });
};

/**
 * Notify peers that the current user stopped typing.
 *
 * @param {string} roomId
 */
export const emitStopTyping = (roomId) => {
  if (!roomId) return;
  const socket = getSocket();
  socket.emit('stop_typing', { roomId: String(roomId) });
};

/**
 * Subscribe to peer typing indicators for the active room.
 *
 * @param {{
 *   onTyping?: (payload: { userId: string, roomId: string }) => void,
 *   onStopTyping?: (payload: { userId: string, roomId: string }) => void,
 * }} handlers
 * @returns {() => void}
 */
export const subscribeToTyping = ({ onTyping, onStopTyping } = {}) => {
  const socket = getSocket();

  const typingHandler = (payload) => {
    if (payload) onTyping?.(payload);
  };
  const stopHandler = (payload) => {
    if (payload) onStopTyping?.(payload);
  };

  if (onTyping) {
    socket.on('user_typing', typingHandler);
    socket.on('typing', typingHandler);
  }
  if (onStopTyping) {
    socket.on('user_stopped_typing', stopHandler);
    socket.on('stop_typing', stopHandler);
  }

  return () => {
    if (onTyping) {
      socket.off('user_typing', typingHandler);
      socket.off('typing', typingHandler);
    }
    if (onStopTyping) {
      socket.off('user_stopped_typing', stopHandler);
      socket.off('stop_typing', stopHandler);
    }
  };
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
    if (payload) callback(payload);
  };

  events.forEach((evt) => socket.on(evt, handler));

  return () => {
    events.forEach((evt) => socket.off(evt, handler));
  };
};

/**
 * Subscribes to online / offline presence updates.
 *
 * @param {{
 *   onOnlineUsers?: (userIds: string[]) => void,
 *   onUserOnline?: (userId: string) => void,
 *   onUserOffline?: (userId: string) => void,
 * }} handlers
 * @returns {() => void}
 */
export const subscribeToPresence = ({
  onOnlineUsers,
  onUserOnline,
  onUserOffline,
} = {}) => {
  const socket = getSocket();

  const onlineUsersHandler = (payload) => {
    const ids = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.userIds)
        ? payload.userIds
        : [];
    onOnlineUsers?.(ids.map(String));
  };

  const userOnlineHandler = (payload) => {
    const userId = payload?.userId || payload?.id || payload;
    if (userId) onUserOnline?.(String(userId));
  };

  const userOfflineHandler = (payload) => {
    const userId = payload?.userId || payload?.id || payload;
    if (userId) onUserOffline?.(String(userId));
  };

  if (onOnlineUsers) socket.on('online_users', onlineUsersHandler);
  if (onUserOnline) socket.on('user_online', userOnlineHandler);
  if (onUserOffline) socket.on('user_offline', userOfflineHandler);

  // Ask server again after (re)connect
  const onConnect = () => {
    socket.emit('get_online_users');
  };
  socket.on('connect', onConnect);
  if (socket.connected) onConnect();

  return () => {
    if (onOnlineUsers) socket.off('online_users', onlineUsersHandler);
    if (onUserOnline) socket.off('user_online', userOnlineHandler);
    if (onUserOffline) socket.off('user_offline', userOfflineHandler);
    socket.off('connect', onConnect);
  };
};

/**
 * Subscribes to real-time message mutations: edits, deletes, and read receipts.
 *
 * @param {{
 *   onEdit?: (payload: any) => void,
 *   onDelete?: (payload: any) => void,
 *   onRead?: (payload: any) => void,
 * }} handlers
 */
export const subscribeToMessageUpdates = ({
  onEdit,
  onDelete,
  onRead,
} = {}) => {
  const socket = getSocket();

  const editEvents = ['message_edited', 'message_updated', 'edit_message'];
  const deleteEvents = ['message_deleted', 'delete_message', 'message_removed'];
  const readEvents = ['messages_read', 'message_read', 'room_read'];

  const editHandler = (data) => onEdit?.(data);
  const deleteHandler = (data) => onDelete?.(data);
  const readHandler = (data) => onRead?.(data);

  if (onEdit) editEvents.forEach((evt) => socket.on(evt, editHandler));
  if (onDelete) deleteEvents.forEach((evt) => socket.on(evt, deleteHandler));
  if (onRead) readEvents.forEach((evt) => socket.on(evt, readHandler));

  return () => {
    if (onEdit) editEvents.forEach((evt) => socket.off(evt, editHandler));
    if (onDelete) deleteEvents.forEach((evt) => socket.off(evt, deleteHandler));
    if (onRead) readEvents.forEach((evt) => socket.off(evt, readHandler));
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
