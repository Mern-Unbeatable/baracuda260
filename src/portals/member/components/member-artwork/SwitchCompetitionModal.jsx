import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Loader2,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getActiveCompetitionsApi } from '@/shared/api/competitions.api';

const SwitchCompetitionModal = memo(
  ({ artwork, onClose, onConfirm, isLoading }) => {
    const { t } = useTranslation();
    const [error, setError] = useState('');

    const { data: apiCompetitions = [], isLoading: isLoadingComps } = useQuery({
      queryKey: ['competitions', 'active-list'],
      queryFn: () => getActiveCompetitionsApi(),
      staleTime: 60 * 1000,
    });

    // Backend always joins the current OPEN competition for this month
    const activeCompetition = apiCompetitions[0] || null;

    useEffect(() => {
      setError('');
    }, [artwork]);

    if (!artwork) return null;

    const isResubmit =
      artwork?.footerState === 'ended' ||
      String(artwork?.competitionState || '').toUpperCase() === 'ENDED';

    const handleSubmit = (e) => {
      e.preventDefault();
      // Backend auto-resolves / auto-starts the current month's OPEN competition
      setError('');
      onConfirm({
        artworkId: artwork.id,
        isResubmit,
      });
    };

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={isLoading ? undefined : onClose}
        />
        <div className="relative z-10 my-8 w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#fef3c7] text-[#b45309]">
                <Trophy size={18} />
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">
                  {isResubmit
                    ? t(
                        'myArtwork.switchCompetition.modalResubmitTitle',
                        'Resubmit Artwork into Competition',
                      )
                    : t(
                        'myArtwork.switchCompetition.modalTitle',
                        'Enter Artwork into Competition',
                      )}
                </h2>
                <p className="text-[12px] text-gray-500">
                  {isResubmit
                    ? t(
                        'myArtwork.switchCompetition.modalResubmitSubtitle',
                        'This artwork will rejoin this month’s competition. A new month starts automatically on the 1st.',
                      )
                    : t(
                        'myArtwork.switchCompetition.modalSubtitle',
                        'This artwork will enter this month’s competition. A new month starts automatically on the 1st.',
                      )}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-[#fafaff] p-3">
              {artwork.image ? (
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="size-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-400">
                  <Sparkles size={20} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#111827]">
                  {artwork.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-gray-500">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">
                    {artwork.albumBadge || artwork.kind || 'Artwork'}
                  </span>
                  <span>{artwork.category}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-semibold text-[#374151]">
                {t(
                  'myArtwork.switchCompetition.currentLabel',
                  'Current monthly competition',
                )}
              </p>

              <div className="mt-2">
                {isLoadingComps ? (
                  <div className="flex items-center justify-center py-6 text-gray-400">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                ) : activeCompetition ? (
                  <div className="rounded-xl border border-[#4048cd] bg-[#ecedfa]/30 p-3 ring-2 ring-[#4048cd]/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#111827]">
                          {activeCompetition.title}
                        </p>
                        <p className="mt-1 text-[12px] leading-5 text-[#494453]">
                          {t(
                            'myArtwork.switchCompetition.currentHint',
                            'Voting continues with the competition as it is currently progressing. No other competition can be chosen.',
                          )}
                        </p>
                        {activeCompetition.endsAt ? (
                          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-500">
                            <Calendar size={12} />
                            Ends: {activeCompetition.endsAt}
                          </p>
                        ) : null}
                      </div>
                      {activeCompetition.prize ? (
                        <span className="shrink-0 rounded-lg bg-[#ecfdf3] px-2 py-1 text-[11px] font-bold text-[#166534]">
                          {activeCompetition.prize}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] text-amber-800">
                    {t(
                      'myArtwork.switchCompetition.noActive',
                      'No open competition was found yet. Confirming will start this month’s competition automatically if needed.',
                    )}
                  </div>
                )}
              </div>
            </div>

            {error ? (
              <p className="text-xs font-medium text-red-500">{error}</p>
            ) : null}

            <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-gray-100 pt-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading || isLoadingComps}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4048cd] px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-[#333bb0] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trophy size={16} />
                )}
                {isResubmit
                  ? t(
                      'myArtwork.switchCompetition.resubmitAction',
                      'Resubmit to Competition',
                    )
                  : t(
                      'myArtwork.switchCompetition.submit',
                      'Enter Competition',
                    )}
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );
  },
);

SwitchCompetitionModal.displayName = 'SwitchCompetitionModal';

export default SwitchCompetitionModal;
