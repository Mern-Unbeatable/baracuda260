import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Store } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberStoreProductCard from '@/components/data-display/MemberStoreProductCard/MemberStoreProductCard';
import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel';
import {
  MY_STORE_CATEGORIES,
  MY_STORE_PAGE_SIZE,
  MY_STORE_PRODUCTS,
  filterStoreProducts,
} from '@/portals/member/data/myStoreData';

const MyStoreContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState(MY_STORE_PRODUCTS);
  const [promoteItem, setPromoteItem] = useState(null);

  const filtered = useMemo(() => filterStoreProducts(products, category), [products, category]);
  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(filtered, MY_STORE_PAGE_SIZE, [
    category,
  ]);

  const handleEdit = (product) => {
    navigate(ROUTES.ADMIN_MY_STORE_EDIT.replace(':id', product.id));
  };

  const handleDelete = (product) => {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    toast.success(t('myStore.toast.deleted', { title: product.title }));
  };

  const handlePromoteConfirm = (item) => {
    setProducts((current) =>
      current.map((product) => (product.id === item.id ? { ...product, promoted: true } : product)),
    );
    toast.success(t('myStore.toast.promoted', { title: item.title }));
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-7">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Store size={26} className="shrink-0 text-[#161c27]" aria-hidden="true" />
            <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
              {t('myStore.title')}
            </h1>
          </div>
          <p className="mt-2 max-w-180 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myStore.subtitle')}
          </p>
        </div>

        <Link
          to={ROUTES.ADMIN_MY_STORE_UPLOAD}
          className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[15px] font-bold text-white transition hover:bg-[#d41921] sm:text-[16px]"
        >
          <Plus size={18} aria-hidden="true" />
          {t('myStore.uploadProduct')}
        </Link>
      </header>

      <div
        role="tablist"
        aria-label={t('myStore.filters.aria')}
        className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
      >
        {MY_STORE_CATEGORIES.map((item) => {
          const active = category === item.value;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(item.value)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition sm:text-[14px] ${
                active
                  ? 'bg-[#4048cd] text-white shadow-sm'
                  : 'border border-[#e4e4e4] bg-white text-[#5d687b] hover:border-[#d5d8e8] hover:text-[#161c27]'
              }`}
            >
              {t(item.labelKey)}
            </button>
          );
        })}
      </div>

      {pagedItems.length === 0 ? (
        <p className="rounded-[14px] border border-dashed border-[#e4e4e4] bg-white px-6 py-12 text-center text-[16px] text-[#687186]">
          {t('myStore.empty')}
        </p>
      ) : (
        <section
          aria-label={t('myStore.gridAria')}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {pagedItems.map((product) => (
            <MemberStoreProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
              onPromote={() => setPromoteItem(product)}
            />
          ))}
        </section>
      )}

      {filtered.length > 0 ? (
        <footer className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('myStore.paginationAria')}
          />
        </footer>
      ) : null}

      <MemberPromotePanel
        item={promoteItem}
        open={Boolean(promoteItem)}
        onClose={() => setPromoteItem(null)}
        onConfirm={handlePromoteConfirm}
      />
    </div>
  );
});

MyStoreContent.displayName = 'MyStoreContent';

export default MyStoreContent;
