import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import {
  CATEGORY_FILTERS,
  MY_COMPETITION_STATS,
  MY_COMPETITION_SUBMISSIONS,
  MY_COMPETITIONS_ASSETS,
  PAGE_SIZE,
  STATUS_FILTERS,
  STATUS_STYLES,
  TYPE_STYLES,
} from './myCompetitionsAssets';

const FilterSelect = memo(({ label, value, options, open, onToggle, onSelect, optionKeyPrefix }) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
        className="inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[#606060] px-5 py-2.5 text-left"
      >
        <span className="text-[14px] font-medium leading-5 text-[#1c1c1c]">
          {t(`${optionKeyPrefix}.${value}`)}
        </span>
        <img
          src={MY_COMPETITIONS_ASSETS.chevronDown}
          alt=""
          width={20}
          height={20}
          className={`size-5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white shadow-lg"
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => onSelect(option)}
                className={`w-full cursor-pointer whitespace-nowrap px-5 py-2.5 text-left text-[14px] font-medium transition hover:bg-[#ecedfa] ${
                  option === value ? 'bg-[#ecedfa] text-[#4048cd]' : 'text-[#1c1c1c]'
                }`}
              >
                {t(`${optionKeyPrefix}.${option}`)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

FilterSelect.displayName = 'FilterSelect';

const StatCard = memo(({ labelKey, value, hintKey, showAward }) => {
  const { t } = useTranslation();

  return (
    <article className="flex min-h-[130px] flex-col gap-3 rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white p-[25px] shadow-sm">
      <p className="text-[14px] font-medium uppercase tracking-[0.6px] text-[#494453] sm:text-[16px] sm:leading-4">
        {t(labelKey)}
      </p>
      <div className="flex items-end gap-2">
        <p className="text-[28px] font-semibold leading-8 text-[#4048cd] sm:text-[32px]">
          {value}
        </p>
        {hintKey ? (
          <p className="pb-1 text-[14px] font-medium leading-4 tracking-[0.6px] text-[#494453]">
            {t(hintKey)}
          </p>
        ) : null}
        {showAward ? (
          <img
            src={MY_COMPETITIONS_ASSETS.award}
            alt=""
            width={16}
            height={25}
            className="mb-0.5 h-[25px] w-4 shrink-0 object-contain"
          />
        ) : null}
      </div>
    </article>
  );
});

StatCard.displayName = 'StatCard';

const SubmissionCard = memo(({ item }) => {
  const { t } = useTranslation();
  const statusClass = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;
  const typeClass = TYPE_STYLES[item.type] ?? TYPE_STYLES.single;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white shadow-sm">
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden sm:h-[210px]">
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-medium leading-4 tracking-[0.6px] backdrop-blur-[6px] ${statusClass}`}
          >
            {t(`myCompetitions.status.${item.status}`)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-medium leading-4 tracking-[0.6px] backdrop-blur-[6px] ${typeClass}`}
          >
            {t(`myCompetitions.types.${item.type}`)}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium leading-4 tracking-[0.6px] text-[#272727] backdrop-blur-[6px]">
            {t(`myCompetitions.categories.${item.category}`)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 pb-2">
          <h2 className="min-w-0 text-[22px] font-semibold leading-[25px] text-[#161c27] sm:text-[28px]">
            {t(item.titleKey)}
          </h2>
          <button
            type="button"
            aria-label={t('myCompetitions.share')}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center pb-1.5"
          >
            <img
              src={MY_COMPETITIONS_ASSETS.share}
              alt=""
              width={18}
              height={20}
              className="h-5 w-[18px] object-contain"
            />
          </button>
        </div>

        <p className="line-clamp-2 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t(item.descriptionKey)}
        </p>

        <div className="pb-4 pt-1">
          <div
            className={`flex border-y border-[rgba(203,195,213,0.1)] py-[13px] ${
              item.endsOnly ? 'justify-end' : 'items-center justify-between'
            }`}
          >
            {!item.endsOnly ? (
              <>
                <div className="flex flex-col items-center">
                  <p className="text-[12px] font-medium uppercase leading-4 tracking-[-0.6px] text-[#494453]">
                    {t('myCompetitions.metrics.votes')}
                  </p>
                  <p className="text-[16px] font-bold leading-6 text-[#532aa8]">
                    {item.votes ?? t('myCompetitions.metrics.na')}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-[12px] font-medium uppercase leading-4 tracking-[-0.6px] text-[#494453]">
                    {t('myCompetitions.metrics.position')}
                  </p>
                  <p className="text-[16px] font-bold leading-6 text-[#532aa8]">
                    {item.position ?? t('myCompetitions.metrics.na')}
                  </p>
                </div>
              </>
            ) : null}
            <div className="flex flex-col items-center">
              <p className="text-[12px] font-medium uppercase leading-4 tracking-[-0.6px] text-[#494453]">
                {t('myCompetitions.metrics.endsDate')}
              </p>
              <p className="text-[16px] font-bold leading-6 text-[#855300]">
                {t(item.endsKey)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="whitespace-pre-line text-[12px] font-medium leading-4 tracking-[0.6px] text-[#494453]">
            {t(item.submittedKey)}
          </p>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-3 text-[16px] leading-6 text-[#532aa8] transition hover:text-[#4048cd]"
          >
            <span className="whitespace-pre-line text-center">
              {t('myCompetitions.viewDetails')}
            </span>
            <img
              src={MY_COMPETITIONS_ASSETS.arrowRight}
              alt=""
              width={11}
              height={11}
              className="size-[11px] shrink-0 object-contain"
            />
          </button>
        </div>
      </div>
    </article>
  );
});

SubmissionCard.displayName = 'SubmissionCard';

const MyCompetitionsContent = memo(() => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusOpen, setStatusOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MY_COMPETITION_SUBMISSIONS.filter((item) => {
      const statusOk = statusFilter === 'all' || item.status === statusFilter;
      const categoryOk = categoryFilter === 'all' || item.category === categoryFilter;
      return statusOk && categoryOk;
    });
  }, [statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleStatusSelect = (value) => {
    setStatusFilter(value);
    setStatusOpen(false);
    setPage(1);
  };

  const handleCategorySelect = (value) => {
    setCategoryFilter(value);
    setCategoryOpen(false);
    setPage(1);
  };

  const pageButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
            {t('myCompetitions.title')}
          </h1>
          <p className="max-w-[960px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myCompetitions.subtitle')}
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_UPLOAD_PHOTOS}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[16px] leading-6 text-white shadow-sm transition hover:bg-[#d41921]"
        >
          <img
            src={MY_COMPETITIONS_ASSETS.plus}
            alt=""
            width={12}
            height={12}
            className="size-[12px] shrink-0 object-contain"
          />
          {t('myCompetitions.newEntry')}
        </Link>
      </header>

      <section
        aria-label={t('myCompetitions.stats.aria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
      >
        {MY_COMPETITION_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            labelKey={stat.labelKey}
            value={stat.value}
            hintKey={stat.hintKey}
            showAward={stat.showAward}
          />
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-1 flex items-center gap-2">
          <img
            src={MY_COMPETITIONS_ASSETS.filter}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0 object-contain"
          />
          <span className="text-[14px] font-medium leading-5 text-[#4c4c4c]">
            {t('myCompetitions.filtersLabel')}
          </span>
        </div>
        <FilterSelect
          label={t('myCompetitions.statusFilterAria')}
          value={statusFilter}
          options={STATUS_FILTERS}
          open={statusOpen}
          onToggle={() => {
            setStatusOpen((open) => !open);
            setCategoryOpen(false);
          }}
          onSelect={handleStatusSelect}
          optionKeyPrefix="myCompetitions.statusOptions"
        />
        <FilterSelect
          label={t('myCompetitions.categoryFilterAria')}
          value={categoryFilter}
          options={CATEGORY_FILTERS}
          open={categoryOpen}
          onToggle={() => {
            setCategoryOpen((open) => !open);
            setStatusOpen(false);
          }}
          onSelect={handleCategorySelect}
          optionKeyPrefix="myCompetitions.categoryOptions"
        />
      </div>

      <section
        aria-label={t('myCompetitions.submissionsAria')}
        className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-[42px]"
      >
        {pageItems.map((item) => (
          <SubmissionCard key={item.id} item={item} />
        ))}
      </section>

      {pageItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('myCompetitions.empty')}
        </p>
      ) : null}

      <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] font-medium leading-4 tracking-[0.6px] text-[#494453]">
          {t('myCompetitions.showing', {
            count: pageItems.length,
            total: filtered.length,
          })}
        </p>
        <nav
          aria-label={t('myCompetitions.paginationAria')}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            aria-label={t('myCompetitions.prevPage')}
            disabled={safePage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#cbc3d5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img
              src={MY_COMPETITIONS_ASSETS.chevronLeft}
              alt=""
              width={8}
              height={12}
              className="h-3 w-[8px] object-contain"
            />
          </button>
          {pageButtons.map((pageNumber) => {
            const active = pageNumber === safePage;
            return (
              <button
                key={pageNumber}
                type="button"
                aria-label={t('myCompetitions.pageNumber', { page: pageNumber })}
                aria-current={active ? 'page' : undefined}
                onClick={() => setPage(pageNumber)}
                className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-[16px] leading-6 transition ${
                  active
                    ? 'bg-[#ee1c25] font-bold text-white'
                    : 'border border-[#cbc3d5] text-[#161c27] hover:bg-white'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            aria-label={t('myCompetitions.nextPage')}
            disabled={safePage >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#cbc3d5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img
              src={MY_COMPETITIONS_ASSETS.chevronRight}
              alt=""
              width={8}
              height={12}
              className="h-3 w-[8px] object-contain"
            />
          </button>
        </nav>
      </footer>
    </div>
  );
});

MyCompetitionsContent.displayName = 'MyCompetitionsContent';

export default MyCompetitionsContent;
