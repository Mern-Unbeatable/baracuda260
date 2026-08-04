import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import PrizePaymentsContent from '../PrizePaymentsContent';
import { PRIZING_ROWS, TRANSACTION_ROWS } from '../prizePaymentsData';

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

  it('renders English header, summary cards, and tables', () => {
    render(<PrizePaymentsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('prizePayments.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('prizePayments.requestPayout') }),
    ).toBeInTheDocument();

    expect(screen.getByText(i18n.t('prizePayments.summary.wallet'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.summary.walletValue'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.summary.earned'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('prizePayments.summary.pending'))).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('prizePayments.prizing.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('prizePayments.transactions.title'),
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(i18n.t('prizePayments.prizing.items.celestialLine1')),
    ).toHaveLength(PRIZING_ROWS.length);
    expect(
      screen.getAllByText(i18n.t('prizePayments.prizing.items.celestialLine2')),
    ).toHaveLength(PRIZING_ROWS.length);
    expect(
      screen.getByText(i18n.t('prizePayments.transactions.items.golden.title')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('prizePayments.transactions.items.paypal.amount')),
    ).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('prizePayments.status.success')).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByRole('button', { name: i18n.t('prizePayments.pagination.next') })).toHaveLength(
      2,
    );
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
    expect(
      screen.getByRole('heading', { level: 2, name: 'Historia transakcji' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Saldo portfela')).toBeInTheDocument();
    expect(screen.getByText('Wypłata na PayPal')).toBeInTheDocument();
  });

  it('shows payout toast when Request Payout is clicked', async () => {
    const user = userEvent.setup();
    render(<PrizePaymentsContent />);

    await user.click(
      screen.getByRole('button', { name: i18n.t('prizePayments.requestPayout') }),
    );

    expect(toast.success).toHaveBeenCalledWith(i18n.t('prizePayments.payoutRequested'));
  });

  it('renders all transaction rows from data', () => {
    render(<PrizePaymentsContent />);

    TRANSACTION_ROWS.forEach((row) => {
      expect(screen.getByText(i18n.t(row.titleKey))).toBeInTheDocument();
      expect(screen.getByText(i18n.t(row.idKey))).toBeInTheDocument();
    });
  });
});
