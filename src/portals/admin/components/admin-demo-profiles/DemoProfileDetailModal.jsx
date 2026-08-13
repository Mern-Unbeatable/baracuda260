import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_DEMO_PROFILES_ASSETS,
  CLOSE_ICON_SIZE,
  DEMO_PROFILE_STATUS,
  getDemoProfileDisplayAbout,
  getDemoProfileDisplayName,
  getDemoProfileDisplayUsername,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
} from '@/portals/admin/data/adminDemoProfilesData';

/**
 * @param {{
 *   open: boolean,
 *   profile: object | null,
 *   onClose: () => void,
 *   onDeactivate: () => void,
 * }} props
 */
const DemoProfileDetailModal = memo(({ open, profile, onClose, onDeactivate }) => {
  const { t } = useTranslation();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !profile) return null;

  const isActive = profile.status === DEMO_PROFILE_STATUS.ACTIVE;
  const statusStyle = STATUS_STYLES[profile.status] || STATUS_STYLES.active;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,51,0.35)] p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#edf0f3] px-6 pb-5 pt-5">
          <h2
            id={titleId}
            className="font-manrope text-[22px] font-bold leading-8 tracking-[-0.5px] text-[#202838]"
          >
            {t('adminDemoProfiles.detail.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('adminDemoProfiles.detail.close')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-black/5"
          >
            <img
              src={ADMIN_DEMO_PROFILES_ASSETS.close}
              alt=""
              width={CLOSE_ICON_SIZE}
              height={CLOSE_ICON_SIZE}
              className="size-4.5"
            />
          </button>
        </header>

        <div className="overflow-y-auto">
          <div className="relative h-36 bg-[#f3f4f6] sm:h-40">
            <img src={profile.banner} alt="" className="size-full object-cover" />
            <div className="absolute -bottom-10 left-6">
              <img
                src={profile.avatar}
                alt={getDemoProfileDisplayName(profile, t)}
                className="size-20 rounded-2xl border-4 border-white object-cover shadow-md sm:size-24"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 px-6 pb-6 pt-14 sm:pt-16">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-manrope text-[22px] font-bold leading-8 text-[#202838]">
                  {getDemoProfileDisplayName(profile, t)}
                </p>
                <p className="text-[16px] leading-6 text-[#687186]">
                  {getDemoProfileDisplayUsername(profile, t)}
                </p>
              </div>
              <span
                className={`inline-flex h-[30px] shrink-0 items-center gap-[5px] rounded-[8px] px-[9px] py-[5px] ${statusStyle.bg}`}
              >
                <span className={`size-[6px] rounded-[3px] ${statusStyle.dot}`} aria-hidden="true" />
                <span className={`text-[13px] font-bold leading-[19px] ${statusStyle.text}`}>
                  {t(STATUS_LABEL_KEYS[profile.status])}
                </span>
              </span>
            </div>

            <div>
              <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#64748b]">
                {t('adminDemoProfiles.detail.contactTitle')}
              </p>
              <div className="mt-3 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc]">
                    <img src={ADMIN_DEMO_PROFILES_ASSETS.phone} alt="" className="size-5 opacity-70" />
                  </span>
                  <div>
                    <p className="text-[14px] leading-5 text-[#64748b]">
                      {t('adminDemoProfiles.detail.phoneLabel')}
                    </p>
                    <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc]">
                    <img src={ADMIN_DEMO_PROFILES_ASSETS.email} alt="" className="size-5 opacity-70" />
                  </span>
                  <div>
                    <p className="text-[14px] leading-5 text-[#64748b]">
                      {t('adminDemoProfiles.detail.emailLabel')}
                    </p>
                    <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#64748b]">
                {t('adminDemoProfiles.detail.aboutTitle')}
              </p>
              <p className="mt-2 text-[16px] leading-6 text-[#455163]">
                {getDemoProfileDisplayAbout(profile, t)}
              </p>
            </div>

            <div>
              <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#64748b]">
                {t('adminDemoProfiles.detail.socialTitle')}
              </p>
              <a
                href={`https://${profile.socialUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-[16px] font-medium leading-6 text-[#4048cd] hover:underline"
              >
                <img src={ADMIN_DEMO_PROFILES_ASSETS.external} alt="" className="size-4" />
                {profile.socialUrl}
              </a>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-[#edf0f3] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[#dfe4ea] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb]"
          >
            {t('adminDemoProfiles.detail.closeButton')}
          </button>
          {isActive ? (
            <button
              type="button"
              onClick={onDeactivate}
              className="cursor-pointer rounded-lg bg-[#fff1f2] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#ee1c25] transition hover:bg-[#ffe4e6]"
            >
              {t('adminDemoProfiles.detail.deactivate')}
            </button>
          ) : null}
        </footer>
      </div>
    </div>,
    document.body,
  );
});

DemoProfileDetailModal.displayName = 'DemoProfileDetailModal';

export default DemoProfileDetailModal;
