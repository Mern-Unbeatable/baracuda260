import React, { memo, useEffect, useState } from 'react';
import { ROUTES } from '../../config';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '../site';
import { getGallerySixStoryById } from '../../data/gallerySixStory';

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
  photographer: `${A}/avatar-photographer.jpg`,
  commentAvatar: `${A}/avatar-comment.jpg`,
  verified: `${A}/icon-verified.svg`,
  voteHeart: `${A}/icon-vote-heart.svg`,
  arrow: `${A}/icon-arrow-nav.svg`,
  curve: `${A}/curve-story.svg`,
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

const GallerySixDetailContent = memo(() => {
  const { id } = useParams();
  const story = getGallerySixStoryById(id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState('');

  const slides = story.slides;
  const activeSlide = slides[activeIndex] || slides[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [story.id]);

  const goPrev = () => setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  return (
    <SitePageLayout
      activeHref={ROUTES.GALLERY}
      rootClassName="gallery-six-detail-page-root"
      announcementTone="blue"
      newsletterVariant="detail"
    >
      {/* Hero + story strip */}
      <section className="bg-white pt-8 sm:pt-10 xl:pt-12">
        <Shell>
          <div className="relative aspect-[1536/653] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
            <img
              src={activeSlide.hero}
              alt={`${story.title} — ${activeSlide.sign}`}
              width={1536}
              height={653}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex items-end gap-2 rounded-[20px] bg-[#ee1c25] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-[5px]">
              <span className="relative inline-flex h-[18px] w-[20px] shrink-0 overflow-hidden sm:h-[21px] sm:w-6">
                <img
                  src={activeSlide.icon}
                  alt=""
                  width={24}
                  height={21}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-[16px] leading-none text-white sm:text-[20px]">
                {activeSlide.sign}
              </span>
            </div>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-[51px] sm:size-[51px]"
            >
              <img
                src={ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 rotate-180 object-contain sm:h-8 sm:w-4"
              />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:right-[51px] sm:size-[51px]"
            >
              <img
                src={ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 object-contain sm:h-8 sm:w-4"
              />
            </button>
          </div>

          <div className="relative mt-2 h-8 w-full overflow-hidden sm:mt-3 sm:h-[52px]">
            <img src={ASSETS.curve} alt="" className="h-full w-full object-fill object-top" />
          </div>

          <div className="mt-2 w-full overflow-x-auto pb-2">
            <div className="flex min-w-[980px] flex-col gap-2.5 lg:min-w-0">
              <div className="grid grid-cols-6 gap-3 xl:gap-5">
                {slides.map((slide) => (
                  <div key={slide.id} className="flex items-center justify-between gap-1">
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
                      <span className="inline-flex shrink-0 items-end rounded bg-[#ee1c25] px-1.5 py-1 sm:px-2.5 sm:py-[5px]">
                        <img
                          src={slide.icon}
                          alt=""
                          width={24}
                          height={22}
                          className="h-[16px] w-[18px] object-contain sm:h-[21px] sm:w-6"
                        />
                      </span>
                      <span className="truncate text-[13px] text-[#2b2b2b] sm:text-[18px] xl:text-[24px]">
                        {slide.sign}
                      </span>
                    </div>
                    <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[14px] text-[#ee1c25] sm:size-[30px] sm:text-[20px]">
                      {slide.number}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 gap-3 xl:gap-5">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.id}-thumb`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${slide.sign}`}
                    aria-pressed={index === activeIndex}
                    className={`relative h-[72px] overflow-hidden rounded-lg sm:h-[100px] xl:h-[120px] ${
                      index === activeIndex
                        ? 'border-[3px] border-[#ee1c25]'
                        : 'border border-transparent'
                    }`}
                  >
                    <img
                      src={slide.thumb}
                      alt={slide.sign}
                      width={240}
                      height={120}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              Download
            </a>
          </div>
        </Shell>
      </section>

      {/* Details */}
      <section className="bg-white py-10 sm:py-12 xl:py-14">
        <Shell>
          <div className="flex flex-wrap gap-3 sm:gap-8">
            {[story.badge, story.category].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#ecedfa] px-4 py-[5px] text-[14px] font-bold uppercase tracking-[1.2px] text-[#4048cd] sm:text-[16px]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-[#111827] sm:mt-5 sm:text-[32px] xl:text-[36px]">
            {story.title}
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-7 text-[#3e3f40] sm:text-[18px] sm:leading-8 xl:text-[20px] xl:leading-[30px]">
            {story.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-[21px]">
            {[
              { label: 'VOTES RECEIVED', value: story.votes },
              { label: 'VIEWS COUNTED', value: story.views },
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
              Cast Your Vote
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-[12px]">
              <img
                src={ASSETS.photographer}
                alt={story.photographer}
                width={57}
                height={57}
                className="size-[48px] rounded-full object-cover sm:size-[57px]"
              />
              <div>
                <p className="text-[14px] leading-[22px] text-[#6b7280] sm:text-[16px]">
                  Photographer
                </p>
                <p className="text-[18px] font-bold leading-[27px] text-[#111827] sm:text-[20px]">
                  {story.photographer}
                </p>
              </div>
            </div>
            <AppLink
              href={ROUTES.PHOTOGRAPHER_PROFILE}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              Photographer Profile
            </AppLink>
          </div>
        </Shell>
      </section>

      {/* Comments */}
      <section className="bg-white pb-12 sm:pb-16">
        <Shell>
          <div className="overflow-hidden rounded-lg bg-[#f8fafc] p-4 sm:p-6">
            <h2 className="text-[22px] font-semibold text-[#101112] sm:text-[24px]">Comments</h2>

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
                      Verified
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
                  htmlFor="gallery-six-comment"
                  className="text-[18px] font-medium text-black sm:text-[20px]"
                >
                  Comment
                </label>
                <textarea
                  id="gallery-six-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment"
                  rows={6}
                  className="w-full resize-y rounded-lg bg-white p-2.5 text-[12px] text-[#373737] outline-none placeholder:text-[#373737]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-[#ee1c25] px-2.5 py-3 text-[16px] font-medium text-white"
              >
                Submit
              </button>
            </form>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

GallerySixDetailContent.displayName = 'GallerySixDetailContent';

export default GallerySixDetailContent;
