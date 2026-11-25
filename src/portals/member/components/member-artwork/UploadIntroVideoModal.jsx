import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Film, Loader2, Upload, Video, X } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  createArtworkVideoCommentApi,
  updateArtworkVideoCommentApi,
  USER_ARTWORKS_QUERY_KEY,
  VIDEO_COMMENTS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import { USER_PROFILE_ME_QUERY_KEY } from '@/shared/api/userProfile.api';
import { resolveMediaUrl } from '@/shared/utils/media';

const MAX_VIDEO_SECONDS = 65; // 60 seconds with 5-second buffer

const UploadIntroVideoModal = memo(({ isOpen, onClose, onSuccess, editingVideo = null }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(editingVideo?.id);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [duration, setDuration] = useState(null);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Clean up object URL when modal closes or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset / hydrate state when opening
  useEffect(() => {
    if (!isOpen) return;

    setFile(null);
    setError('');
    setIsDragOver(false);

    if (editingVideo?.id) {
      const existingStory = (editingVideo.story || '').trim();
      const defaultStory =
        'Sharing a quick 1-minute message about my upcoming photo series and thanking my supporters!';
      setTitle(editingVideo.title || '');
      setStory(existingStory === defaultStory ? '' : existingStory);
      setPreviewUrl(
        resolveMediaUrl(editingVideo.videoUrl || editingVideo.thumbnailUrl) ||
          null,
      );
      setDuration(
        editingVideo.duration != null ? Number(editingVideo.duration) : null,
      );
    } else {
      setPreviewUrl(null);
      setDuration(null);
      setTitle('');
      setStory('');
    }
  }, [isOpen, editingVideo]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('video/')) {
      setError(t('introVideo.errorNotVideo', 'Please select a valid video file (.mp4, .webm, .mov).'));
      return;
    }

    // 100MB max file size
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError(t('introVideo.errorSize', 'Video file size must be less than 100MB.'));
      return;
    }

    setError('');
    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Measure video duration
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration);
      setDuration(dur);
      if (dur > MAX_VIDEO_SECONDS) {
        setError(
          t(
            'introVideo.errorTooLong',
            `Video duration is ${formatDuration(dur)}. Introduction videos must be 1 minute or less (60s). Please trim your video.`,
          ),
        );
      } else {
        setError('');
      }
    };
    tempVideo.onerror = () => {
      setDuration(null);
    };
    tempVideo.src = objectUrl;
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title.trim() || '1-Minute Video Update',
        story: story.trim(),
        isAiGenerated: false,
        video: file || undefined,
      };

      if (isEditMode) {
        return await updateArtworkVideoCommentApi(editingVideo.id, payload);
      }

      return await createArtworkVideoCommentApi({
        ...payload,
        video: file,
      });
    },
    onSuccess: (data) => {
      toast.success(
        isEditMode
          ? t('introVideo.updateSuccess', '1-minute video updated successfully!')
          : t('introVideo.uploadSuccess', '1-minute video uploaded successfully!'),
      );
      // Invalidate queries so Profile (standaloneVideos) and My Artwork update immediately
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_ME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VIDEO_COMMENTS_QUERY_KEY });

      onSuccess?.(data);
      onClose();
    },
    onError: (err) => {
      // If backend returns an error or is offline in mock mode, provide graceful feedback
      const msg = err?.response?.data?.message || err?.message || 'Failed to upload video.';
      toast.error(msg);
      setError(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditMode && !file) {
      setError(t('introVideo.errorNoFile', 'Please select a video file to upload.'));
      return;
    }
    if (file && duration && duration > MAX_VIDEO_SECONDS) {
      setError(
        t(
          'introVideo.errorTooLong',
          `Video duration is ${formatDuration(duration)}. Introduction videos must be 1 minute or less (60s).`,
        ),
      );
      return;
    }
    uploadMutation.mutate();
  };

  if (!isOpen) return null;

  const isDurationValid =
    duration === null || duration <= MAX_VIDEO_SECONDS || (!file && isEditMode);
  const isTooLong = Boolean(file) && duration !== null && duration > MAX_VIDEO_SECONDS;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-intro-video-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4048cd]">
              <Video size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2
                id="upload-intro-video-title"
                className="text-lg font-bold text-[#111827]"
              >
                {isEditMode
                  ? t('introVideo.editModalTitle', 'Edit 1-Minute Video Update')
                  : t('introVideo.modalTitle', 'Upload 1-Minute Introduction Video')}
              </h2>
              <p className="text-xs text-[#6b7280]">
                {isEditMode
                  ? t(
                      'introVideo.editModalSubtitle',
                      'Update the title, description, or replace the video file',
                    )
                  : t(
                      'introVideo.modalSubtitle',
                      'Introduce yourself and your work directly on your profile',
                    )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5"
            style={{ maxHeight: 'calc(100vh - 2rem - 9.5rem)' }}
          >
          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) handleFileSelect(dropped);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
              isDragOver
                ? 'border-[#4048cd] bg-indigo-50/50'
                : file
                ? 'border-green-300 bg-green-50/20'
                : 'border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
              onChange={(e) => {
                const picked = e.target.files?.[0];
                if (picked) handleFileSelect(picked);
              }}
            />

            {previewUrl ? (
              <div className="w-full flex flex-col items-center gap-3">
                <video
                  src={previewUrl}
                  controls
                  className="max-h-48 w-full rounded-lg bg-black object-contain shadow-xs"
                />
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                  {file?.name ? (
                    <span className="font-semibold text-gray-700 truncate max-w-xs">
                      {file.name}
                    </span>
                  ) : isEditMode ? (
                    <span className="font-semibold text-gray-700">
                      {t('introVideo.currentVideo', 'Current video')}
                    </span>
                  ) : null}
                  {duration !== null && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium ${
                        isDurationValid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isDurationValid ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}
                      {formatDuration(duration)} / 1:00 min
                    </span>
                  )}
                  {file ? (
                    <span className="text-gray-400">
                      ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-gray-400 hover:text-gray-600 underline">
                  {isEditMode
                    ? t(
                        'introVideo.replaceVideoOptional',
                        'Click to replace video (optional)',
                      )
                    : t('introVideo.changeVideo', 'Click to choose another video')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-xs border border-gray-100 text-[#4048cd]">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {t('introVideo.dragDropTitle', 'Drag and drop your video here')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('introVideo.dragDropHint', 'MP4, WebM, or MOV up to 100MB • Maximum 1 minute (60s)')}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition"
                >
                  <Film size={14} />
                  {t('introVideo.browseFiles', 'Browse Files')}
                </button>
              </div>
            )}
          </div>

          {/* Error / Validation Message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div className="mt-4">
            <label
              htmlFor="intro-video-title"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              {t('introVideo.videoTitleLabel', 'Video Title')}
            </label>
            <input
              id="intro-video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('introVideo.videoTitlePlaceholder', 'e.g. My Studio & Artwork Update')}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-[#4048cd] focus:outline-hidden focus:ring-2 focus:ring-[#4048cd]/20"
            />
          </div>

          {/* Story / Description input */}
          <div className="mt-3">
            <label
              htmlFor="intro-video-story"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              {t('introVideo.videoStoryLabel', 'Description / Message (optional)')}
            </label>
            <textarea
              id="intro-video-story"
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={t(
                'introVideo.videoStoryPlaceholder',
                'Optional short message about this update…',
              )}
              className="min-h-16 w-full resize-y rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-[#4048cd] focus:outline-hidden focus:ring-2 focus:ring-[#4048cd]/20"
            />
          </div>

          {/* Information box */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-xs text-[#353bb5]">
            <Video size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">{t('introVideo.infoTitle', 'Why upload a 1-minute video?')}</p>
              <p className="mt-0.5 leading-relaxed text-indigo-900/80">
                {t(
                  'introVideo.infoDesc',
                  'Your video will be featured prominently on your public profile bio so collectors, visitors, and competition voters can get to know you.',
                )}
              </p>
            </div>
          </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploadMutation.isPending}
              className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={
                (!isEditMode && !file) ||
                isTooLong ||
                uploadMutation.isPending ||
                !isDurationValid
              }
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4048cd] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#343bb0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEditMode
                    ? t('introVideo.updating', 'Updating...')
                    : t('introVideo.uploading', 'Uploading...')}
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {isEditMode
                    ? t('introVideo.updateBtn', 'Save Changes')
                    : t('introVideo.submitBtn', 'Upload 1-Min Video')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
});

UploadIntroVideoModal.displayName = 'UploadIntroVideoModal';

export default UploadIntroVideoModal;
