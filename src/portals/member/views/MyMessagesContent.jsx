import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberMessageCard from '@/components/data-display/MemberMessageCard/MemberMessageCard';
import { MY_MESSAGES, MY_MESSAGES_PAGE_SIZE } from '@/portals/member/data/myMessagesData';

const MyMessagesContent = memo(() => {
  const { t } = useTranslation();
  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    MY_MESSAGES,
    MY_MESSAGES_PAGE_SIZE,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
            {t('myMessages.title')}
          </h1>
          <p className="max-w-[960px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myMessages.subtitle')}
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_NEWS_MESSAGES_UPLOAD}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[16px] leading-6 text-white shadow-sm transition hover:bg-[#d41921]"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          {t('myMessages.uploadCta')}
        </Link>
      </header>

      <section
        aria-label={t('myMessages.gridAria')}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {pagedItems.map((message) => (
          <MemberMessageCard key={message.id} message={message} />
        ))}
      </section>

      {MY_MESSAGES.length > 0 ? (
        <footer className="flex flex-col items-center gap-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('myMessages.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

MyMessagesContent.displayName = 'MyMessagesContent';

export default MyMessagesContent;
