import { API_VERSION } from '../config';

/**
 * Room Endpoints
 */
export const ROOM_ENDPOINTS = {
  BASE: `${API_VERSION}/rooms`,
  BY_ID: (id) => `${API_VERSION}/rooms/${id}`,
  BULK_CREATE: `${API_VERSION}/rooms/bulk`,
  AVAILABLE: `${API_VERSION}/rooms/available`,
};
