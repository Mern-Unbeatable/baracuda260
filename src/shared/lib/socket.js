import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/shared/config';

const SOCKET_URL = SOCKET_CONFIG.URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});
