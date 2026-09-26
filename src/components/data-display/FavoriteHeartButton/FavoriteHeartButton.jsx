import { Heart } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';

const parseVotes = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatVotes = (n) => n.toLocaleString('en-US');

import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';

/**
 * Heart control for gallery / showcase cards — toggles favorite without navigating.
 */
const FavoriteHeartButton = memo(
  ({ initialVotes = '0', title = '', photographer = '', userId = '' }) => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const baseVotes = parseVotes(initialVotes);
    const [favorited, setFavorited] = useState(false);

    // Heuristic to check if this is the user's own photo
    const isOwnSubmission = Boolean(
      user &&
        (user.id === userId ||
          (user.firstName &&
            photographer
              ?.toLowerCase()
              .includes(user.firstName.toLowerCase())) ||
          (user.username &&
            photographer?.toLowerCase().includes(user.username.toLowerCase()))),
    );

    const displayVotes = favorited ? baseVotes + 1 : baseVotes;

    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isOwnSubmission) return;
      setFavorited((prev) => !prev);
    };

    return (
      <Button
        unstyled
        type="button"
        onClick={handleClick}
        aria-pressed={favorited}
        disabled={isOwnSubmission}
        title={isOwnSubmission ? t('galleryDetail.cannotVoteOwn') : undefined}
        aria-label={
          favorited
            ? t('gallery.unfavorite', {
                title,
                defaultValue: `Unfavorite ${title}`,
              })
            : t('gallery.favorite', {
                title,
                defaultValue: `Favorite ${title}`,
              })
        }
        className={`inline-flex items-center gap-1.5 rounded-md text-[14px] text-[#6b7280] transition ${isOwnSubmission ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-[#e53935]'}`}
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
      </Button>
    );
  },
);

FavoriteHeartButton.displayName = 'FavoriteHeartButton';

export default FavoriteHeartButton;
