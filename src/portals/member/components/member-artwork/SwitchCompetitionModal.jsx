import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle, Loader2, Sparkles, Trophy, X } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getActiveCompetitionsApi } from '@/shared/api/competitions.api';

const DEFAULT_ACTIVE_COMPETITIONS = [
  {
    id: 'comp-oct-2026',
    title: 'October 2026 Competition',
    status: 'OPEN',
    prize: '$1,500.00',
    endsAt: '2026-10-31',
  },
  {
    id: 'comp-zodiac-2026',
    title: 'Zodiac Story Master Showcase',
    status: 'OPEN',
    prize: '$3,500.00',
    endsAt: '2026-11-15',
  },
  {
    id: 'comp-autumn-2026',
    title: 'Global Single Photo Contest',
    status: 'OPEN',
    prize: '$2,500.00',
    endsAt: '2026-11-30',
  },
];

const SwitchCompetitionModal = memo(
  ({ artwork, onClose, onConfirm, isLoading }) => {
    const { t } = useTranslation();
    const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
    const [customId, setCustomId] = useState('');
    const [useCustom, setUseCustom] = useState(false);
    const [error, setError] = useState('');

    const { data: apiCompetitions = [], isLoading: isLoadingComps } = useQuery({
      queryKey: ['competitions', 'active-list'],
      queryFn: () => getActiveCompetitionsApi(),
      staleTime: 60 * 1000,
    });

    const competitions =
      apiCompetitions.length > 0
        ? apiCompetitions
        : DEFAULT_ACTIVE_COMPETITIONS;

    useEffect(() => {
      if (competitions.length > 0 && !selectedCompetitionId) {
        setSelectedCompetitionId(competitions[0].id);
      }
    }, [competitions, selectedCompetitionId]);

    useEffect(() => {
      setError('');
    }, [artwork]);

    if (!artwork) return null;

    const isResubmit =
      artwork?.footerState === 'ended' ||
      String(artwork?.competitionState || '').toUpperCase() === 'ENDED';

    const handleSubmit = (e) => {
      e.preventDefault();
      const finalId = useCustom
        ? customId.trim()
        : selectedCompetitionId.trim();

      if (!finalId) {
        setError(
          t(
            'myArtwork.switchCompetition.selectRequired',
            'Please select or provide a competition ID.',
          ),
        );
        return;
      }

      setError('');
      onConfirm({
        artworkId: artwork.id,
        competitionId: finalId,
        newCompetitionId: finalId,
        isResubmit,
      });
    };

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={isLoading ? undefined : onClose}
        />
        <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all my-8">
          {/* Header */}
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
                        'Choose a new active competition to resubmit this artwork for voting.',
                      )
                    : t(
                        'myArtwork.switchCompetition.modalSubtitle',
                        'Switch this artwork to active competition for community voting.',
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
            {/* Artwork Preview Card */}
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

            {/* Competition Selection */}
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                {t(
                  'myArtwork.switchCompetition.selectLabel',
                  'Select Active Competition',
                )}
              </label>

              {!useCustom ? (
                <div className="mt-2 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {isLoadingComps ? (
                    <div className="flex items-center justify-center py-6 text-gray-400">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                  ) : (
                    competitions.map((comp) => {
                      const isSelected = selectedCompetitionId === comp.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => setSelectedCompetitionId(comp.id)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? 'border-[#4048cd] bg-[#ecedfa]/30 ring-2 ring-[#4048cd]/20'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex size-5 items-center justify-center rounded-full border ${
                                isSelected
                                  ? 'border-[#4048cd] bg-[#4048cd] text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isSelected ? (
                                <CheckCircle size={14} className="stroke-2" />
                              ) : null}
                            </span>
                            <div>
                              <p className="text-[14px] font-semibold text-[#111827]">
                                {comp.title}
                              </p>
                              {comp.endsAt ? (
                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                                  <Calendar size={12} />
                                  Ends: {comp.endsAt}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {comp.prize ? (
                            <span className="rounded-lg bg-[#ecfdf3] px-2 py-1 text-[11px] font-bold text-[#166534]">
                              {comp.prize}
                            </span>
                          ) : null}
                        </button>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    placeholder="e.g. comp-140767d3-fa6b-4cdc-ab25-f1ccffd436c2"
                    className="w-full rounded-xl border border-gray-200 bg-[#fafaff] px-3.5 py-2.5 text-[14px] text-[#111827] outline-none focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/20"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="mt-2 text-[12px] font-medium text-[#4048cd] hover:underline"
              >
                {useCustom
                  ? '← Choose from active competitions list'
                  : 'Or specify custom Competition ID'}
              </button>
            </div>

            {error ? (
              <p className="text-xs font-medium text-red-500">{error}</p>
            ) : null}

            {/* Footer actions */}
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
                disabled={isLoading}
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
                  : t('myArtwork.switchCompetition.submit', 'Enter Competition')}
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
