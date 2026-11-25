import { useQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle, Users, X } from 'lucide-react';
import React, { memo, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import useUserFollowing from '@/portals/member/hooks/useUserFollowing';
import { createOrGetChatRoomApi } from '@/shared/api/chat.api';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  getUserProfileByUsernameApi,
  searchUsersApi,
  USER_SEARCH_QUERY_KEY,
} from '@/shared/api/userProfile.api';
import { resolveMediaUrl } from '@/shared/utils/media';

const normalizeUsername = (value) =>
  String(value || '')
    .trim()
    .replace(/^@/, '');

const usernameVariants = (rawInput) => {
  const raw = normalizeUsername(rawInput);
  if (!raw) return [];
  return [
    ...new Set([
      raw,
      raw.toLowerCase(),
      raw.replace(/\s+/g, ''),
      raw.toLowerCase().replace(/\s+/g, ''),
      raw.replace(/\s+/g, '_'),
      raw.toLowerCase().replace(/\s+/g, '_'),
    ]),
  ].filter((value) => value.length >= 2);
};

const resolveTargetUserIdByUsername = async (rawInput) => {
  const variants = usernameVariants(rawInput);
  if (!variants.length) throw new Error('Enter a username');

  let lastError = null;
  for (const username of variants) {
    try {
      const profileResponse = await getUserProfileByUsernameApi(username);
      const profile = profileResponse?.data || profileResponse;
      if (profile?.id) return profile.id;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('User not found');
};

const matchesQuery = (user, query) => {
  const q = query.trim().toLowerCase().replace(/^@/, '');
  if (!q) return true;
  const name = String(user.name || '').toLowerCase();
  const username = String(user.username || '').toLowerCase();
  const compactName = name.replace(/\s+/g, '');
  const compactQ = q.replace(/\s+/g, '');
  return (
    name.includes(q) ||
    username.includes(q) ||
    compactName.includes(compactQ) ||
    username.includes(compactQ)
  );
};

const SuggestionRow = memo(
  ({ user, onChat, disabled, isLoading }) => {
    const { t } = useTranslation();
    const avatar =
      resolveMediaUrl(user.avatar) || '/assets/home/avatar-anna.webp';

    return (
      <div className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-[#f8fafc] sm:px-3.5">
        <Image
          src={avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover ring-1 ring-[#e8eaef]"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#161c27]">
            {user.name || user.username}
          </p>
          <p className="truncate text-[12px] text-[#6b7280]">
            @{user.username || 'photographer'}
          </p>
        </div>
        <Button
          unstyled
          type="button"
          onClick={() => onChat(user)}
          disabled={disabled}
          className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-3.5 text-[12px] font-semibold text-[#4048cd] transition hover:bg-[#e0e7ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <MessageCircle size={14} aria-hidden="true" />
              {t('chat.compose.chat', 'Chat')}
            </>
          )}
        </Button>
      </div>
    );
  },
);
SuggestionRow.displayName = 'SuggestionRow';

const NewChatModal = memo(({ open, onClose, onRoomCreated }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const [targetInput, setTargetInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingUserId, setSubmittingUserId] = useState(null);

  const { items: followedUsers, isLoading: isLoadingFollowed } =
    useUserFollowing({ page: 1, limit: 50, enabled: open });

  useEffect(() => {
    if (!open) return undefined;
    setTargetInput('');
    setDebouncedQuery('');
    setIsSubmitting(false);
    setSubmittingUserId(null);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(normalizeUsername(targetInput));
    }, 280);
    return () => window.clearTimeout(timer);
  }, [targetInput]);

  const {
    data: searchedUsers = [],
    isFetching: isSearching,
    isError: isSearchError,
  } = useQuery({
    queryKey: [USER_SEARCH_QUERY_KEY, debouncedQuery],
    queryFn: () => searchUsersApi({ q: debouncedQuery, limit: 8 }),
    enabled: open && debouncedQuery.length >= 2,
    staleTime: 20 * 1000,
    retry: false,
  });

  const { data: profileFallback = [] } = useQuery({
    queryKey: [USER_SEARCH_QUERY_KEY, 'profile-fallback', debouncedQuery],
    enabled:
      open &&
      debouncedQuery.length >= 2 &&
      !isSearching &&
      searchedUsers.length === 0,
    staleTime: 20 * 1000,
    retry: false,
    queryFn: async () => {
      for (const username of usernameVariants(debouncedQuery)) {
        try {
          const profile = await getUserProfileByUsernameApi(username);
          const user = profile?.data || profile;
          if (user?.id && user?.username) {
            return [
              {
                id: user.id,
                name: user.name || user.username,
                username: user.username,
                avatar: user.avatar || null,
              },
            ];
          }
        } catch {
          // try next variant
        }
      }
      return [];
    },
  });

  const followedMatches = useMemo(
    () =>
      followedUsers.filter((user) => matchesQuery(user, debouncedQuery || '')),
    [followedUsers, debouncedQuery],
  );

  const suggestions = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    const merged = new Map();
    [...followedMatches, ...searchedUsers, ...profileFallback].forEach(
      (user) => {
        if (!user?.id || merged.has(user.id)) return;
        merged.set(user.id, user);
      },
    );
    return Array.from(merged.values()).slice(0, 8);
  }, [debouncedQuery, followedMatches, searchedUsers, profileFallback]);

  const showSuggestions = debouncedQuery.length >= 2;

  if (!open) return null;

  const handleStartChatWithUser = async (userOrId) => {
    const userId =
      typeof userOrId === 'string' ? userOrId : userOrId?.id;
    const username =
      typeof userOrId === 'object' ? userOrId?.username : undefined;
    if (!userId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmittingUserId(userId);
      if (username) setTargetInput(username);
      const room = await createOrGetChatRoomApi({ targetUserId: userId });
      const roomId = room?.id || room?.data?.id;
      if (!roomId) throw new Error('Failed to obtain chat room');
      toast.success(t('chat.compose.ready', 'Chat ready'));
      onRoomCreated?.(roomId);
      onClose?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t('chat.compose.failed', 'Could not start chat with this user'),
        ),
      );
    } finally {
      setIsSubmitting(false);
      setSubmittingUserId(null);
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    if (!targetInput.trim() || isSubmitting) return;

    // Prefer an exact suggestion match first
    const exact = suggestions.find((user) => {
      const typed = normalizeUsername(targetInput).toLowerCase();
      return (
        String(user.username || '').toLowerCase() === typed ||
        String(user.name || '').toLowerCase() === typed ||
        String(user.username || '').toLowerCase() ===
          typed.replace(/\s+/g, '')
      );
    });
    if (exact) {
      handleStartChatWithUser(exact);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmittingUserId('manual');
      const userId = await resolveTargetUserIdByUsername(targetInput);
      const room = await createOrGetChatRoomApi({ targetUserId: userId });
      const roomId = room?.id || room?.data?.id;
      if (!roomId) throw new Error('Failed to obtain chat room');
      toast.success(t('chat.compose.ready', 'Chat ready'));
      onRoomCreated?.(roomId);
      onClose?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t('chat.compose.failed', 'Could not start chat with this user'),
        ),
      );
    } finally {
      setIsSubmitting(false);
      setSubmittingUserId(null);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0f172a]/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label={t('common.close', 'Close')}
      />

      <div className="relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-[#e8eaef] bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)]">
        <header className="flex items-start gap-3 border-b border-[#eceef3] px-5 py-4 sm:px-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4048cd]">
            <Users size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              id={titleId}
              className="text-[17px] font-bold tracking-[-0.2px] text-[#161c27]"
            >
              {t('chat.compose.title', 'Start New Conversation')}
            </h2>
            <p className="mt-0.5 text-[13px] leading-5 text-[#6b7280]">
              {t(
                'chat.compose.subtitle',
                'Type a username to see matching people, or pick someone you follow.',
              )}
            </p>
          </div>
          <Button
            unstyled
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#161c27]"
            aria-label={t('common.close', 'Close')}
          >
            <X size={18} />
          </Button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label
              htmlFor="new-chat-target"
              className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]"
            >
              {t('chat.compose.username', 'Username')}
            </label>
            <div className="flex items-stretch gap-2">
              <input
                id="new-chat-target"
                type="text"
                value={targetInput}
                onChange={(event) => setTargetInput(event.target.value)}
                placeholder={t(
                  'chat.compose.usernamePlaceholder',
                  'Search @username or name',
                )}
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-xl border border-[#e2e8f0] bg-white px-3.5 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]"
              />
              <Button
                unstyled
                type="submit"
                disabled={!targetInput.trim() || isSubmitting}
                className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#4048cd] px-4 text-[13px] font-semibold text-white transition hover:bg-[#343bb0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting && submittingUserId === 'manual' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <MessageCircle size={15} aria-hidden="true" />
                    {t('chat.compose.start', 'Start')}
                  </>
                )}
              </Button>
            </div>

            {showSuggestions ? (
              <div className="overflow-hidden rounded-xl border border-[#e8eaef] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] px-3.5 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                    {t('chat.compose.suggestions', 'Suggestions')}
                  </p>
                  {isSearching ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-[#4048cd]"
                    />
                  ) : null}
                </div>
                {suggestions.length === 0 && !isSearching ? (
                  <p className="px-3.5 py-4 text-center text-[13px] text-[#6b7280]">
                    {isSearchError
                      ? t(
                          'chat.compose.noSuggestions',
                          'No matching users found. Try an exact username like @mayastore.',
                        )
                      : t(
                          'chat.compose.noSuggestions',
                          'No matching users found. Try an exact username like @mayastore.',
                        )}
                  </p>
                ) : (
                  <ul className="divide-y divide-[#f1f5f9]">
                    {suggestions.map((user) => (
                      <li key={user.id}>
                        <SuggestionRow
                          user={user}
                          onChat={handleStartChatWithUser}
                          disabled={isSubmitting}
                          isLoading={submittingUserId === user.id}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eceef3]" />
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              {showSuggestions
                ? t('chat.compose.matchedFollowed', 'Matched people you follow')
                : t('chat.compose.orFollowed', 'Or choose someone you follow')}
            </span>
            <div className="h-px flex-1 bg-[#eceef3]" />
          </div>

          <div className="max-h-[280px] overflow-y-auto rounded-xl border border-[#eceef3] bg-white">
            {isLoadingFollowed ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10 text-[13px] text-[#9ca3af]">
                <Loader2 size={16} className="animate-spin text-[#4048cd]" />
                {t('chat.compose.loadingFollowed', 'Loading photographers...')}
              </div>
            ) : followedMatches.length === 0 ? (
              <div className="px-4 py-10 text-center text-[13px] leading-5 text-[#6b7280]">
                {followedUsers.length === 0
                  ? t(
                      'chat.compose.emptyFollowed',
                      'You are not following any photographers yet.',
                    )
                  : t(
                      'chat.compose.noFilterMatch',
                      'No followed photographers match your search.',
                    )}
              </div>
            ) : (
              <ul className="divide-y divide-[#f1f5f9]">
                {followedMatches.map((user) => (
                  <li key={user.id}>
                    <SuggestionRow
                      user={user}
                      onChat={handleStartChatWithUser}
                      disabled={isSubmitting}
                      isLoading={submittingUserId === user.id}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className="flex justify-end border-t border-[#eceef3] bg-[#fafbfc] px-5 py-3 sm:px-6">
          <Button
            unstyled
            type="button"
            onClick={onClose}
            className="inline-flex h-9 cursor-pointer items-center rounded-xl border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#494453] transition hover:bg-[#f8fafc]"
          >
            {t('common.cancel', 'Cancel')}
          </Button>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

NewChatModal.displayName = 'NewChatModal';

export default NewChatModal;
