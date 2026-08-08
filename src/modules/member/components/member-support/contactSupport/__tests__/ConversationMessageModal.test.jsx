import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import ConversationMessageModal from '@/modules/member/components/member-support/contactSupport/ConversationMessageModal';
import { CONVERSATIONS } from '@/modules/member/data/contactSupportData';

const repliedThread = CONVERSATIONS.find((thread) => thread.status === 'replied');

describe('ConversationMessageModal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    document.body.style.overflow = '';
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders nothing when closed', () => {
    render(
      <ConversationMessageModal open={false} thread={repliedThread} onClose={jest.fn()} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders English thread content when open', () => {
    render(<ConversationMessageModal open thread={repliedThread} onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('contactSupport.threads.export.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.lastUpdated'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.today'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.messages.user1'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.messages.support1'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.attachment.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.waitReply'))).toBeInTheDocument();
  });

  it('switches modal copy to Polish', async () => {
    render(<ConversationMessageModal open thread={repliedThread} onClose={jest.fn()} />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Ostatnia aktualizacja 2 godz. temu')).toBeInTheDocument();
    expect(screen.getByText('Dziś')).toBeInTheDocument();
    expect(screen.getByText('Przeczytano')).toBeInTheDocument();
    expect(
      screen.getByText(/Poczekaj na odpowiedź zespołu wsparcia/i),
    ).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ConversationMessageModal open thread={repliedThread} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: i18n.t('contactSupport.modal.close') }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ConversationMessageModal open thread={repliedThread} onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
