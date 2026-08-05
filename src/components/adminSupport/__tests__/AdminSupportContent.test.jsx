import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminSupportContent from '../AdminSupportContent';

describe('Admin Support content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
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

  it('opens compose modal when Answer is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminSupportContent />);

    await user.click(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminSupport.modal.title') }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: i18n.t('adminSupport.actions.answer') })).toHaveLength(
      3,
    );
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
