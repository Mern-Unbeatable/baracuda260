import React from 'react';

const BADGE_COLOR = {
  red: 'text-[#e31837]',
  indigo: 'text-[#666dd7]',
  brand: 'text-[#4048cd]',
  navy: 'text-[#3f51b5]',
};

/** Shared spacing — change once, applies on every page using SectionHeader. */
const COPY_STACK_GAP = 'gap-2.5';
const TITLE_ROW_GAP = 'gap-4 sm:gap-6';
const HEADER_ROW_GAP = 'gap-4 sm:gap-6';

const badgeClass = (badgeTone) =>
  `text-[12px] font-semibold uppercase leading-4 tracking-[1.2px] sm:text-[14px] ${BADGE_COLOR[badgeTone] ?? BADGE_COLOR.red}`;

const titleClass =
  'text-[26px] font-semibold leading-tight text-(--primary-text-heading-color) sm:text-[36px] sm:leading-[1.15] lg:text-[48px] lg:leading-12';

const descriptionClass =
  'text-[16px] font-normal leading-6 text-(--primary-text-color) sm:text-[18px] sm:leading-6.75 lg:text-[20px] lg:leading-7.25';

function CopyStack({ badge, badgeTone, title, description, align = 'left', className = '' }) {
  const left = align === 'left';
  const stackClass = left
    ? `flex w-full flex-col ${COPY_STACK_GAP} items-start text-left ${className}`.trim()
    : `mx-auto flex w-full max-w-[682px] flex-col ${COPY_STACK_GAP} items-center text-center ${className}`.trim();

  return (
    <div className={stackClass}>
      {badge ? <p className={badgeClass(badgeTone)}>{badge}</p> : null}
      {title ? <h2 className={titleClass}>{title}</h2> : null}
      {description ? <p className={descriptionClass}>{description}</p> : null}
    </div>
  );
}

export default function SectionHeader({
  badge,
  title,
  description,
  badgeTone = 'red',
  align = 'center',
  end = null,
  className = '',
}) {
  const left = align === 'left';
  const rootClass = `w-full ${left ? '' : 'mx-auto'} ${className}`.trim();

  if (end && description) {
    return (
      <header className={rootClass}>
        <div
          className={`flex w-full flex-col ${HEADER_ROW_GAP} sm:flex-row sm:items-start sm:justify-between`.trim()}
        >
          <CopyStack
            badge={badge}
            badgeTone={badgeTone}
            title={title}
            description={description}
            align={align}
            className="min-w-0 max-w-none flex-1"
          />
          <div className={`w-full shrink-0 ${left ? 'sm:w-auto' : 'sm:mx-auto'}`}>{end}</div>
        </div>
      </header>
    );
  }

  if (end) {
    const stackAlign = left ? 'items-start text-left' : 'items-center text-center';

    return (
      <header className={rootClass}>
        <div className={`flex w-full flex-col ${COPY_STACK_GAP} ${stackAlign}`.trim()}>
          {badge ? <p className={badgeClass(badgeTone)}>{badge}</p> : null}
          {title ? (
            <div
              className={`flex w-full flex-col ${TITLE_ROW_GAP} sm:flex-row sm:items-start`.trim()}
            >
              <h2 className={`min-w-0 shrink-0 ${titleClass}`}>{title}</h2>
              <div className="w-full sm:ml-auto sm:max-w-lg sm:flex-1">{end}</div>
            </div>
          ) : (
            <div className={`w-full ${left ? 'sm:ml-auto' : 'mx-auto'}`}>{end}</div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={rootClass}>
      <CopyStack
        badge={badge}
        badgeTone={badgeTone}
        title={title}
        description={description}
        align={align}
      />
    </header>
  );
}
