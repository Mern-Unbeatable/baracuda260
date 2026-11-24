import React, { memo } from 'react';
import { cn } from '@/shared/utils/cn';

const EYEBROW_CLASS =
  'text-[12px] font-extrabold uppercase leading-4 tracking-[1.2px] text-[#7f8ba1] sm:text-[13px] sm:tracking-[1.4px] lg:text-[14px] lg:tracking-[1.55px]';
const TITLE_CLASS =
  'font-manrope text-[28px] font-semibold leading-tight tracking-[-0.96px] text-[#151e31] sm:text-[32px] sm:tracking-[-1.2px] lg:text-[36px] lg:leading-[42px] lg:tracking-[-1.68px]';
const DESCRIPTION_CLASS =
  'text-[14px] leading-6 text-[#687186] sm:text-[15px] lg:text-[16px] lg:leading-[25px]';

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
