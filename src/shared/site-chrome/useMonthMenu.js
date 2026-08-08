import { useEffect, useRef, useState } from 'react';

/**
 * Shared month dropdown open/close with outside-click + Escape cleanup.
 */
export default function useMonthMenu(initialMonth = 'July') {
  const [month, setMonth] = useState(initialMonth);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
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

  return { month, setMonth, open, setOpen, ref };
}
