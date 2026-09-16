import { useTranslation } from 'react-i18next';
import React, { memo, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import PortalDropdown from '@/components/common/PortalDropdown/PortalDropdown';

const MemberArtworkActionsMenu = memo(({ item, onEdit, onDelete, onPromote }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const buttonWrapRef = useRef(null);
  const buttonRef = useRef(null);

  const handleAction = (action) => {
    setOpen(false);
    action();
  };

  return (
    <div className="absolute right-3 top-3" ref={buttonWrapRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('myArtwork.card.options')}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#0d0d14] shadow-sm transition hover:bg-white"
      >
        <MoreVertical size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      <PortalDropdown
        open={open}
        onClose={() => setOpen(false)}
        buttonRef={buttonRef}
        buttonWrapRef={buttonWrapRef}
        width={144}
        aria-label={t('myArtwork.actions.menuAria')}
        className="overflow-hidden rounded-[10px] border border-black/10 bg-white py-1 shadow-lg"
      >
        {[
          { key: 'edit', labelKey: 'myArtwork.actions.edit', action: () => onEdit?.(item) },
          { key: 'delete', labelKey: 'myArtwork.actions.delete', action: () => onDelete?.(item) },
          { key: 'promote', labelKey: 'myArtwork.actions.promote', action: () => onPromote?.(item) },
        ].map(({ key, labelKey, action }) => (
          <button
            key={key}
            type="button"
            role="menuitem"
            onClick={() => handleAction(action)}
            className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] font-medium text-[#1c1c1c] transition hover:bg-[#fde8e9] hover:text-[#ee1c25]"
          >
            {t(labelKey)}
          </button>
        ))}
      </PortalDropdown>
    </div>
  );
});

MemberArtworkActionsMenu.displayName = 'MemberArtworkActionsMenu';

export default MemberArtworkActionsMenu;
