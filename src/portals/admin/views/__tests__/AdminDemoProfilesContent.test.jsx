import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import { ROUTES } from '@/shared/config';
import { resetDemoProfilesStore } from '@/portals/admin/data/adminDemoProfilesData';
import AdminDemoProfilesContent from '@/portals/admin/views/AdminDemoProfilesContent';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe('Admin Demo Profiles content', () => {
  beforeEach(() => {
    resetDemoProfilesStore();
  });

  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders header, stats, table, and pagination', () => {
    render(<AdminDemoProfilesContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminDemoProfiles.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminDemoProfiles.stats.total'))).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminDemoProfiles.profiles.elena.name')).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        i18n.t('adminDemoProfiles.pagination.showing', { from: 1, to: 10, total: 10 }),
      ),
    ).toBeInTheDocument();
  });

  it('links add button to create page', () => {
    render(<AdminDemoProfilesContent />);

    expect(screen.getByRole('link', { name: i18n.t('adminDemoProfiles.addButton') })).toHaveAttribute(
      'href',
      ROUTES.ADMIN_DEMO_PROFILES_CREATE,
    );
  });

  it('filters profiles by inactive status', async () => {
    const user = userEvent.setup();
    render(<AdminDemoProfilesContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminDemoProfiles.filters.aria') }));
    await user.click(screen.getByRole('option', { name: i18n.t('adminDemoProfiles.filters.inactive') }));

    expect(screen.getAllByText(i18n.t('adminDemoProfiles.profiles.liam.name')).length).toBeGreaterThan(0);
    expect(screen.queryByText(i18n.t('adminDemoProfiles.profiles.elena.name'))).not.toBeInTheDocument();
  });

  it('opens profile details from action menu', async () => {
    const user = userEvent.setup();
    render(<AdminDemoProfilesContent />);

    const actionLabel = i18n.t('adminDemoProfiles.actions.menu', {
      name: i18n.t('adminDemoProfiles.profiles.elena.name'),
    });
    await user.click(screen.getAllByRole('button', { name: actionLabel })[0]);

    const menu = screen.getAllByRole('menu', { name: actionLabel })[0];
    fireEvent.click(within(menu).getByRole('menuitem', { name: i18n.t('adminDemoProfiles.actions.seeDetails') }));

    const dialog = screen.getByRole('dialog', { name: i18n.t('adminDemoProfiles.detail.title') });
    expect(within(dialog).getByText('elena@photocraft.io')).toBeInTheDocument();
    expect(within(dialog).getByText('instagram.com/elenavasquez')).toBeInTheDocument();
  });

  it('updates profile status from action menu', async () => {
    const user = userEvent.setup();
    render(<AdminDemoProfilesContent />);

    const actionLabel = i18n.t('adminDemoProfiles.actions.menu', {
      name: i18n.t('adminDemoProfiles.profiles.liam.name'),
    });
    await user.click(screen.getAllByRole('button', { name: actionLabel })[0]);

    const menu = screen.getAllByRole('menu', { name: actionLabel })[0];
    fireEvent.click(within(menu).getByRole('menuitem', { name: i18n.t('adminDemoProfiles.actions.active') }));

    expect(screen.getAllByText(i18n.t('adminDemoProfiles.status.active')).length).toBeGreaterThan(0);
  });

  it('switches demo profiles copy to Polish', async () => {
    render(<AdminDemoProfilesContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Profile demo' })).toBeInTheDocument();
    expect(screen.getByText('Dodaj profil demo')).toBeInTheDocument();
  });
});
