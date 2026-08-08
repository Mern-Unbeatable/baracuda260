import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

const parseVotes = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatVotes = (n) => n.toLocaleString('en-US');

/**
 * Heart control for gallery / showcase cards — toggles favorite without navigating.
 */
const FavoriteHeartButton = memo(({ initialVotes = '0', title = '' }) => {
  const { t } = useTranslation();
  const baseVotes = parseVotes(initialVotes);
  const [favorited, setFavorited] = useState(false);

  const displayVotes = favorited ? baseVotes + 1 : baseVotes;

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFavorited((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={favorited}
      aria-label={
        favorited
          ? t('gallery.unfavorite', { title, defaultValue: `Unfavorite ${title}` })
          : t('gallery.favorite', { title, defaultValue: `Favorite ${title}` })
      }
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-[14px] text-[#6b7280] transition hover:text-[#e53935]"
    >
      <Heart
        size={22}
        strokeWidth={2}
        aria-hidden="true"
        className={
          favorited
            ? 'fill-[#e53935] text-[#e53935]'
            : 'fill-transparent text-[#e53935]'
        }
      />
      <span>{formatVotes(displayVotes)}</span>
    </button>
  );
});

FavoriteHeartButton.displayName = 'FavoriteHeartButton';

export default FavoriteHeartButton;
