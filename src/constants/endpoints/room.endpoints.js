import { API_VERSION } from '../config';

/**
 * Room Endpoints
 */
export const ROOM_ENDPOINTS = {
  BASE: `${API_VERSION}/rooms`,
  BY_ID: (id) => `${API_VERSION}/rooms/${id}`,
};
