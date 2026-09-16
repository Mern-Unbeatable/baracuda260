import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MENU_OFFSET_PX = 6;
const MENU_FALLBACK_HEIGHT_PX = 160;
const VIEWPORT_MARGIN_PX = 8;

/**
 * Fixed, body-ported dropdown anchored to a trigger button.
 * Use for table/card action menus so overflow containers cannot clip or expand layout.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   buttonRef: React.RefObject<HTMLElement | null>,
 *   buttonWrapRef?: React.RefObject<HTMLElement | null>,
 *   width?: number | string,
 *   className?: string,
 *   role?: string,
 *   'aria-label'?: string,
 *   children: React.ReactNode,
 * }} props
 */
const PortalDropdown = memo(
  ({
    open,
    onClose,
    buttonRef,
    buttonWrapRef,
    width = 168,
    className = '',
    role = 'menu',
    'aria-label': ariaLabel,
    children,
  }) => {
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState(null);

    useLayoutEffect(() => {
      if (!open || !buttonRef?.current) {
        setPlacement(null);
        return undefined;
      }

      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight || MENU_FALLBACK_HEIGHT_PX;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < menuHeight + MENU_OFFSET_PX;

        setPlacement({
          right: Math.max(VIEWPORT_MARGIN_PX, window.innerWidth - rect.right),
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
    }, [open, buttonRef]);

    useEffect(() => {
      if (!open) return undefined;

      const handlePointerDown = (event) => {
        const inButton = buttonWrapRef?.current?.contains(event.target) || buttonRef?.current?.contains(event.target);
        const inMenu = menuRef.current?.contains(event.target);
        if (!inButton && !inMenu) onClose();
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') onClose();
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose, buttonRef, buttonWrapRef]);

    if (!open) return null;

    return createPortal(
      <div
        ref={menuRef}
        role={role}
        aria-label={ariaLabel}
        style={{
          position: 'fixed',
          zIndex: 50,
          width,
          visibility: placement ? 'visible' : 'hidden',
          ...placement,
        }}
        className={className}
      >
        {children}
      </div>,
      document.body,
    );
  },
);

PortalDropdown.displayName = 'PortalDropdown';

export default PortalDropdown;
