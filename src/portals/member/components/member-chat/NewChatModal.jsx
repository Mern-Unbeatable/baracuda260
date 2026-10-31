import { Loader2, Search, UserCheck, Users, X } from 'lucide-react';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import useUserFollowing from '@/portals/member/hooks/useUserFollowing';
import { createOrGetChatRoomApi } from '@/shared/api/chat.api';

const NewChatModal = memo(({ open, onClose, onRoomCreated }) => {
  const titleId = useId();
  const [targetUserId, setTargetUserId] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingUserId, setSubmittingUserId] = useState(null);

  const { items: followedUsers, isLoading: isLoadingFollowed } =
    useUserFollowing({ page: 1, limit: 30 });

  useEffect(() => {
    if (open) {
      setTargetUserId('');
      setFilterQuery('');
      setIsSubmitting(false);
      setSubmittingUserId(null);
    }
  }, [open]);

  if (!open) return null;

  const handleStartChatWithUser = async (userId) => {
    if (!userId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmittingUserId(userId);
      const room = await createOrGetChatRoomApi({ targetUserId: userId });
      const roomId = room?.id || room?.data?.id;
      if (roomId) {
        toast.success('Chat ready');
        onRoomCreated(roomId);
        onClose();
      } else {
        throw new Error('Failed to obtain chat room');
      }
    } catch (error) {
      toast.error(error?.message || 'Could not start chat with this user');
    } finally {
      setIsSubmitting(false);
      setSubmittingUserId(null);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;
    handleStartChatWithUser(targetUserId.trim());
  };

  const filteredPhotographers = followedUsers.filter((u) => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q)
    );
  });

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ececf0] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4048cd]">
              <Users size={18} />
            </div>
            <div>
              <h2
                id={titleId}
                className="text-[18px] font-semibold text-[#161c27]"
              >
                Start New Conversation
              </h2>
              <p className="text-[12px] text-[#6b7280]">
                Chat with photographers and community members
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#161c27]"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-light flex-1 overflow-y-auto p-6 space-y-6">
          {/* Option 1: Direct User ID */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label
              htmlFor="target-user-input"
              className="text-[13px] font-medium text-[#374151]"
            >
              Enter User ID
            </label>
            <div className="flex gap-2">
              <Input
                id="target-user-input"
                type="text"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="e.g. 44da67bd-3a55-43d7-bd7a..."
                inputClassName="h-10 text-[13px] rounded-xl"
                labelClassName="hidden"
              />
              <Button
                type="submit"
                disabled={!targetUserId.trim() || isSubmitting}
                className="shrink-0 rounded-xl px-4 text-[13px] font-medium"
              >
                {isSubmitting && submittingUserId === targetUserId.trim() ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Start'
                )}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ececf0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#9ca3af]">
                Or select from followed photographers
              </span>
            </div>
          </div>

          {/* Option 2: Followed Photographers */}
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              />
              <Input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter followed photographers..."
                inputClassName="h-9 pl-9 text-[13px] rounded-xl bg-[#f8fafc]"
                labelClassName="hidden"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 divide-y divide-[#f3f4f6]">
              {isLoadingFollowed ? (
                <div className="flex items-center justify-center py-8 text-[13px] text-[#9ca3af]">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Loading photographers...
                </div>
              ) : filteredPhotographers.length === 0 ? (
                <div className="py-6 text-center text-[13px] text-[#6b7280]">
                  {followedUsers.length === 0
                    ? 'You are not following any photographers yet.'
                    : 'No photographers match your filter.'}
                </div>
              ) : (
                filteredPhotographers.map((user) => {
                  const isCurrentTarget = submittingUserId === user.id;
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 py-2.5 px-2 hover:bg-[#f8fafc] rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Image
                          src={user.avatar || '/assets/home/avatar-anna.webp'}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-[#161c27]">
                            {user.name || user.username}
                          </p>
                          <p className="truncate text-[12px] text-[#4048cd]">
                            @{user.username || 'photographer'}
                          </p>
                        </div>
                      </div>
                      <Button
                        unstyled
                        type="button"
                        onClick={() => handleStartChatWithUser(user.id)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-3.5 py-1.5 text-[12px] font-semibold text-[#4048cd] hover:bg-[#ecedfa] transition disabled:opacity-50"
                      >
                        {isCurrentTarget ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <>
                            <UserCheck size={14} />
                            Chat
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#ececf0] bg-[#f8fafc] px-6 py-3 flex justify-end">
          <Button
            unstyled
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#ececf0] bg-white px-4 py-2 text-[13px] font-medium text-[#494453] hover:bg-[#f8fafc] transition"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

NewChatModal.displayName = 'NewChatModal';

export default NewChatModal;
