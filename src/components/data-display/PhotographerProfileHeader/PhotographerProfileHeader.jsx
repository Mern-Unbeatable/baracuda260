import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { MapPin, MessageCircle, UserPlus, UserCheck } from 'lucide-react';

const PhotographerProfileHeader = memo(({ profile }) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(false);

  return (
    <div>
      <div className="-mx-4 overflow-hidden rounded-2xl sm:-mx-6">
        <div className="relative aspect-[3.2/1] min-h-[160px]">
          <img
            src={profile.coverImage || profile.image}
            alt=""
            width={1536}
            height={480}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="-mx-4 sm:-mx-6">
        <div className="relative flex flex-col gap-4 px-4 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-3 sm:pt-0">
          <div className="flex min-w-0 items-end gap-3 sm:gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              width={112}
              height={112}
              className="relative -mt-12 size-[84px] shrink-0 rounded-full border-[3px] border-white object-cover shadow-sm sm:-mt-14 sm:size-[104px]"
            />
            <div className="min-w-0 pb-1">
              <h1 className="text-[24px] font-bold leading-tight tracking-[-0.3px] text-[#111827] sm:text-[30px]">
                {profile.name}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-[#6b7280] sm:text-[14px]">
                <span>{profile.handle}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.tagline}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                  {profile.location}
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:pb-1">
            <button
              type="button"
              onClick={() => setFollowing((current) => !current)}
              className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] px-4 text-[14px] font-semibold text-white transition ${
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
              {following ? t('photographerProfile.following') : t('photographerProfile.follow')}
            </button>
            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-[#1e293b] px-4 text-[14px] font-semibold text-white transition hover:bg-[#0f172a]"
            >
              <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
              {t('photographerProfile.message')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PhotographerProfileHeader.displayName = 'PhotographerProfileHeader';

export default PhotographerProfileHeader;
