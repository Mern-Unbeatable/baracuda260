import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminSupportContent from '../AdminSupportContent';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
  },
}));

describe('Admin Support content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    jest.clearAllMocks();
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header and both question queues', () => {
    render(<AdminSupportContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminSupport.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSupport.eyebrow'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSupport.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminSupport.pendingTitle') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminSupport.answeredTitle') }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminSupport.tickets.export.title')).length).toBe(5);
    expect(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })).toHaveLength(
      3,
    );
    expect(screen.getAllByText(i18n.t('adminSupport.actions.answered')).length).toBe(2);
    expect(
      screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.viewMessage') }),
    ).toHaveLength(2);
  });

  it('moves a pending ticket into the answered queue', async () => {
    const user = userEvent.setup();
    render(<AdminSupportContent />);

    await user.click(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })[0]);

    expect(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })).toHaveLength(
      2,
    );
    expect(screen.getAllByText(i18n.t('adminSupport.actions.answered')).length).toBe(3);
    expect(
      screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.viewMessage') }),
    ).toHaveLength(3);
  });

  it('shows the message preview when viewing an answered ticket', async () => {
    const user = userEvent.setup();
    render(<AdminSupportContent />);

    await user.click(
      screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.viewMessage') })[0],
    );

    expect(toast.success).toHaveBeenCalledWith(i18n.t('adminSupport.tickets.export.preview'));
  });

  it('switches support copy to Polish', async () => {
    render(<AdminSupportContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Prośby o wsparcie' })).toBeInTheDocument();
    expect(screen.getByText('SKRZYNKA')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Oczekujące pytania społeczności' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Odpowiedzi na pytania społeczności' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Odpowiedz' }).length).toBe(3);
    expect(screen.getAllByText('Odpowiedziano').length).toBe(2);
    expect(screen.getAllByRole('button', { name: 'Zobacz wiadomość' }).length).toBe(2);
  });
});
