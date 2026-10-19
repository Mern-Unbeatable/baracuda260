import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, MessageCircle, UserCheck, UserPlus } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import PhotographerAwardCounters from '@/components/data-display/PhotographerAwardCounters/PhotographerAwardCounters';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  toggleFollowUserApi,
  USER_FOLLOWING_QUERY_KEY,
  USER_PROFILE_ME_QUERY_KEY,
} from '@/shared/api/userProfile.api';

const PhotographerProfileHeader = memo(({ profile }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [following, setFollowing] = useState(Boolean(profile.isFollowing));

  useEffect(() => {
    if (typeof profile.isFollowing === 'boolean') {
      setFollowing(profile.isFollowing);
    }
  }, [profile.isFollowing]);

  const toggleMutation = useMutation({
    mutationFn: () => toggleFollowUserApi(profile.username || profile.handle),
    onSuccess: (res) => {
      setFollowing((curr) => !curr);
      queryClient.invalidateQueries({ queryKey: USER_FOLLOWING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_ME_QUERY_KEY });
      if (profile.username) {
        queryClient.invalidateQueries({
          queryKey: ['user-profile', profile.username.replace(/^@/, '')],
        });
      }
      if (res?.message) toast.success(res.message);
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to update follow status.'),
        ),
      );
    },
  });

  const handleFollowClick = () => {
    const rawUsername = profile.username || profile.handle;
    if (rawUsername) {
      toggleMutation.mutate();
    } else {
      setFollowing((current) => !current);
    }
  };

  return (
    <div>
      <div className="-mx-4 overflow-hidden rounded-2xl sm:-mx-6">
        <div className="relative aspect-[3.2/1] min-h-[160px] bg-[#e5e7eb]">
          {profile.coverImage || profile.image ? (
            <Image
              src={profile.coverImage || profile.image}
              alt=""
              width={1536}
              height={480}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-r from-[#4048cd]/20 via-[#4048cd]/10 to-[#ee1c25]/15" />
          )}
        </div>
      </div>

      <div className="-mx-4 sm:-mx-6">
        <div className="relative flex flex-col gap-4 px-4 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-3 sm:pt-0">
          <div className="flex min-w-0 items-end gap-3 sm:gap-4">
            <Image
              src={profile.avatar || DASHBOARD_ASSETS.avatar}
              alt={profile.name}
              width={112}
              height={112}
              className="relative -mt-12 size-[84px] shrink-0 rounded-full border-[3px] border-white bg-white object-cover shadow-sm sm:-mt-14 sm:size-[104px]"
            />
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[24px] font-bold leading-tight tracking-[-0.3px] text-[#111827] sm:text-[30px]">
                  {profile.name}
                </h1>
                <PhotographerAwardCounters
                  awards={profile.appreciation?.tiers}
                  size="md"
                />
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-[#6b7280] sm:text-[14px]">
                {profile.handle ? <span>{profile.handle}</span> : null}
                {profile.tagline ? (
                  <>
                    {profile.handle ? <span aria-hidden="true">·</span> : null}
                    <span>{profile.tagline}</span>
                  </>
                ) : null}
                {profile.location ? (
                  <>
                    {profile.handle || profile.tagline ? (
                      <span aria-hidden="true">·</span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                      {profile.location}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:pb-1">
            <Button
              unstyled
              type="button"
              disabled={toggleMutation.isPending}
              onClick={handleFollowClick}
              className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] px-4 text-[14px] font-semibold text-white transition disabled:opacity-60 ${
                following
                  ? 'bg-[#312e81] hover:bg-[#1e1b4b]'
                  : 'bg-[#4048cd] hover:bg-[#343bb0]'
              }`}
            >
              {following ? (
                <UserCheck size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <UserPlus size={16} strokeWidth={2} aria-hidden="true" />
              )}
              {following
                ? t('photographerProfile.following')
                : t('photographerProfile.follow')}
            </Button>
            <Button
              unstyled
              type="button"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-[#1e293b] px-4 text-[14px] font-semibold text-white transition hover:bg-[#0f172a]"
            >
              <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
              {t('photographerProfile.message')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

PhotographerProfileHeader.displayName = 'PhotographerProfileHeader';

export default PhotographerProfileHeader;
