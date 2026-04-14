import { io } from 'socket.io-client';
import { API_BASE_URL } from '@constants/config';

const DEFAULT_SOCKET_URL = 'http://localhost:3001';

let appSocket = null;
let currentToken = null;

const resolveSocketUrl = () => {
  const envSocketUrl = import.meta.env.VITE_SOCKET_URL;

  if (envSocketUrl) {
    return envSocketUrl;
  }

  if (!API_BASE_URL) {
    return DEFAULT_SOCKET_URL;
  }

  try {
    const parsedApiUrl = new URL(API_BASE_URL);

    if (parsedApiUrl.port === '3000') {
      parsedApiUrl.port = '3001';
    }

    return `${parsedApiUrl.protocol}//${parsedApiUrl.host}`;
  } catch (error) {
    return DEFAULT_SOCKET_URL;
  }
};

export const connectAppSocket = (accessToken) => {
  if (!accessToken) {
    return null;
  }

  const nextToken = String(accessToken);

  if (appSocket) {
    if (currentToken !== nextToken) {
      currentToken = nextToken;
      appSocket.auth = { token: nextToken };

      if (appSocket.connected) {
        appSocket.disconnect();
      }

      appSocket.connect();
    }

    return appSocket;
  }

  const socketUrl = resolveSocketUrl();

  appSocket = io(socketUrl, {
    auth: { token: nextToken },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  currentToken = nextToken;
  return appSocket;
};

export const disconnectAppSocket = () => {
  if (!appSocket) {
    return;
  }

  appSocket.disconnect();
  appSocket = null;
  currentToken = null;
};

export const getAppSocket = () => appSocket;

export const isAppSocketConnected = () => Boolean(appSocket?.connected);

export const subscribeSocketEvent = (eventName, handler) => {
  if (!appSocket || !eventName || typeof handler !== 'function') {
    return () => {};
  }

  appSocket.on(eventName, handler);

  return () => {
    appSocket?.off(eventName, handler);
  };
};

export const emitSocketEvent = (eventName, payload) => {
  if (!appSocket || !appSocket.connected) {
    return false;
  }

  appSocket.emit(eventName, payload);
  return true;
};
