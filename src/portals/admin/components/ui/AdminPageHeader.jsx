import React, { memo } from 'react';

const EYEBROW_CLASS =
  'text-[14px] font-extrabold uppercase leading-[19px] tracking-[1.55px] text-[#7f8ba1]';
const TITLE_CLASS =
  'font-manrope text-[36px] font-normal leading-[42px] tracking-[-1.68px] text-[#151e31]';
const DESCRIPTION_CLASS = 'text-[16px] leading-[25px] text-[#687186]';

const TITLE_AFTER_EYEBROW_SPACING = 'pt-1.5 sm:pt-3';
const DESCRIPTION_SPACING = 'pt-1.5 sm:pt-3';

/**
 * Shared admin page chrome: eyebrow (badge), title, description — one typography scale app-wide.
 *
 * @param {{
 *   eyebrow?: React.ReactNode,
 *   title: React.ReactNode,
 *   description?: React.ReactNode,
 *   as?: 'header' | 'div',
 *   titleId?: string,
 * }} props
 */
const AdminPageHeader = memo(({ eyebrow, title, description, as: Tag = 'header', titleId }) => {
  const hasEyebrow = eyebrow != null && eyebrow !== '';

  return (
    <Tag className="flex flex-col">
      {hasEyebrow ? <p className={EYEBROW_CLASS}>{eyebrow}</p> : null}
      <h1
        id={titleId}
        className={`${TITLE_CLASS} ${hasEyebrow ? TITLE_AFTER_EYEBROW_SPACING : ''}`.trim()}
      >
        {title}
      </h1>
      {description != null && description !== '' ? (
        <p className={`${DESCRIPTION_CLASS} ${DESCRIPTION_SPACING}`.trim()}>{description}</p>
      ) : null}
    </Tag>
  );
});

AdminPageHeader.displayName = 'AdminPageHeader';

export default AdminPageHeader;
