import { Calendar, Clock, Heart, MessageSquare, Share2 } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';

const PhotographerMessagesSection = memo(({ messages }) => {
  const { t } = useTranslation();
  const list = Array.isArray(messages) ? messages : [];

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#ecedfa] text-[#4048cd]">
              <MessageSquare size={18} aria-hidden="true" />
            </span>
            <h2 className="text-[22px] font-bold tracking-[-0.3px] text-[#111827] sm:text-[24px]">
              {t('photographerProfile.posts.title')}
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#6b7280] sm:text-[15px]">
            {t('photographerProfile.posts.subtitle')}
          </p>
        </div>
        <span className="inline-flex w-fit shrink-0 rounded-full bg-[#f3f4f6] px-3.5 py-1.5 text-[13px] font-medium text-[#6b7280]">
          {t('photographerProfile.posts.publishedCount', {
            count: list.length,
          })}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d7dbe7] bg-white px-6 py-14 text-center">
          <p className="text-[15px] font-medium text-[#687186]">
            {t(
              'photographerProfile.posts.empty',
              'No posts published yet.',
            )}
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-6 flex w-full max-w-[720px] flex-col gap-5">
          {list.map((message) => (
            <article
              key={message.id}
              className="overflow-hidden rounded-2xl border border-[#e8ebf2] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={message.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-[#111827]">
                      {message.author}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#8b93a7] sm:text-[13px]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={13} aria-hidden="true" />
                        {message.date}
                      </span>
                      <span className="text-[#d1d5db]" aria-hidden="true">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} aria-hidden="true" />
                        {message.time}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#ecedfa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#4048cd] sm:text-[11px]">
                  {t('photographerProfile.posts.noteBadge')}
                </span>
              </div>

              <div className="px-4 pt-3 sm:px-5 sm:pt-3.5">
                <p className="text-[15px] leading-6 text-[#374151] sm:text-[16px] sm:leading-7">
                  {message.text}
                </p>
              </div>

              {message.image ? (
                <div className="mt-3.5 bg-[#f6f7fb] sm:mt-4">
                  <Image
                    src={message.image}
                    alt=""
                    className="mx-auto max-h-[420px] w-full object-contain"
                  />
                </div>
              ) : null}

              <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#ee1c25] sm:text-[14px]">
                  <Heart
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="fill-[#ee1c25] text-[#ee1c25]"
                  />
                  {t('photographerProfile.posts.likes', {
                    count: message.likes,
                  })}
                </span>
                <Button
                  unstyled
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-[#4048cd] transition hover:bg-[#f4f5ff] sm:text-[14px]"
                >
                  <Share2 size={16} strokeWidth={2} aria-hidden="true" />
                  {t('galleryDetail.share')}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
});

PhotographerMessagesSection.displayName = 'PhotographerMessagesSection';

export default PhotographerMessagesSection;
