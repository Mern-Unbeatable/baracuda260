import React, { memo, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_SUPPORT_ASSETS,
  ANSWER_MODAL_MODE,
  CLOSE_ICON_SIZE,
  EDITOR_TOOLBAR,
  QUESTION_BADGE_SIZE,
  applyEditorTool,
  getTicketAnswerText,
} from './adminSupportData';

/**
 * Figma 339:4819 (compose) + 339:4863 (published).
 * @param {{
 *   open: boolean,
 *   mode: 'compose' | 'published' | null,
 *   ticket: object | null,
 *   onClose: () => void,
 *   onPublish: (answer: string) => void,
 * }} props
 */
const AnswerPublishModal = memo(({ open, mode, ticket, onClose, onPublish }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const answerId = useId();
  const textareaRef = useRef(null);
  const [answer, setAnswer] = useState('');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    setAnswer('');
    setAttempted(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, mode, ticket?.id, onClose]);

  if (!open || !ticket || !mode) return null;

  const isCompose = mode === ANSWER_MODAL_MODE.COMPOSE;
  const questionText = t(ticket.fullQuestionKey || ticket.previewKey);
  const publishedAnswer = getTicketAnswerText(ticket, t);
  const answerValid = answer.trim().length > 0;
  const showAnswerError = attempted && !answerValid;

  const handleToolClick = (tool) => {
    const el = textareaRef.current;
    const selection = {
      start: el?.selectionStart ?? answer.length,
      end: el?.selectionEnd ?? answer.length,
    };
    const next = applyEditorTool(answer, selection, tool);
    setAnswer(next.value);
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(next.selection.start, next.selection.end);
    });
  };

  const handlePublish = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!answerValid) return;
    onPublish(answer.trim());
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-[rgba(24,32,51,0.35)]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-[800px] flex-col border-l border-[#ccc4d1] bg-white shadow-[-12px_0px_16px_rgba(123,94,167,0.12)]"
      >
        <header className="flex shrink-0 items-center border-b border-[#ccc4d1] bg-[#f3f3f5] px-4 pb-[25px] pt-6 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label={t('adminSupport.modal.close')}
              className="inline-flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition hover:bg-black/5"
            >
              <img
                src={ADMIN_SUPPORT_ASSETS.close}
                alt=""
                width={CLOSE_ICON_SIZE}
                height={CLOSE_ICON_SIZE}
                className="size-[30px]"
              />
            </button>
            <h2
              id={titleId}
              className="font-manrope truncate text-[18px] font-semibold leading-8 text-[#2d3392] sm:text-[24px]"
            >
              {t('adminSupport.modal.title')}
            </h2>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-10 sm:py-16 lg:px-16">
          <div className="mx-auto flex w-full max-w-[672px] flex-col gap-6">
            <div className="flex items-center gap-3">
              <img
                src={ADMIN_SUPPORT_ASSETS.questionBadge}
                alt=""
                width={QUESTION_BADGE_SIZE}
                height={QUESTION_BADGE_SIZE}
                className="size-[18px] shrink-0"
              />
              <h3 className="text-[18px] font-medium leading-7 text-[#1a1c1d] sm:text-[20px]">
                {t('adminSupport.modal.originalQuestion')}
              </h3>
            </div>

            <blockquote className="rounded-[12px] border-l-4 border-[#3a42bb] bg-[#f3f3f5] py-6 pl-7 pr-6 text-[15px] italic leading-6 text-[#4a454f] sm:text-[16px]">
              &ldquo;{questionText}&rdquo;
            </blockquote>

            {isCompose ? (
              <form className="flex flex-col gap-6" onSubmit={handlePublish} noValidate>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={answerId}
                    className="text-[14px] font-medium leading-5 tracking-[0.14px] text-[#4a454f]"
                  >
                    {t('adminSupport.modal.answerLabel')}
                  </label>
                  <div
                    className={`overflow-hidden rounded-[12px] border bg-white ${
                      showAnswerError ? 'border-[#ee1c25]' : 'border-[#ccc4d1]'
                    }`}
                  >
                    <div
                      className="flex flex-wrap items-center gap-2 border-b border-[#ccc4d1] bg-[#f3f3f5] px-1 py-1"
                      role="toolbar"
                      aria-label={t('adminSupport.modal.toolbar.aria')}
                    >
                      {EDITOR_TOOLBAR.map((tool) => {
                        if (tool.type === 'divider') {
                          return (
                            <span
                              key={tool.id}
                              className="mx-1 h-6 w-px shrink-0 bg-[#ccc4d1]"
                              aria-hidden="true"
                            />
                          );
                        }

                        return (
                          <button
                            key={tool.id}
                            type="button"
                            aria-label={t(tool.labelKey)}
                            onClick={() => handleToolClick(tool)}
                            className="inline-flex cursor-pointer items-center justify-center rounded-[4px] p-1 transition hover:bg-black/5"
                          >
                            <img
                              src={ADMIN_SUPPORT_ASSETS[tool.assetKey]}
                              alt=""
                              className="max-h-7 w-auto"
                            />
                          </button>
                        );
                      })}
                    </div>
                    <textarea
                      ref={textareaRef}
                      id={answerId}
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder={t('adminSupport.modal.answerPlaceholder')}
                      rows={8}
                      className="min-h-[220px] w-full resize-y bg-white px-4 py-6 text-[16px] leading-6 text-[#1a1c1d] outline-none placeholder:text-[#6b7280] sm:px-6"
                    />
                  </div>
                  {showAnswerError ? (
                    <p className="text-[13px] text-[#ee1c25]">{t('adminSupport.modal.answerRequired')}</p>
                  ) : null}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex h-[51px] cursor-pointer items-center justify-center rounded-[4px] bg-[#ee1c25] px-6 text-[16px] font-medium leading-5 tracking-[0.14px] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#d41820] sm:px-10"
                  >
                    {t('adminSupport.modal.publish')}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-[14px] font-medium leading-5 tracking-[0.14px] text-[#4a454f]">
                  {t('adminSupport.modal.answerLabel')}
                </p>
                <blockquote className="rounded-[12px] border-l-4 border-[#d91922] bg-[#f3f3f5] py-6 pl-7 pr-6 text-[15px] italic leading-6 text-[#4a454f] sm:text-[16px]">
                  &lsquo;{publishedAnswer}&rsquo;
                </blockquote>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-[51px] cursor-pointer items-center justify-center rounded-[4px] bg-[#ee1c25] px-6 text-[16px] font-medium leading-5 tracking-[0.14px] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#d41820] sm:px-10"
                  >
                    {t('adminSupport.modal.backToSupport')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
});

AnswerPublishModal.displayName = 'AnswerPublishModal';

export default AnswerPublishModal;
