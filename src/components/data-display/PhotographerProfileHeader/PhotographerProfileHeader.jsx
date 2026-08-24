import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { MapPin, MessageCircle, UserPlus } from 'lucide-react';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';

const PhotographerProfileHeader = memo(({ profile }) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(false);

  return (
    <div>
      {/* Hero cover */}
      <div className="-mx-4 sm:-mx-6 overflow-hidden rounded-2xl">
        <div className="relative aspect-[3/1]">
          <img
            src={profile.coverImage || profile.image}
            alt={profile.name}
            width={1536}
            height={512}
            className="h-full w-full object-cover object-center"
          />

          {/* Buttons overlay on hero (bottom-right) */}
          <div className="absolute right-4 bottom-4 flex items-center gap-3">
            <MarketingButton
              type="button"
              style={{ backgroundColor: '#4048CD' }}
              className="inline-flex h-9 items-center gap-2 rounded-md px-4 text-[13px] font-medium text-white"
              onClick={() => setFollowing((current) => !current)}
            >
              <UserPlus size={16} strokeWidth={2} aria-hidden="true" />
              {following ? t('photographerProfile.following') : t('photographerProfile.follow')}
            </MarketingButton>
            <MarketingButton
              type="button"
              style={{ backgroundColor: '#4048CD' }}
              className="inline-flex h-9 items-center gap-2 rounded-md px-4 text-[13px] font-medium text-white"
            >
              <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
              {t('photographerProfile.message')}
            </MarketingButton>
          </div>
        </div>
      </div>

      {/* Profile row (avatar overlaps hero) */}
      <div className="-mx-4 sm:-mx-6">
        <div className="relative flex items-start justify-between px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-start gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              width={96}
              height={96}
              className="relative -mt-10 size-20 shrink-0 rounded-full border-4 border-white object-cover shadow-sm sm:-mt-12 sm:size-24"
            />
            <div className="min-w-0">
              <h1 className="text-[24px] font-bold leading-tight text-[#111827] sm:text-[28px]">
                {profile.name}
              </h1>
              <p className="mt-1 text-[14px] text-[#6b7280] sm:text-[15px]">
                {profile.handle} · {profile.tagline}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-[#6b7280]">
                <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                {profile.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PhotographerProfileHeader.displayName = 'PhotographerProfileHeader';

export default PhotographerProfileHeader;
