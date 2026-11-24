import { apiClient } from './client';

export const ADMIN_BUSINESS_LINKS_QUERY_KEY = ['admin-business-links'];

export const getAdminBusinessLinksApi = async ({ page, limit }) => {
  const response = await apiClient.get('/v1/business-links/admin', {
    params: { page, limit },
  });
  const meta = response?.data?.meta;
  return {
    items: response?.data?.data ?? [],
    meta: {
      page: meta?.currentPage ?? page,
      totalPages: meta?.totalPages ?? 1,
      total: meta?.totalRecords ?? 0,
      hasNext: Boolean(meta?.hasNext),
      hasPrevious: Boolean(meta?.hasPrevious),
    },
  };
};

export const getAdminBusinessLinkApi = async (businessAlbumId) => {
  const response = await apiClient.get(
    `/v1/business-links/admin/${businessAlbumId}`,
  );
  return response?.data ?? null;
};

/**
 * Delete a business album (admin).
 * DELETE /v1/business-links/admin/:id
 */
export const deleteAdminBusinessLinkApi = async (businessAlbumId) => {
  if (!businessAlbumId) return null;
  const response = await apiClient.delete(
    `/v1/business-links/admin/${encodeURIComponent(businessAlbumId)}`,
  );
  return response?.data ?? response ?? null;
};

export const PUBLIC_BUSINESS_LINK_QUERY_KEY = ['public-business-link'];

/**
 * Public share view by album code (ALB-xxxxx).
 * GET /v1/business-links/public/:albumId
 */
export const getPublicBusinessLinkApi = async (albumId) => {
  if (!albumId) return null;
  const response = await apiClient.get(
    `/v1/business-links/public/${encodeURIComponent(albumId)}`,
  );
  return response?.data ?? null;
};

/**
 * Submit a business link portfolio.
 * POST /api/v1/business-links
 * Payload (multipart/form-data):
 * - kind: 'TWELVE' | 'SIX' | 'SINGLE'
 * - title: string
 * - story: string
 * - categoryId?: string
 * - subcategoryId?: string
 * - isAiGenerated: 'true' | 'false'
 * - copyrightConfirmed: 'true'
 * - images: File[] (appended multiple times)
 *
 * @param {FormData | {
 *   kind: 'TWELVE' | 'SIX' | 'SINGLE',
 *   title: string,
 *   story: string,
 *   categoryId?: string,
 *   subcategoryId?: string,
 *   isAiGenerated?: boolean | string,
 *   copyrightConfirmed?: boolean | string,
 *   images: File[] | File,
 * }} input
 */
export const createBusinessLinkApi = async (input) => {
  let formData;
  if (input instanceof FormData) {
    formData = input;
  } else {
    formData = new FormData();
    if (input.kind) {
      formData.append('kind', input.kind);
    }
    if (input.title) {
      formData.append('title', input.title);
    }
    if (input.story) {
      formData.append('story', input.story);
    }
    if (input.categoryId) {
      formData.append('categoryId', input.categoryId);
    }
    if (input.subcategoryId) {
      formData.append('subcategoryId', input.subcategoryId);
    }
    formData.append(
      'isAiGenerated',
      String(input.isAiGenerated !== undefined ? input.isAiGenerated : false),
    );
    formData.append(
      'copyrightConfirmed',
      String(
        input.copyrightConfirmed !== undefined
          ? input.copyrightConfirmed
          : true,
      ),
    );

    if (Array.isArray(input.images)) {
      input.images.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append('images', file);
        }
      });
    } else if (input.images instanceof File || input.images instanceof Blob) {
      formData.append('images', input.images);
    }
  }

  const response = await apiClient.post('/v1/business-links', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response?.data ?? response;
};

