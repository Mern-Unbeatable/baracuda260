import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

const MemberArtworkActionsMenu = memo(({ item, onEdit, onDelete, onPromote }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleAction = (action) => {
    setOpen(false);
    action();
  };

  return (
    <div className="absolute right-3 top-3" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('myArtwork.card.options')}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#0d0d14] shadow-sm transition hover:bg-white"
      >
        <MoreVertical size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      {open ? (
        <ul
          role="menu"
          aria-label={t('myArtwork.actions.menuAria')}
          className="absolute right-0 top-full z-30 mt-1 min-w-36 overflow-hidden rounded-[10px] border border-black/10 bg-white py-1 shadow-lg"
        >
          {[
            { key: 'edit', labelKey: 'myArtwork.actions.edit', action: () => onEdit?.(item) },
            { key: 'delete', labelKey: 'myArtwork.actions.delete', action: () => onDelete?.(item) },
            { key: 'promote', labelKey: 'myArtwork.actions.promote', action: () => onPromote?.(item) },
          ].map(({ key, labelKey, action }) => (
            <li key={key} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(action)}
                className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] font-medium text-[#1c1c1c] transition hover:bg-[#fde8e9] hover:text-[#ee1c25]"
              >
                {t(labelKey)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

MemberArtworkActionsMenu.displayName = 'MemberArtworkActionsMenu';

export default MemberArtworkActionsMenu;
