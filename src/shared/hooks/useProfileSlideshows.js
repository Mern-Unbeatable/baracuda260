import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  createSlideshowApi,
  deleteSlideshowApi,
  getSlideshowSourcePhotosApi,
  getSlideshowsApi,
  SLIDESHOWS_QUERY_KEY,
  updateSlideshowApi,
} from '@/shared/api/slideshows.api';
import {
  isSlideshowPlayable,
  SLIDESHOW_MIN_PHOTOS,
  SLIDESHOW_SEARCH_PARAM,
} from '@/shared/data/slideshows';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';

const CLOSED_BUILDER = { open: false, slideshow: null };

/**
 * Slideshows shown on a profile's Artwork tab.
 * @param {{ canManage?: boolean, onCreated?: (slideshow: object) => void }} options
 *   `canManage` is true only on the owner's own profile.
 */
export function useProfileSlideshows({ canManage = false, onCreated } = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const openedInAppRef = useRef(false);
  const [builder, setBuilder] = useState(CLOSED_BUILDER);

  const slideshowsQuery = useQuery({
    queryKey: [...SLIDESHOWS_QUERY_KEY, 'list'],
    queryFn: () => getSlideshowsApi(),
  });

  const sourcePhotosQuery = useQuery({
    queryKey: [...SLIDESHOWS_QUERY_KEY, 'source-photos'],
    queryFn: getSlideshowSourcePhotosApi,
    enabled: canManage,
  });

  const refreshList = () =>
    queryClient.invalidateQueries({
      queryKey: [...SLIDESHOWS_QUERY_KEY, 'list'],
    });

  const createMutation = useMutation({
    mutationFn: createSlideshowApi,
    onSuccess: (created) => {
      toast.success(t('photographerProfile.slideshows.toast.created'));
      setBuilder(CLOSED_BUILDER);
      refreshList();
      onCreated?.(created);
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          t('photographerProfile.slideshows.toast.createError'),
        ),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSlideshowApi,
    onSuccess: () => {
      toast.success(t('photographerProfile.slideshows.toast.updated'));
      setBuilder(CLOSED_BUILDER);
      refreshList();
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          t('photographerProfile.slideshows.toast.updateError'),
        ),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlideshowApi,
    onSuccess: () => {
      toast.success(t('photographerProfile.slideshows.toast.deleted'));
      refreshList();
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          t('photographerProfile.slideshows.toast.deleteError'),
        ),
      );
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const slideshows = slideshowsQuery.data?.items ?? [];
  const visibleSlideshows = canManage
    ? slideshows
    : slideshows.filter(isSlideshowPlayable);
  const sourcePhotos = sourcePhotosQuery.data?.items ?? [];

  const activeId = searchParams.get(SLIDESHOW_SEARCH_PARAM);
  const activeSlideshow = activeId
    ? (slideshows.find(
        (item) => item.id === activeId && isSlideshowPlayable(item),
      ) ?? null)
    : null;

  const openPlayer = useCallback(
    (id) => {
      openedInAppRef.current = true;
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.set(SLIDESHOW_SEARCH_PARAM, id);
        return next;
      });
    },
    [setSearchParams],
  );

  const closePlayer = useCallback(() => {
    // Opened from this page: step back so the browser Back button stays in sync.
    // Opened from a shared link: there is nothing to go back to, so drop the param.
    if (openedInAppRef.current) {
      openedInAppRef.current = false;
      navigate(-1);
      return;
    }
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete(SLIDESHOW_SEARCH_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [navigate, setSearchParams]);

  const openCreate = useCallback(
    () => setBuilder({ open: true, slideshow: null }),
    [],
  );

  const openEdit = useCallback(
    (slideshow) => setBuilder({ open: true, slideshow }),
    [],
  );

  const closeBuilder = useCallback(() => {
    if (isSaving) return;
    setBuilder(CLOSED_BUILDER);
  }, [isSaving]);

  const submitBuilder = useCallback(
    (values) => {
      if (builder.slideshow) {
        updateMutation.mutate({ id: builder.slideshow.id, payload: values });
      } else {
        createMutation.mutate(values);
      }
    },
    [builder.slideshow, createMutation, updateMutation],
  );

  const deleteSlideshow = useCallback(
    async (slideshow) => {
      const confirmed = await confirmDestructiveAction({
        title: t('photographerProfile.slideshows.confirmDelete.title'),
        text: t('photographerProfile.slideshows.confirmDelete.text', {
          title: slideshow.title,
        }),
        confirmButtonText: t(
          'photographerProfile.slideshows.confirmDelete.confirm',
        ),
        cancelButtonText: t(
          'photographerProfile.slideshows.confirmDelete.cancel',
        ),
      });
      if (confirmed) deleteMutation.mutate(slideshow.id);
    },
    [deleteMutation, t],
  );

  return {
    slideshows: visibleSlideshows,
    isLoading: slideshowsQuery.isPending,
    isError: slideshowsQuery.isError,
    refetch: slideshowsQuery.refetch,

    sourcePhotos,
    sourcePhotosLoading: sourcePhotosQuery.isPending,
    sourcePhotosError: sourcePhotosQuery.isError,
    refetchSourcePhotos: sourcePhotosQuery.refetch,
    canCreate: sourcePhotos.length >= SLIDESHOW_MIN_PHOTOS,

    builder,
    isSaving,
    openCreate,
    openEdit,
    closeBuilder,
    submitBuilder,

    deletingId: deleteMutation.isPending ? deleteMutation.variables : null,
    deleteSlideshow,

    activeSlideshow,
    openPlayer,
    closePlayer,
  };
}
