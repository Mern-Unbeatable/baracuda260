import { apiClient } from './client';

export const ADMIN_ALBUM_TYPES_QUERY_KEY = ['admin-album-types'];

export const getAlbumTypesApi = async () => {
  const response = await apiClient.get('/v1/album-types');
  return response?.data ?? [];
};

export const createAlbumTypeApi = async (payload) => {
  // payload: { kind, name, prizeMoney, description, features }
  const response = await apiClient.post('/v1/album-types', payload);
  return response?.data;
};

export const updateAlbumTypeApi = async ({ id, payload }) => {
  // payload: { name, prizeMoney, description, features }
  const response = await apiClient.patch(`/v1/album-types/${id}`, payload);
  return response?.data;
};

export const deleteAlbumTypeApi = async (albumTypeId) => {
  const response = await apiClient.delete(`/v1/album-types/${albumTypeId}`);
  return response?.data;
};
