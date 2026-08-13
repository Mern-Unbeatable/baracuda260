import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import PrizePaymentsContent from '@/portals/member/views/PrizePaymentsContent';
import { PRIZING_ROWS, PAYMENT_HISTORY_ROWS } from '@/portals/member/data/prizePaymentsData';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Prize & Payments page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    jest.clearAllMocks();
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, prize money tab, and tables', () => {
    render(<PrizePaymentsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('prizePayments.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('prizePayments.requestPayout') }),
    ).toBeInTheDocument();

    expect(screen.getByText(i18n.t('prizePayments.prizeMoney.summary.total'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.prizeMoney.summary.availableValue'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.prizeMoney.summary.paidOut'))).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('prizePayments.prizing.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('prizePayments.paymentHistory.title') }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(i18n.t('prizePayments.prizing.items.celestial')),
    ).toHaveLength(PRIZING_ROWS.length);
    expect(screen.getAllByText('Approved')).toHaveLength(PAYMENT_HISTORY_ROWS.length);
    expect(screen.getAllByRole('button', { name: i18n.t('prizePayments.pagination.next') })).toHaveLength(
      2,
    );
  });

  it('switches to donations tab content', async () => {
    const user = userEvent.setup();
    render(<PrizePaymentsContent />);

    await user.click(screen.getByRole('tab', { name: i18n.t('prizePayments.tabs.donations') }));

    expect(screen.getByText(i18n.t('prizePayments.donations.commissionBanner'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('prizePayments.donations.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.donations.items.johnSmith'))).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: i18n.t('prizePayments.prizing.title') }),
    ).not.toBeInTheDocument();
  });

  it('switches to photo sales tab content', async () => {
    const user = userEvent.setup();
    render(<PrizePaymentsContent />);

    await user.click(screen.getByRole('tab', { name: i18n.t('prizePayments.tabs.photoSales') }));

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('prizePayments.photoSales.title') }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(i18n.t('prizePayments.photoSales.searchPlaceholder'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.photoSales.items.buyerAnna'))).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<PrizePaymentsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Nagrody i płatności' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Poproś o wypłatę' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Moje nagrody' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Historia płatności' })).toBeInTheDocument();
    expect(screen.getByText('Łączne nagrody')).toBeInTheDocument();
    expect(screen.getAllByText('Zatwierdzono')).toHaveLength(PAYMENT_HISTORY_ROWS.length);
  });

  it('shows payout toast when Request Payout is clicked', async () => {
    const user = userEvent.setup();
    render(<PrizePaymentsContent />);

    await user.click(
      screen.getByRole('button', { name: i18n.t('prizePayments.requestPayout') }),
    );

    expect(toast.success).toHaveBeenCalledWith(i18n.t('prizePayments.payoutRequested'));
  });
});
