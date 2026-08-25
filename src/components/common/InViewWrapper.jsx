import React, { useEffect, useRef, useState } from 'react';

const InViewWrapper = ({ children, className = '', rootMargin = '0px 0px -10% 0px', threshold = 0.12 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { root: null, rootMargin, threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, threshold]);

  const classes = [
    'transition-all duration-700 ease-out',
    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    className,
  ].join(' ');

  // support render-prop so consumers can receive the inView boolean
  if (typeof children === 'function') {
    return (
      <div ref={ref} className={classes}>
        {children(inView)}
      </div>
    );
  }

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
};

export default InViewWrapper;

