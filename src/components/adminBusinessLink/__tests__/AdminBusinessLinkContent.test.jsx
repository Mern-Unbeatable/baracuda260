import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminBusinessLinkContent from '../AdminBusinessLinkContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('Admin Business Link content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, table columns, rows, and pagination', () => {
    render(<AdminBusinessLinkContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminBusinessLink.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminBusinessLink.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: i18n.t('adminBusinessLink.columns.user') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: i18n.t('adminBusinessLink.columns.email') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: i18n.t('adminBusinessLink.columns.country') }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminBusinessLink.rows.john.user')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminBusinessLink.rows.emily.user')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('john.anderson@company.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('6/9/2026').length).toBeGreaterThan(0);
    expect(
      screen.getByText(i18n.t('adminBusinessLink.pagination.showing', { from: 1, to: 7, total: 7 })),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('adminBusinessLink.pagination.previous') }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: i18n.t('adminBusinessLink.pagination.next') }),
    ).toBeDisabled();
    expect(screen.getByTestId('business-link-mobile-cards')).toBeInTheDocument();
  });

  it('links the action eye icon to the details page', () => {
    render(<AdminBusinessLinkContent />);

    const link = screen.getAllByRole('link', {
      name: i18n.t('adminBusinessLink.actions.view', {
        user: i18n.t('adminBusinessLink.rows.john.user'),
      }),
    })[0];

    expect(link).toHaveAttribute('href', '/admin/business-link-photos/john-anderson');
  });

  it('switches business link copy to Polish', async () => {
    render(<AdminBusinessLinkContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Zdjęcia Business Link' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Użytkownik' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Poprzednia' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Następna' })).toBeDisabled();
    expect(screen.getByText('Wyświetlanie 1–7 z 7 wyników')).toBeInTheDocument();
  });
});
