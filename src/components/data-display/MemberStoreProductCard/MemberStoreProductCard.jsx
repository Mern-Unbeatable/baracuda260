import { Heart, MapPin, MoreVertical } from 'lucide-react';
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  STORE_WATCHLIST_QUERY_KEY,
  toggleWatchlistApi,
} from '@/shared/api/store.api';

const MENU_OFFSET_PX = 6;
const MENU_FALLBACK_HEIGHT_PX = 160;
const MENU_VIEWPORT_MARGIN_PX = 8;
const MENU_WIDTH_PX = 148;

/**
 * @param {{
 *   product: {
 *     id: string,
 *     title: string,
 *     description: string,
 *     price: string,
 *     badgeKey: string,
 *     image: string,
 *     promoted?: boolean,
 *   },
 *   onEdit: () => void,
 *   onDelete: () => void,
 *   onPromote?: () => void,
 * }} props
 */
const MemberStoreProductCard = memo(
  ({ product, onEdit, onDelete, onPromote }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(Boolean(product.isSaved));
    const buttonWrapRef = useRef(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState(null);

    useEffect(() => {
      setIsSaved(Boolean(product.isSaved));
    }, [product.isSaved]);

    const handleWatchlistToggle = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextSaved = !isSaved;
      setIsSaved(nextSaved);
      try {
        await toggleWatchlistApi(product.id);
        queryClient.invalidateQueries({ queryKey: [STORE_WATCHLIST_QUERY_KEY] });
        toast.success(
          nextSaved
            ? t('myStore.watchlist.added', 'Added to Item Watchlist')
            : t('myStore.watchlist.removed', 'Removed from Item Watchlist'),
        );
      } catch {
        setIsSaved(!nextSaved);
        toast.error(t('myStore.watchlist.failed', 'Failed to update watchlist'));
      }
    };

    useLayoutEffect(() => {
      if (!menuOpen || !buttonRef.current) {
        setPlacement(null);
        return undefined;
      }

      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight =
          menuRef.current?.offsetHeight || MENU_FALLBACK_HEIGHT_PX;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < menuHeight + MENU_OFFSET_PX;

        setPlacement({
          right: Math.max(
            MENU_VIEWPORT_MARGIN_PX,
            window.innerWidth - rect.right,
          ),
          ...(openUpward
            ? { bottom: window.innerHeight - rect.top + MENU_OFFSET_PX }
            : { top: rect.bottom + MENU_OFFSET_PX }),
        });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [menuOpen]);

    useEffect(() => {
      if (!menuOpen) return undefined;

      const handlePointerDown = (event) => {
        const inButton = buttonWrapRef.current?.contains(event.target);
        const inMenu = menuRef.current?.contains(event.target);
        if (!inButton && !inMenu) setMenuOpen(false);
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') setMenuOpen(false);
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [menuOpen]);

    const menu = menuOpen
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={t('myStore.actions.menu', { title: product.title })}
            style={{
              position: 'fixed',
              zIndex: 50,
              width: MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-[10px] border border-[#e4e4e4] bg-white p-1.5 shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <p className="px-2.5 pb-1 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9aa3b5]">
              {t('myStore.actions.label')}
            </p>
            <Button
              unstyled
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="mb-1 w-full cursor-pointer rounded-lg bg-[#4048cd] px-3 py-2 text-left text-[14px] font-semibold text-white transition hover:bg-[#353cb0]"
            >
              {t('myStore.actions.edit')}
            </Button>
            {onPromote ? (
              <Button
                unstyled
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onPromote();
                }}
                className="mb-1 w-full cursor-pointer rounded-lg border border-[#e8ebf1] bg-white px-3 py-2 text-left text-[14px] font-semibold text-[#161c27] transition hover:bg-[#f6f7f9]"
              >
                {t('myStore.actions.promote')}
              </Button>
            ) : null}
            <Button
              unstyled
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onDelete();
              }}
              className="w-full cursor-pointer rounded-lg border border-[#fde8e9] bg-white px-3 py-2 text-left text-[14px] font-semibold text-[#ee1c25] transition hover:bg-[#fde8e9]"
            >
              {t('myStore.actions.delete')}
            </Button>
          </div>,
          document.body,
        )
      : null;

    return (
      <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#eceef3] bg-white shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
          <Image
            src={product.image}
            alt={product.title}
            width={368}
            height={252}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
          <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-3.5rem)] items-center rounded-md bg-[#3a3f4b]/88 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.35px] text-white backdrop-blur-[2px]">
            {t(product.badgeKey, product.category || 'Product')}
          </span>

          {product.promoted ? (
            <span className="absolute bottom-3 left-3 rounded-md bg-[#ee1c25] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
              {t('myStore.promoted')}
            </span>
          ) : null}

          <div className="absolute right-3 top-3 flex items-center gap-1.5" ref={buttonWrapRef}>
            <Button
              unstyled
              type="button"
              onClick={handleWatchlistToggle}
              aria-label={t('myStore.watchlist.toggle', 'Save to Watchlist')}
              aria-pressed={isSaved}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#161c27] shadow-sm backdrop-blur-[2px] transition hover:bg-white"
            >
              <Heart
                size={16}
                strokeWidth={2}
                className={
                  isSaved
                    ? 'fill-[#e53935] text-[#e53935]'
                    : 'fill-transparent text-[#161c27] hover:text-[#e53935]'
                }
              />
            </Button>
            {onEdit || onDelete ? (
              <Button
                unstyled
                ref={buttonRef}
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label={t('myStore.actions.menu', { title: product.title })}
                onClick={() => setMenuOpen((open) => !open)}
                className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] transition hover:bg-black/60 ${
                  menuOpen ? 'bg-black/60' : ''
                }`}
              >
                <MoreVertical size={16} strokeWidth={2.5} aria-hidden="true" />
              </Button>
            ) : null}
            {menu}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-5 text-[#0d0d14] sm:text-[16px]">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-[13px] leading-5 text-[#6b7280]">
            {product.description}
          </p>

          {/* Location & Shipping Scope */}
          {(product.city || product.country || product.shippingScope) ? (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#6b7280]">
              {(product.city || product.country) ? (
                <span className="inline-flex items-center gap-1 text-[#4b5563]">
                  <MapPin size={12} className="text-[#9ca3af]" />
                  {[product.city, product.country].filter(Boolean).join(', ')}
                </span>
              ) : null}
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                product.shippingScope === 'NATIONAL'
                  ? 'bg-[#fff7ed] text-[#c2410c]'
                  : 'bg-[#ecfdf5] text-[#047857]'
              }`}>
                {product.shippingScope === 'NATIONAL'
                  ? t('myStore.shipping.nationalOnly', 'Domestic Only')
                  : t('myStore.shipping.worldwide', 'Worldwide')}
              </span>
            </div>
          ) : null}

          <p className="mt-auto pt-2 text-[16px] font-bold leading-none text-[#0d0d14]">
            {product.price}
          </p>
        </div>
      </article>
    );
  },
);

MemberStoreProductCard.displayName = 'MemberStoreProductCard';

export default MemberStoreProductCard;
