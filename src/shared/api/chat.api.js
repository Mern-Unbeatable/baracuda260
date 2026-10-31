import { apiClient } from './client';

export const CHAT_LIST_QUERY_KEY = ['chat-list'];
export const CHAT_MESSAGES_QUERY_KEY = (roomId) => ['chat-messages', roomId];

/**
 * Fetch user's chat rooms / conversations list.
 * Endpoint: GET /v1/chat/list?search=
 *
 * @param {{ search?: string }} [params]
 * @returns {Promise<Array<{
 *   roomId: string,
 *   user: {
 *     id: string,
 *     name: string,
 *     username: string,
 *     avatar: string | null,
 *     isOnline: boolean,
 *   },
 *   lastMessage: {
 *     content?: string,
 *     createdAt?: string,
 *   } | null,
 *   updatedAt: string,
 * }>>}
 */
export const getChatListApi = async ({ search = '' } = {}) => {
  const params = {};
  if (search?.trim()) {
    params.search = search.trim();
  }
  const response = await apiClient.get('/v1/chat/list', { params });
  const data = response?.data !== undefined ? response.data : response;
  return Array.isArray(data) ? data : [];
};

/**
 * Create or get an existing direct chat room with target user.
 * Endpoint: POST /v1/chat/room
 *
 * @param {{ targetUserId: string }} payload
 * @returns {Promise<{
 *   id: string,
 *   createdAt: string,
 *   updatedAt: string,
 *   participants: Array<{
 *     id: string,
 *     roomId: string,
 *     userId: string,
 *     user: {
 *       id: string,
 *       name: string,
 *       username: string,
 *       avatar: string | null,
 *       isOnline: boolean,
 *     }
 *   }>
 * }>}
 */
export const createOrGetChatRoomApi = async ({ targetUserId }) => {
  if (!targetUserId) throw new Error('Target user ID is required');

  const response = await apiClient.post('/v1/chat/room', {
    targetUserId,
  });
  return response?.data !== undefined ? response.data : response;
};

/**
 * Fetch messages for a specific chat room.
 * Endpoint: GET /v1/chat/:roomId/messages?page=1&limit=50
 *
 * @param {{ roomId: string, page?: number, limit?: number }} params
 * @returns {Promise<{
 *   messages: Array<{
 *     id: string,
 *     roomId: string,
 *     senderId: string,
 *     content: string,
 *     fileUrl: string | null,
 *     fileType: string | null,
 *     fileName: string | null,
 *     isRead: boolean,
 *     isEdited: boolean,
 *     isDeleted: boolean,
 *     createdAt: string,
 *     updatedAt: string,
 *     sender: {
 *       id: string,
 *       name: string,
 *       username: string,
 *       avatar: string | null,
 *     }
 *   }>,
 *   total: number,
 *   page: number,
 *   limit: number,
 * }>}
 */
export const getChatMessagesApi = async ({ roomId, page = 1, limit = 50 }) => {
  if (!roomId) throw new Error('Room ID is required');

  const response = await apiClient.get(
    `/v1/chat/${encodeURIComponent(roomId)}/messages`,
    {
      params: { page, limit },
    },
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Send a message (with optional file attachment) in a chat room.
 * Endpoint: POST /v1/chat/:roomId/messages (multipart/form-data)
 *
 * @param {{
 *   roomId: string,
 *   content?: string,
 *   file?: File | Blob,
 * }} payload
 */
export const sendChatMessageApi = async ({ roomId, content, file }) => {
  if (!roomId) throw new Error('Room ID is required');
  if (!content?.trim() && !file) {
    throw new Error('Message content or file is required');
  }

  const formData = new FormData();
  if (content?.trim()) {
    formData.append('content', content.trim());
  }
  if (file) {
    formData.append('file', file);
  }

  const response = await apiClient.post(
    `/v1/chat/${encodeURIComponent(roomId)}/messages`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Edit a chat message.
 * Endpoint: PUT /v1/chat/messages/:messageId
 *
 * @param {{ messageId: string, content: string }} payload
 */
export const editChatMessageApi = async ({ messageId, content }) => {
  if (!messageId) throw new Error('Message ID is required');
  if (!content?.trim()) throw new Error('Message content is required');

  const response = await apiClient.put(
    `/v1/chat/messages/${encodeURIComponent(messageId)}`,
    {
      content: content.trim(),
    },
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Delete a chat message.
 * Endpoint: DELETE /v1/chat/messages/:messageId
 *
 * @param {{ messageId: string }} payload
 */
export const deleteChatMessageApi = async ({ messageId }) => {
  if (!messageId) throw new Error('Message ID is required');

  const response = await apiClient.delete(
    `/v1/chat/messages/${encodeURIComponent(messageId)}`,
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Mark messages in a chat room as read.
 * Endpoint: PUT /v1/chat/:roomId/read
 *
 * @param {{ roomId: string }} payload
 */
export const markChatRoomAsReadApi = async ({ roomId }) => {
  if (!roomId) throw new Error('Room ID is required');

  const response = await apiClient.put(
    `/v1/chat/${encodeURIComponent(roomId)}/read`,
  );
  return response?.data !== undefined ? response.data : response;
};
