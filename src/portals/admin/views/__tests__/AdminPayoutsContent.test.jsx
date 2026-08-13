import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminPayoutsContent from '@/portals/admin/views/AdminPayoutsContent';

describe('Admin Payouts content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders all three payout sections with headings', () => {
    render(<AdminPayoutsContent />);

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminPayouts.sections.prize.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminPayouts.sections.donation.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminPayouts.sections.premium.title') }),
    ).toBeInTheDocument();
  });

  it('renders PAYOUTS eyebrow for each section', () => {
    render(<AdminPayoutsContent />);

    expect(screen.getAllByText(i18n.t('adminPayouts.eyebrow'))).toHaveLength(3);
  });

  it('renders table column headers', () => {
    render(<AdminPayoutsContent />);

    expect(screen.getAllByText(i18n.t('adminPayouts.columns.date')).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(i18n.t('adminPayouts.columns.type')).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(i18n.t('adminPayouts.columns.accountType')).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(i18n.t('adminPayouts.columns.amount')).length).toBeGreaterThanOrEqual(3);
  });

  it('renders Approved status and row data', () => {
    render(<AdminPayoutsContent />);

    expect(screen.getAllByText(i18n.t('adminPayouts.status.approved')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('$1,250.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('(702) 555-0122').length).toBeGreaterThan(0);
  });

  it('renders showing text and Previous/Next buttons for each section', () => {
    render(<AdminPayoutsContent />);

    expect(
      screen.getAllByText(
        i18n.t('adminPayouts.pagination.showing', { from: 1, to: 6, total: 6 }),
      ).length,
    ).toBe(3);
    expect(screen.getAllByRole('button', { name: i18n.t('adminPayouts.pagination.previous') })).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: i18n.t('adminPayouts.pagination.next') })).toHaveLength(3);
  });

  it('switches payouts copy to Polish', async () => {
    render(<AdminPayoutsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 2, name: 'Wypłaty nagród' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Wypłata darowizn' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('WYPŁATY')).toHaveLength(3);
  });
});
