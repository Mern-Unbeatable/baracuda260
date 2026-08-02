import { useEffect, useRef, useCallback, useState } from 'react';
import { socket } from '../services/socket';

export function useSocket({
  conversationId,
  onMessage,
  onTypingStart,
  onTypingStop,
  onUserOnline,
  onUserOffline,
} = {}) {
  // Refs for callbacks — updated every render, never in deps
  const onMessageRef = useRef(onMessage);
  const onTypingStartRef = useRef(onTypingStart);
  const onTypingStopRef = useRef(onTypingStop);
  const onUserOnlineRef = useRef(onUserOnline);
  const onUserOfflineRef = useRef(onUserOffline);

  onMessageRef.current = onMessage;
  onTypingStartRef.current = onTypingStart;
  onTypingStopRef.current = onTypingStop;
  onUserOnlineRef.current = onUserOnline;
  onUserOfflineRef.current = onUserOffline;

  const [isConnected, setIsConnected] = useState(() => socket.connected);
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    // Read token from localStorage (set by authSlice listener middleware)
    const token = localStorage.getItem('token');
    socket.auth = { token };

    const handleConnect = () => {
      setIsConnected(true);
      setSocketError(null);
      if (conversationId) {
        socket.emit('conversation:join', String(conversationId));
      }
    };

    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = (err) => {
      setIsConnected(false);
      setSocketError(err?.message ?? 'Connection failed');
    };

    const handleMessage = (payload) => onMessageRef.current?.(payload);
    const handleTypingStart = (payload) => onTypingStartRef.current?.(payload);
    const handleTypingStop = (payload) => onTypingStopRef.current?.(payload);
    const handleUserOnline = (payload) => onUserOnlineRef.current?.(payload);
    const handleUserOffline = (payload) => onUserOfflineRef.current?.(payload);

    // Register connect listener BEFORE calling connect (race condition prevention)
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('message:new', handleMessage);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);

    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected — join room immediately
      if (conversationId) {
        socket.emit('conversation:join', String(conversationId));
      }
    }

    return () => {
      if (conversationId) {
        socket.emit('conversation:leave', String(conversationId));
      }
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('message:new', handleMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [conversationId]);

  const sendTyping = useCallback(
    (isTyping) => {
      if (!socket.connected || !conversationId) return;
      socket.emit(isTyping ? 'typing:start' : 'typing:stop', {
        conversationId: String(conversationId),
      });
    },
    [conversationId],
  );

  return {
    sendTyping,
    isConnected,
    socketError,
  };
}
