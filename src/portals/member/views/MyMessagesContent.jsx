import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowUpFromLine,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberMessageCard from '@/components/data-display/MemberMessageCard/MemberMessageCard';
import Button from '@/components/ui/Button';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  deletePostApi,
  getPostsApi,
  updatePostApi,
  USER_POSTS_QUERY_KEY,
} from '@/shared/api/posts.api';
import { ROUTES } from '@/shared/config';

const PAGE_SIZE = 9;

const EditPostModal = memo(({ open, post, onSave, onCancel, isSaving }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [copyrightOk, setCopyrightOk] = useState(true);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (post) {
      setBody(post.body || '');
      setSelectedFile(null);
      setCopyrightOk(true);
      setValidationError('');
    }
  }, [post]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSaving) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isSaving, onCancel]);

  if (!open || !post) return null;

  const currentMediaUrl = post.mediaUrl || post.image;
  const isOriginalVideo = post.mediaType === 'VIDEO';

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRevertFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setValidationError(
        t('myMessages.upload.errors.messageRequired', 'Please enter a message.'),
      );
      return;
    }
    if (!copyrightOk) {
      setValidationError(
        t(
          'myMessages.upload.errors.copyrightRequired',
          'Please confirm the copyright statement.',
        ),
      );
      return;
    }

    setValidationError('');
    onSave({
      postId: post.id,
      body: body.trim(),
      copyrightConfirmed: 'true',
      media: selectedFile || undefined,
    });
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={isSaving ? undefined : onCancel}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all my-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#ecedfa] text-[#4048cd]">
              <Pencil size={18} strokeWidth={2} />
            </span>
            <h3
              id="edit-post-title"
              className="text-lg font-semibold text-[#161c27]"
            >
              {t('myMessages.editModal.title', 'Edit Post')}
            </h3>
          </div>
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Message body */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-message-body"
              className="text-[14px] font-medium text-[#494453]"
            >
              {t('myMessages.upload.messageLabel', 'Message')}
            </label>
            <textarea
              id="edit-message-body"
              rows={4}
              disabled={isSaving}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder={t('myMessages.upload.messagePlaceholder')}
              className="min-h-28 w-full resize-y rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#fafaff] px-4 py-3 text-[15px] leading-6 text-[#161c27] outline-none focus:ring-2 focus:ring-[#4048cd]/30 disabled:opacity-60"
            />
          </div>

          {/* Media preview and change */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium text-[#494453]">
              {t('myMessages.editModal.mediaLabel', 'Media')}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4"
              className="sr-only"
              disabled={isSaving}
              onChange={handleFileChange}
            />

            {selectedFile && previewUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-[#4048cd]/30 bg-[#f4f4fe] p-3">
                <div className="flex items-center gap-3">
                  {selectedFile.type.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt="New preview"
                      className="size-16 rounded-lg object-cover"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      className="size-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-[#4048cd]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#4048cd]">
                      New File
                    </span>
                    <p className="truncate text-sm font-medium text-[#161c27]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    unstyled
                    type="button"
                    disabled={isSaving}
                    onClick={handleRevertFile}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
                    title={t('myMessages.editModal.keepMedia', 'Keep current media')}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ) : currentMediaUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-[#fafaff] p-3">
                <div className="flex items-center gap-3">
                  {isOriginalVideo ? (
                    <video
                      src={currentMediaUrl}
                      className="size-16 rounded-lg object-cover bg-black"
                    />
                  ) : (
                    <img
                      src={currentMediaUrl}
                      alt="Current"
                      className="size-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-600">
                      Current Media
                    </span>
                    <p className="truncate text-xs text-[#6b7280]">
                      Will remain unchanged unless replaced
                    </p>
                  </div>
                  <Button
                    unstyled
                    type="button"
                    disabled={isSaving}
                    onClick={handlePickFile}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ArrowUpFromLine size={13} />
                    {t('myMessages.editModal.replaceMedia', 'Replace')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                unstyled
                type="button"
                disabled={isSaving}
                onClick={handlePickFile}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#cbc3d5] bg-[#fafaff] py-6 text-sm text-[#494453] hover:border-[#4048cd]/40"
              >
                <ArrowUpFromLine size={18} />
                <span>Upload photo/video</span>
              </Button>
            )}
          </div>

          {/* Copyright confirmation */}
          <div>
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={copyrightOk}
                disabled={isSaving}
                onChange={(e) => setCopyrightOk(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-[#ee1c25]"
              />
              <span className="text-[13px] leading-5 text-[#494453]">
                {t('myMessages.upload.copyrightConfirm')}
              </span>
            </label>
          </div>

          {validationError ? (
            <p className="text-sm text-red-600" role="alert">
              {validationError}
            </p>
          ) : null}

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <Button
              unstyled
              type="button"
              disabled={isSaving}
              onClick={onCancel}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              unstyled
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm hover:bg-[#d41921] disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('myMessages.editModal.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {t('myMessages.editModal.save', 'Save Changes')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
});

EditPostModal.displayName = 'EditPostModal';

const DeleteConfirmModal = memo(({ open, post, onConfirm, onCancel, isDeleting }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isDeleting, onCancel]);

  if (!open || !post) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={isDeleting ? undefined : onCancel}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3 text-[#dc2626]">
            <span className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={20} strokeWidth={2} />
            </span>
            <h3
              id="delete-post-title"
              className="text-lg font-semibold text-[#161c27]"
            >
              {t('myMessages.deleteModal.title', 'Delete Post')}
            </h3>
          </div>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-[14px] leading-6 text-[#494453]">
          {t(
            'myMessages.deleteModal.message',
            'Are you sure you want to delete this post? This action cannot be undone.',
          )}
        </p>

        {post.body ? (
          <div className="mt-3 line-clamp-2 rounded-lg bg-gray-50 p-3 text-[13px] text-gray-600 italic">
            &ldquo;{post.body}&rdquo;
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            unstyled
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            unstyled
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(post.id)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#dc2626] px-4 py-2.5 text-[14px] font-medium text-white shadow-sm hover:bg-[#b91c1c] disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {t('myMessages.deleteModal.confirm', 'Delete')}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
});

DeleteConfirmModal.displayName = 'DeleteConfirmModal';

const MyMessagesContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);

  const {
    data: postsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: USER_POSTS_QUERY_KEY({ page: currentPage, limit: PAGE_SIZE }),
    queryFn: () => getPostsApi({ page: currentPage, limit: PAGE_SIZE }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePostApi(id),
    onSuccess: () => {
      toast.success(t('myMessages.deleteSuccess', 'Post deleted successfully!'));
      setPostToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(err, t('myMessages.deleteError', 'Failed to delete post.')),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => updatePostApi(payload),
    onSuccess: () => {
      toast.success(
        t('myMessages.editModal.success', 'Post updated successfully!'),
      );
      setPostToEdit(null);
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('myMessages.editModal.error', 'Failed to update post.'),
        ),
      );
    },
  });

  const handleEditClick = useCallback((post) => {
    setPostToEdit(post);
  }, []);

  const handleDeleteClick = useCallback((post) => {
    setPostToDelete(post);
  }, []);

  const handleConfirmDelete = useCallback(
    (id) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const handleCancelDelete = useCallback(() => {
    if (!deleteMutation.isPending) {
      setPostToDelete(null);
    }
  }, [deleteMutation.isPending]);

  const handleSaveEdit = useCallback(
    (payload) => {
      updateMutation.mutate(payload);
    },
    [updateMutation],
  );

  const handleCancelEdit = useCallback(() => {
    if (!updateMutation.isPending) {
      setPostToEdit(null);
    }
  }, [updateMutation.isPending]);

  const posts = postsData?.items || [];
  const totalPages = postsData?.meta?.totalPages || 1;

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
              {t('myMessages.title')}
            </h1>
            {isFetching && !isLoading ? (
              <RefreshCw
                size={16}
                className="animate-spin text-[#9ca3af]"
                aria-label="Updating"
              />
            ) : null}
          </div>
          <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myMessages.subtitle')}
          </p>
        </div>
        <Link
          to={ROUTES.USER_NEWS_MESSAGES_UPLOAD}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[16px] leading-6 text-white shadow-sm transition hover:bg-[#d41921]"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          {t('myMessages.uploadCta')}
        </Link>
      </header>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white/50 p-12 text-center">
          <RefreshCw className="size-8 animate-spin text-[#ee1c25]" />
          <p className="text-[15px] font-medium text-[#494453]">
            {t('common.loading', 'Loading posts...')}
          </p>
        </div>
      ) : isError ? (
        /* Error state */
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
          <AlertCircle className="size-10 text-red-500" />
          <div className="max-w-md">
            <h3 className="text-base font-semibold text-gray-900">
              {t('myMessages.errorTitle', 'Unable to load posts')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {getApiErrorMessage(error, t('myMessages.errorMessage', 'Something went wrong while fetching posts.'))}
            </p>
          </div>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ee1c25] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#d41921]"
          >
            <RefreshCw size={14} />
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : posts.length === 0 ? (
        /* Empty state */
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#cbc3d5] bg-white p-12 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#fafaff] text-[#4048cd]">
            <MessageSquare size={26} strokeWidth={1.8} />
          </span>
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-[#161c27]">
              {t('myMessages.emptyTitle', 'No posts published yet')}
            </h3>
            <p className="mt-1.5 text-sm text-[#494453]">
              {t(
                'myMessages.emptySubtitle',
                'Share your latest creative work, behind-the-scenes stories, or expedition updates with the community.',
              )}
            </p>
          </div>
          <Link
            to={ROUTES.USER_NEWS_MESSAGES_UPLOAD}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#d41921]"
          >
            <Plus size={16} />
            {t('myMessages.uploadCta')}
          </Link>
        </div>
      ) : (
        /* Posts grid */
        <section
          aria-label={t('myMessages.gridAria')}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {posts.map((post) => (
            <MemberMessageCard
              key={post.id}
              message={post}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === post.id}
            />
          ))}
        </section>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 ? (
        <footer className="flex flex-col items-center gap-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            ariaLabel={t('myMessages.paginationAria')}
          />
        </footer>
      ) : null}

      {/* Edit modal */}
      <EditPostModal
        open={Boolean(postToEdit)}
        post={postToEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isSaving={updateMutation.isPending}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={Boolean(postToDelete)}
        post={postToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
});

MyMessagesContent.displayName = 'MyMessagesContent';

export default MyMessagesContent;
