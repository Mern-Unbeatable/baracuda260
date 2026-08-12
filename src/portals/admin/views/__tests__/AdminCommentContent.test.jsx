import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminCommentContent from '@/portals/admin/views/AdminCommentContent';

describe('Admin Comment content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, stats, and comment rows', () => {
    render(<AdminCommentContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminComment.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminComment.subtitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminComment.stats.total.label'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminComment.stats.pending.label'))).toBeInTheDocument();
    expect(screen.getByText('CMT-0001')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminComment.rows.cmt0001.name'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminComment.pagination.showing', { count: 12, total: 12 })),
    ).toBeInTheDocument();
  });

  it('filters to pending comments', async () => {
    const user = userEvent.setup();
    render(<AdminCommentContent />);

    await user.click(screen.getByRole('tab', { name: i18n.t('adminComment.filters.pending') }));

    expect(screen.getByText('CMT-0004')).toBeInTheDocument();
    expect(screen.getByText('CMT-0009')).toBeInTheDocument();
    expect(screen.queryByText('CMT-0001')).not.toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminComment.pagination.showing', { count: 2, total: 2 })),
    ).toBeInTheDocument();
  });

  it('opens details drawer from action menu', async () => {
    const user = userEvent.setup();
    render(<AdminCommentContent />);

    await user.click(
      screen.getByRole('button', { name: /Actions for Elena Vasquez/i }),
    );
    await user.click(screen.getByRole('menuitem', { name: i18n.t('adminComment.actions.seeDetails') }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(i18n.t('adminComment.drawer.title'))).toBeInTheDocument();
    expect(within(dialog).getByText('CMT-0001')).toBeInTheDocument();
    expect(within(dialog).getByText('elena.v@mail.com')).toBeInTheDocument();
    expect(within(dialog).getByText('1,240')).toBeInTheDocument();
  });

  it('updates status from action menu', async () => {
    const user = userEvent.setup();
    render(<AdminCommentContent />);

    await user.click(
      screen.getByRole('button', { name: /Actions for James Okafor/i }),
    );
    await user.click(screen.getByRole('menuitem', { name: i18n.t('adminComment.actions.approved') }));

    expect(screen.getAllByText(i18n.t('adminComment.status.approved')).length).toBeGreaterThan(0);
  });

  it('switches comment copy to Polish', async () => {
    render(<AdminCommentContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Zarządzanie komentarzami' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Zarządzaj, przeglądaj i moderuj wszystkie komentarze użytkowników do zdjęć i albumów.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Oczekujące' })).toBeInTheDocument();
    expect(screen.getByText('Elena Vasquez')).toBeInTheDocument();
    expect(screen.getAllByText('Wszystkie komentarze').length).toBeGreaterThan(0);
  });
});
