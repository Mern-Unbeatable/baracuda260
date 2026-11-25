import React, { memo } from 'react';
import { cn } from '@/shared/utils/cn';

const EYEBROW_CLASS =
  'text-[11px] font-extrabold uppercase leading-4 tracking-[1.2px] text-[#7f8ba1] sm:text-[12px] sm:tracking-[1.4px]';
const TITLE_CLASS =
  'font-manrope text-[24px] font-semibold leading-tight tracking-tight text-[#151e31] sm:text-[28px] lg:text-[30px] lg:leading-9';
const DESCRIPTION_CLASS =
  'max-w-3xl text-[13px] leading-5 text-[#687186] sm:text-[14px] sm:leading-6';

const TITLE_AFTER_EYEBROW_SPACING = 'pt-1.5 sm:pt-2.5';
const DESCRIPTION_SPACING = 'pt-1.5 sm:pt-2.5';

/**
 * Shared admin page chrome: eyebrow (badge), title, description — one typography scale app-wide.
 *
 * @param {{
 *   eyebrow?: React.ReactNode,
 *   title: React.ReactNode,
 *   description?: React.ReactNode,
 *   as?: 'header' | 'div',
 *   titleId?: string,
 *   className?: string,
 *   titleClassName?: string,
 *   descriptionClassName?: string,
 * }} props
 */
const AdminPageHeader = memo(
  ({
    eyebrow,
    title,
    description,
    as: Tag = 'header',
    titleId,
    className,
    titleClassName,
    descriptionClassName,
  }) => {
    const hasEyebrow = eyebrow != null && eyebrow !== '';

    return (
      <Tag className={cn('flex flex-col', className)}>
        {hasEyebrow ? <p className={EYEBROW_CLASS}>{eyebrow}</p> : null}
        <h1
          id={titleId}
          className={cn(
            TITLE_CLASS,
            hasEyebrow ? TITLE_AFTER_EYEBROW_SPACING : '',
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description != null && description !== '' ? (
          <p
            className={cn(
              DESCRIPTION_CLASS,
              DESCRIPTION_SPACING,
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </Tag>
    );
  },
);

AdminPageHeader.displayName = 'AdminPageHeader';

export default AdminPageHeader;
