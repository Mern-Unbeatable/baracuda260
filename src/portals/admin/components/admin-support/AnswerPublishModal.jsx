import React, { memo, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_SUPPORT_ASSETS,
  ANSWER_MODAL_MODE,
  CLOSE_ICON_SIZE,
  EDITOR_TOOLBAR,
  getTicketAnswerText,
  QUESTION_BADGE_SIZE,
} from '@/portals/admin/data/adminSupportData';

const EDITOR_COMMANDS = {
  bold: 'bold',
  italic: 'italic',
  listUl: 'insertUnorderedList',
  listOl: 'insertOrderedList',
};

const getPlainText = (html) =>
  String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();

/**
 * Figma 339:4819 (compose) + 339:4863 (published).
 * @param {{
 *   open: boolean,
 *   mode: 'compose' | 'published' | null,
 *   ticket: object | null,
 *   isSubmitting?: boolean,
 *   onClose: () => void,
 *   onPublish: (answer: string) => void,
 * }} props
 */
const AnswerPublishModal = memo(
  ({ open, mode, ticket, isSubmitting = false, onClose, onPublish }) => {
    const { t } = useTranslation();
    const titleId = useId();
    const answerId = useId();
    const editorRef = useRef(null);
    const savedRangeRef = useRef(null);
    const [answer, setAnswer] = useState('');
    const [attempted, setAttempted] = useState(false);

    const syncAnswerFromEditor = () => {
      const html = editorRef.current?.innerHTML || '';
      setAnswer(html);
    };

    const saveSelection = () => {
      const selection = window.getSelection();
      if (
        selection &&
        selection.rangeCount > 0 &&
        editorRef.current?.contains(selection.anchorNode)
      ) {
        savedRangeRef.current = selection.getRangeAt(0).cloneRange();
      }
    };

    const restoreSelection = () => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      if (savedRangeRef.current) {
        selection.addRange(savedRangeRef.current);
      } else {
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection.addRange(range);
      }
    };

    useEffect(() => {
      if (!open) return undefined;

      setAnswer('');
      setAttempted(false);
      savedRangeRef.current = null;
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }

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
    const questionText =
      ticket.message ||
      ticket.title ||
      (ticket.fullQuestionKey ? t(ticket.fullQuestionKey) : '') ||
      (ticket.previewKey ? t(ticket.previewKey) : '');
    const publishedAnswer = getTicketAnswerText(ticket, t);
    const answerValid = getPlainText(answer).length > 0;
    const showAnswerError = attempted && !answerValid;

    const handleToolClick = (tool) => {
      restoreSelection();

      if (tool.id === 'link') {
        const url = window.prompt(
          t('adminSupport.modal.linkPrompt', 'Enter link URL'),
          'https://',
        );
        if (url) {
          document.execCommand('createLink', false, url.trim());
        }
      } else if (tool.id === 'image') {
        const url = window.prompt(
          t('adminSupport.modal.imagePrompt', 'Enter image URL'),
          'https://',
        );
        if (url) {
          document.execCommand('insertImage', false, url.trim());
        }
      } else {
        const command = EDITOR_COMMANDS[tool.id];
        if (command) document.execCommand(command, false);
      }

      syncAnswerFromEditor();
      saveSelection();
    };

    const handlePublish = (event) => {
      event.preventDefault();
      syncAnswerFromEditor();
      const html = editorRef.current?.innerHTML || answer;
      setAttempted(true);
      if (!getPlainText(html) || isSubmitting) return;
      onPublish(html.trim());
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
          className="flex h-full w-full max-w-200 flex-col border-l border-[#ccc4d1] bg-white shadow-[-12px_0px_16px_rgba(123,94,167,0.12)]"
        >
          <header className="flex shrink-0 items-center border-b border-[#ccc4d1] bg-[#f3f3f5] px-4 pb-6.25 pt-6 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                unstyled
                type="button"
                onClick={onClose}
                aria-label={t('adminSupport.modal.close')}
                className="inline-flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-md transition hover:bg-black/5"
              >
                <Image
                  src={ADMIN_SUPPORT_ASSETS.close}
                  alt=""
                  width={CLOSE_ICON_SIZE}
                  height={CLOSE_ICON_SIZE}
                  className="size-7.5"
                />
              </Button>
              <h2
                id={titleId}
                className="font-manrope truncate text-[18px] font-semibold leading-8 text-[#2d3392] sm:text-[24px]"
              >
                {t('adminSupport.modal.title')}
              </h2>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-10 sm:py-16 lg:px-16">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
              {/* User details if present */}
              {ticket.user || ticket.name || ticket.email ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#eeeef0] bg-[#f9fafb] p-3 text-xs text-[#6b7280]">
                  {ticket.user?.avatar || ticket.avatar ? (
                    <img
                      src={ticket.user?.avatar || ticket.avatar}
                      alt={ticket.user?.name || ticket.name || 'User'}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : null}
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#111827]">
                      {ticket.user?.name || ticket.name}
                    </span>
                    <span className="text-[#6b7280]">
                      {ticket.user?.email || ticket.email}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <Image
                  src={ADMIN_SUPPORT_ASSETS.questionBadge}
                  alt=""
                  width={QUESTION_BADGE_SIZE}
                  height={QUESTION_BADGE_SIZE}
                  className="size-4.5 shrink-0"
                />
                <h3 className="text-[18px] font-medium leading-7 text-[#1a1c1d] sm:text-[20px]">
                  {t('adminSupport.modal.originalQuestion')}
                </h3>
              </div>

              <blockquote className="rounded-xl border-l-4 border-[#3a42bb] bg-[#f3f3f5] py-6 pl-7 pr-6 text-[15px] italic leading-6 text-[#4a454f] sm:text-[16px]">
                &ldquo;{questionText}&rdquo;
              </blockquote>

              {/* Attachments if any */}
              {Array.isArray(ticket.attachments) &&
              ticket.attachments.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] font-medium text-[#4a454f]">
                    Attachments:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {ticket.attachments.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block size-20 overflow-hidden rounded-lg border border-[#e5e7eb] shadow-sm transition hover:opacity-90"
                      >
                        <img
                          src={url}
                          alt={`Attachment ${idx + 1}`}
                          className="size-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {isCompose ? (
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handlePublish}
                  noValidate
                >
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={answerId}
                      className="text-[14px] font-medium leading-5 tracking-[0.14px] text-[#4a454f]"
                    >
                      {t('adminSupport.modal.answerLabel')}
                    </label>
                    <div
                      className={`overflow-hidden rounded-xl border bg-white ${
                        showAnswerError
                          ? 'border-[#ee1c25]'
                          : 'border-[#ccc4d1]'
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
                            <Button
                              unstyled
                              key={tool.id}
                              type="button"
                              aria-label={t(tool.labelKey)}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                saveSelection();
                              }}
                              onClick={() => handleToolClick(tool)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-sm p-1 transition hover:bg-black/5"
                            >
                              <Image
                                src={ADMIN_SUPPORT_ASSETS[tool.assetKey]}
                                alt=""
                                className="max-h-7 w-auto"
                              />
                            </Button>
                          );
                        })}
                      </div>
                      <div className="relative">
                        {!answerValid ? (
                          <span className="pointer-events-none absolute left-4 top-6 text-[16px] leading-6 text-[#6b7280] sm:left-6">
                            {t('adminSupport.modal.answerPlaceholder')}
                          </span>
                        ) : null}
                        <div
                          ref={editorRef}
                          id={answerId}
                          role="textbox"
                          aria-multiline="true"
                          aria-label={t('adminSupport.modal.answerLabel')}
                          aria-placeholder={t(
                            'adminSupport.modal.answerPlaceholder',
                          )}
                          contentEditable={!isSubmitting}
                          suppressContentEditableWarning
                          onInput={syncAnswerFromEditor}
                          onBlur={syncAnswerFromEditor}
                          onKeyUp={saveSelection}
                          onMouseUp={saveSelection}
                          className="min-h-55 w-full overflow-y-auto bg-white px-4 py-6 text-[16px] leading-6 text-[#1a1c1d] outline-none sm:px-6 [&_a]:text-[#4048cd] [&_a]:underline [&_em]:italic [&_img]:max-h-48 [&_img]:rounded-md [&_li]:ml-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
                        />
                      </div>
                    </div>
                    {showAnswerError ? (
                      <p className="text-[13px] text-[#ee1c25]">
                        {t('adminSupport.modal.answerRequired')}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      unstyled
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-12.75 cursor-pointer items-center justify-center rounded-sm bg-[#ee1c25] px-6 text-[16px] font-medium leading-5 tracking-[0.14px] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#d41820] disabled:cursor-not-allowed disabled:opacity-60 sm:px-10"
                    >
                      {isSubmitting
                        ? t('common.loading', 'Publishing...')
                        : t('adminSupport.modal.publish')}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-[14px] font-medium leading-5 tracking-[0.14px] text-[#4a454f]">
                    {t('adminSupport.modal.answerLabel')}
                  </p>
                  <blockquote className="rounded-xl border-l-4 border-[#d91922] bg-[#f3f3f5] py-6 pl-7 pr-6 text-[15px] italic leading-6 text-[#4a454f] sm:text-[16px]">
                    {/<[a-z][\s\S]*>/i.test(publishedAnswer) ? (
                      <div
                        className="prose prose-sm max-w-none not-italic text-[#4a454f] [&_p]:mb-2 [&_p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: publishedAnswer }}
                      />
                    ) : (
                      <>&lsquo;{publishedAnswer}&rsquo;</>
                    )}
                  </blockquote>
                  <div className="flex justify-end pt-2">
                    <Button
                      unstyled
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-12.75 cursor-pointer items-center justify-center rounded-sm bg-[#ee1c25] px-6 text-[16px] font-medium leading-5 tracking-[0.14px] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#d41820] sm:px-10"
                    >
                      {t('adminSupport.modal.backToSupport')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

AnswerPublishModal.displayName = 'AnswerPublishModal';

export default AnswerPublishModal;
