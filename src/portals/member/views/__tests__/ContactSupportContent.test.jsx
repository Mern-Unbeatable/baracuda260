import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import ContactSupportContent from '@/portals/member/views/ContactSupportContent';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Contact Support page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    document.body.style.overflow = '';
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English form and conversations', () => {
    render(<ContactSupportContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('contactSupport.formTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.formSubtitle'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('contactSupport.fullName'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('contactSupport.email'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('contactSupport.subject'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('contactSupport.message'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('contactSupport.send') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('contactSupport.conversationsTitle'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: i18n.t('contactSupport.filters.all') })).toBeInTheDocument();
    expect(
      screen.getAllByText(i18n.t('contactSupport.threads.export.title')).length,
    ).toBeGreaterThan(0);
  });

  it('switches copy to Polish', async () => {
    render(<ContactSupportContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Kontakt z pomocą' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Twoje rozmowy' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wyślij wiadomość' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Oczekujące' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<ContactSupportContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('contactSupport.send') }));

    expect(
      await screen.findByText(i18n.t('contactSupport.errors.nameRequired')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.errors.emailRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.errors.subjectRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.errors.messageRequired'))).toBeInTheDocument();
  });

  it('filters conversations by pending status', async () => {
    const user = userEvent.setup();
    render(<ContactSupportContent />);

    expect(
      screen.getAllByText(i18n.t('contactSupport.threads.export.title')),
    ).toHaveLength(4);

    await user.click(screen.getByRole('tab', { name: i18n.t('contactSupport.filters.pending') }));

    expect(
      screen.getAllByText(i18n.t('contactSupport.threads.export.title')),
    ).toHaveLength(1);

    await user.click(screen.getByRole('tab', { name: i18n.t('contactSupport.filters.replied') }));

    expect(
      screen.getAllByText(i18n.t('contactSupport.threads.export.title')),
    ).toHaveLength(3);
  });

  it('submits a valid message and clears the form', async () => {
    const toast = require('react-hot-toast').default;
    const user = userEvent.setup();
    render(<ContactSupportContent />);

    await user.type(
      screen.getByLabelText(i18n.t('contactSupport.fullName')),
      'Atik Adnan',
    );
    await user.type(
      screen.getByLabelText(i18n.t('contactSupport.email')),
      'atik@example.com',
    );
    await user.selectOptions(
      screen.getByLabelText(i18n.t('contactSupport.subject')),
      'technical',
    );
    await user.type(
      screen.getByLabelText(i18n.t('contactSupport.message')),
      'I need help with my export.',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('contactSupport.send') }));

    expect(toast.success).toHaveBeenCalledWith(i18n.t('contactSupport.success'));
    expect(screen.getByLabelText(i18n.t('contactSupport.fullName'))).toHaveValue('');
    expect(screen.getByLabelText(i18n.t('contactSupport.email'))).toHaveValue('');
    expect(screen.getByLabelText(i18n.t('contactSupport.subject'))).toHaveValue('');
    expect(screen.getByLabelText(i18n.t('contactSupport.message'))).toHaveValue('');
  });

  it('opens the message popup when a conversation is clicked', async () => {
    const user = userEvent.setup();
    render(<ContactSupportContent />);

    await user.click(
      screen.getAllByText(i18n.t('contactSupport.threads.export.title'))[0],
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('contactSupport.modal.waitReply'))).toBeInTheDocument();
  });
});
