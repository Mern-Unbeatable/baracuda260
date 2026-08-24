import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Calendar, Clock, Heart, MessageSquare, Share2 } from 'lucide-react';

const PhotographerMessagesSection = memo(({ messages }) => {
  const { t } = useTranslation();

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare size={22} className="shrink-0 text-[#4048cd]" aria-hidden="true" />
            <h2 className="text-[20px] font-bold text-[#111827] sm:text-[22px]">
              {t('photographerProfile.messages.title')}
            </h2>
          </div>
          <p className="mt-1 max-w-2xl text-[14px] leading-6 text-[#6b7280] sm:text-[15px]">
            {t('photographerProfile.messages.subtitle')}
          </p>
        </div>
        <span className="inline-flex w-fit shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[13px] font-medium text-[#6b7280]">
          {t('photographerProfile.messages.publishedCount', { count: messages.length })}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {messages.map((message) => (
          <article
            key={message.id}
            className="overflow-hidden rounded-2xl border border-black/8 bg-white"
          >
            <div className="flex items-start justify-between gap-3 border-b border-black/8 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <img
                  src={message.avatar}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-[15px] font-semibold text-[#111827]">{message.author}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-3 text-[13px] text-[#6b7280]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} aria-hidden="true" />
                      {message.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} aria-hidden="true" />
                      {message.time}
                    </span>
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#ecedfa] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#4048cd]">
                {t('photographerProfile.messages.noteBadge')}
              </span>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-[15px] leading-6 text-[#374151]">{message.text}</p>
              {message.image ? (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img
                    src={message.image}
                    alt=""
                    className="h-64 w-full object-cover sm:h-80 lg:h-96"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-black/8 px-4 py-3 sm:px-5">
              <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#4048cd]">
                <Heart size={16} strokeWidth={2} aria-hidden="true" className="fill-[#4048cd] text-[#4048cd]" />
                {t('photographerProfile.messages.likes', { count: message.likes })}
              </span>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#4048cd]"
              >
                <Share2 size={16} strokeWidth={2} aria-hidden="true" />
                {t('galleryDetail.share')}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
});

PhotographerMessagesSection.displayName = 'PhotographerMessagesSection';

export default PhotographerMessagesSection;
