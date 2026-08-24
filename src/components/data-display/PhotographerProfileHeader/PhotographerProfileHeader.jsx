import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { MapPin, MessageCircle, UserPlus } from 'lucide-react';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';

const PhotographerProfileHeader = memo(({ profile }) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={96}
          height={96}
          className="size-20 shrink-0 rounded-full object-cover sm:size-24"
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

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
        <MarketingButton
          type="button"
          className={`w-full justify-center sm:w-auto ${following ? 'bg-[#4048cd]/90' : 'bg-[#4048cd] hover:bg-[#363eb8]'}`}
          onClick={() => setFollowing((current) => !current)}
        >
          <UserPlus size={18} strokeWidth={2} aria-hidden="true" />
          {following ? t('photographerProfile.following') : t('photographerProfile.follow')}
        </MarketingButton>
        <MarketingButton type="button" className="w-full justify-center bg-[#1e293b] hover:bg-[#162032] sm:w-auto">
          <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
          {t('photographerProfile.message')}
        </MarketingButton>
      </div>
    </div>
  );
});

PhotographerProfileHeader.displayName = 'PhotographerProfileHeader';

export default PhotographerProfileHeader;
