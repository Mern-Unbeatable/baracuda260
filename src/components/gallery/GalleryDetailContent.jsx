import React, { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '../site';
import { getGalleryPhotoById } from '../../data/galleryPhotos';

const A = '/assets/home';

const ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
  aries: `${A}/icon-aries.svg`,
  photographer: `${A}/avatar-photographer.jpg`,
  commentAvatar: `${A}/avatar-comment.jpg`,
  verified: `${A}/icon-verified.svg`,
  voteHeart: `${A}/icon-vote-heart.svg`,
};

const COMMENTS = [
  {
    name: 'Darrell Steward',
    text: 'I really like the composition and the colors. Amazing work!',
  },
  {
    name: 'Darrell Steward',
    text: 'Your creativity really stands out. Best of luck in the competition!',
  },
];

const GalleryDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const photo = getGalleryPhotoById(id);
  const [comment, setComment] = useState('');

  return (
    <SitePageLayout
      activeHref={ROUTES.GALLERY}
      rootClassName="gallery-detail-page-root"
      announcementTone="blue"
      newsletterVariant="detail"
    >
      {/* Hero photo */}
      <section className="bg-white pt-8 sm:pt-10 xl:pt-12">
        <Shell>
          <div className="relative aspect-[1536/653] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
            <img
              src={photo.image}
              alt={photo.title}
              width={1536}
              height={653}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex items-end gap-2 rounded-[20px] bg-[#ee1c25] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-[5px]">
              <span className="relative inline-flex h-[18px] w-[20px] shrink-0 overflow-hidden sm:h-[21px] sm:w-6">
                <img
                  src={ASSETS.aries}
                  alt=""
                  width={24}
                  height={21}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-[16px] leading-none text-white sm:text-[20px]">Aries</span>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              {t('galleryDetail.download')}
            </a>
          </div>
        </Shell>
      </section>

      {/* Details */}
      <section className="bg-white py-10 sm:py-12 xl:py-14">
        <Shell>
          <div className="flex flex-wrap gap-3 sm:gap-8">
            {[photo.badge, photo.category].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#ecedfa] px-4 py-[5px] text-[14px] font-bold uppercase tracking-[1.2px] text-[#4048cd] sm:text-[16px]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-[#111827] sm:mt-5 sm:text-[32px] xl:text-[36px]">
            {photo.title}
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-7 text-[#3e3f40] sm:text-[18px] sm:leading-8 xl:text-[20px] xl:leading-[30px]">
            {photo.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-[21px]">
            {[
              { label: t('galleryDetail.votesReceived'), value: photo.votes.replace(/,/g, '') },
              { label: t('galleryDetail.viewsCounted'), value: photo.views.replace(/,/g, '') },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-[15px] rounded-2xl border border-black/[0.08] bg-[#f5f5f5] p-3 text-center"
              >
                <p className="w-full text-[14px] font-bold uppercase tracking-[1.2px] text-[#6b7280]">
                  {stat.label}
                </p>
                <p className="w-full text-[20px] font-bold text-[#111827]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-black/10 pt-8">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              <ImgIcon src={ASSETS.voteHeart} size={20} />
              {t('galleryDetail.castVote')}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-[12px]">
              <img
                src={ASSETS.photographer}
                alt={photo.photographer}
                width={57}
                height={57}
                className="size-[48px] rounded-full object-cover sm:size-[57px]"
              />
              <div>
                <p className="text-[14px] leading-[22px] text-[#6b7280] sm:text-[16px]">
                  {t('galleryDetail.photographerLabel')}
                </p>
                <p className="text-[18px] font-bold leading-[27px] text-[#111827] sm:text-[20px]">
                  {photo.photographer}
                </p>
              </div>
            </div>
            <AppLink
              href={ROUTES.PHOTOGRAPHER_PROFILE}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              {t('galleryDetail.photographerProfile')}
            </AppLink>
          </div>
        </Shell>
      </section>

      {/* Comments */}
      <section className="bg-white pb-12 sm:pb-16">
        <Shell>
          <div className="overflow-hidden rounded-lg bg-[#f8fafc] p-4 sm:p-6">
            <h2 className="text-[22px] font-semibold text-[#101112] sm:text-[24px]">
              {t('galleryDetail.comments')}
            </h2>

            <ul className="mt-6 flex flex-col">
              {COMMENTS.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="border-b border-[#c8c8c8] pb-4 pt-0 first:pt-0 [&:not(:first-child)]:pt-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ASSETS.commentAvatar}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 rounded-full object-cover"
                      />
                      <p className="text-[14px] font-medium leading-5 text-[#191c1f]">
                        {item.name}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#4048cd] px-1.5 py-0.5 text-[14px] text-white">
                      <ImgIcon src={ASSETS.verified} size={16} />
                      {t('galleryDetail.verified')}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-5 text-[#475156]">{item.text}</p>
                </li>
              ))}
            </ul>

            <form
              className="mt-6 flex flex-col gap-4 rounded-lg bg-[#e6f0f8] p-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="gallery-comment"
                  className="text-[18px] font-medium text-black sm:text-[20px]"
                >
                  {t('galleryDetail.commentLabel')}
                </label>
                <textarea
                  id="gallery-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('galleryDetail.commentPlaceholder')}
                  rows={6}
                  className="w-full resize-y rounded-lg bg-white p-2.5 text-[12px] text-[#373737] outline-none placeholder:text-[#373737]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-[#ee1c25] px-2.5 py-3 text-[16px] font-medium text-white"
              >
                {t('galleryDetail.postComment')}
              </button>
            </form>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

GalleryDetailContent.displayName = 'GalleryDetailContent';

export default GalleryDetailContent;
