import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Pencil } from 'lucide-react';
import { ROUTES } from '@/shared/config';

const MemberProfileCoverHeader = memo(({ profile }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="relative h-45 w-full overflow-hidden rounded-2xl sm:h-55 lg:h-65">
        <img src={profile.cover} alt="" className="h-full w-full object-cover" />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#111827]/40 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center gap-4 px-1 pt-3 sm:gap-5 sm:px-2">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={112}
          height={112}
          className="relative z-10 -mt-14 size-24 shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-md sm:-mt-16 sm:size-28 lg:size-32"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-bold leading-tight text-[#111827] sm:text-[26px] lg:text-[28px]">
              {profile.name}
            </h1>
            <Link
              to={ROUTES.ADMIN_SETTINGS}
              aria-label={t('memberProfile.editProfile')}
              className="inline-flex size-7 items-center justify-center rounded-full text-[#ee1c25] transition hover:bg-[#fde8e9]"
            >
              <Pencil size={16} strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[#6b7280] sm:text-[15px]">
            <span>
              {profile.handle} · {profile.tagline}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={15} strokeWidth={2} aria-hidden="true" />
              {profile.location}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
});

MemberProfileCoverHeader.displayName = 'MemberProfileCoverHeader';

export default MemberProfileCoverHeader;
