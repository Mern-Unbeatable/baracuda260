import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * Full-viewport mobile filters drawer, portaled to document.body so it
 * sits above the fixed site chrome (announcement + header).
 */
const MobileFiltersDrawer = memo(
  ({
    open,
    onClose,
    id,
    title,
    closeLabel = 'Close filters',
    children,
    footer,
  }) => {
    useEffect(() => {
      if (!open) return undefined;
      const onKeyDown = (event) => {
        if (event.key === 'Escape') onClose?.();
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        id={id}
        aria-label={title}
        className="fixed inset-0 z-[200] flex lg:hidden"
      >
        <button
          type="button"
          aria-label={closeLabel}
          className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          onClick={onClose}
        />
        <aside className="relative ml-auto flex h-dvh max-h-dvh w-full max-w-xs flex-col bg-white shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="text-[18px] font-semibold text-[#111827]">{title}</h2>
            <Button
              unstyled
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6]"
            >
              <X size={20} aria-hidden="true" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            {children}
          </div>
          {footer ? (
            <div className="shrink-0 border-t border-[#e5e7eb] px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          ) : null}
        </aside>
      </div>,
      document.body,
    );
  },
);

MobileFiltersDrawer.displayName = 'MobileFiltersDrawer';

export default MobileFiltersDrawer;
