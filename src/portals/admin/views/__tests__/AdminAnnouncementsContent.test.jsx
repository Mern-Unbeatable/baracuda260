import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminAnnouncementsContent from '@/portals/admin/views/AdminAnnouncementsContent';

describe('Admin Announcements content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders header, stats, table rows, and pagination', () => {
    render(<AdminAnnouncementsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminAnnouncements.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAnnouncements.stats.total.label'))).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(
      screen.getAllByText(i18n.t('adminAnnouncements.rows.mayWinners.title')).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        i18n.t('adminAnnouncements.pagination.showing', { from: 1, to: 10, total: 24 }),
      ),
    ).toBeInTheDocument();
  });

  it('shows type, priority, and status badges for the first row', () => {
    render(<AdminAnnouncementsContent />);

    expect(screen.getAllByText(i18n.t('adminAnnouncements.types.winner')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminAnnouncements.priority.high')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminAnnouncements.status.expired')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('ANN-1024').length).toBeGreaterThan(0);
  });

  it('opens action menu and updates status', async () => {
    const user = userEvent.setup();
    render(<AdminAnnouncementsContent />);

    const menuLabel = i18n.t('adminAnnouncements.actions.menu', {
      title: i18n.t('adminAnnouncements.rows.juneCompetition.title'),
    });
    await user.click(screen.getAllByRole('button', { name: menuLabel })[0]);

    const menu = screen.getAllByRole('menu', { name: menuLabel })[0];
    fireEvent.click(
      within(menu).getByRole('menuitem', { name: i18n.t('adminAnnouncements.actions.setInactive') }),
    );

    expect(screen.getAllByText(i18n.t('adminAnnouncements.status.inactive')).length).toBeGreaterThan(0);
  });

  it('opens create announcement modal from header button', async () => {
    const user = userEvent.setup();
    render(<AdminAnnouncementsContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminAnnouncements.createButton') }));

    expect(
      screen.getByRole('dialog', { name: i18n.t('adminAnnouncements.modal.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAnnouncements.modal.subtitle'))).toBeInTheDocument();
  });

  it('validates required fields in create announcement modal', async () => {
    const user = userEvent.setup();
    render(<AdminAnnouncementsContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminAnnouncements.createButton') }));

    const dialog = screen.getByRole('dialog', { name: i18n.t('adminAnnouncements.modal.title') });
    await user.click(
      within(dialog).getByRole('button', { name: i18n.t('adminAnnouncements.modal.submit') }),
    );

    expect(within(dialog).getByText(i18n.t('adminAnnouncements.modal.messageRequired'))).toBeInTheDocument();
  });

  it('creates announcement and prepends it to the table', async () => {
    const user = userEvent.setup();
    render(<AdminAnnouncementsContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminAnnouncements.createButton') }));

    const dialog = screen.getByRole('dialog', { name: i18n.t('adminAnnouncements.modal.title') });
    await user.type(
      within(dialog).getByLabelText(new RegExp(i18n.t('adminAnnouncements.modal.messageLabel'), 'i')),
      'Summer promo is live',
    );
    fireEvent.change(within(dialog).getByLabelText(new RegExp(i18n.t('adminAnnouncements.modal.startDate'), 'i')), {
      target: { value: '2026-08-01' },
    });
    fireEvent.change(dialog.querySelector('#announcement-end-date'), {
      target: { value: '2026-08-31' },
    });
    await user.click(
      within(dialog).getByRole('button', { name: i18n.t('adminAnnouncements.modal.submit') }),
    );

    expect(screen.queryByRole('dialog', { name: i18n.t('adminAnnouncements.modal.title') })).not.toBeInTheDocument();
    expect(screen.getAllByText('Summer promo is live').length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        i18n.t('adminAnnouncements.pagination.showing', { from: 1, to: 10, total: 25 }),
      ),
    ).toBeInTheDocument();
  });

  it('switches announcements copy to Polish', async () => {
    render(<AdminAnnouncementsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Reklamy i ogłoszenia' })).toBeInTheDocument();
    expect(screen.getByText('Utwórz ogłoszenie')).toBeInTheDocument();
  });
});
