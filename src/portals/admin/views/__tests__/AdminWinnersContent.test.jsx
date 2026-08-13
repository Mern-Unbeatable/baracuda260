import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminWinnersContent from '@/portals/admin/views/AdminWinnersContent';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Admin Winners content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, podium, and standings', () => {
    render(<AdminWinnersContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminWinners.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminWinners.subtitle', { month: 'July', year: 2026 }))).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: i18n.t('adminWinners.formats.six') })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(i18n.t('adminWinners.people.anna.firstName'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminWinners.people.piotr.firstName'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminWinners.people.marta.firstName'))).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminWinners.people.anna.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminWinners.people.kamil.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminWinners.people.ewa.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminWinners.people.tomasz.name')).length).toBeGreaterThan(0);
  });

  it('switches album format tabs', async () => {
    const user = userEvent.setup();
    render(<AdminWinnersContent />);

    const singleTab = screen.getByRole('tab', { name: i18n.t('adminWinners.formats.single') });
    await user.click(singleTab);

    expect(singleTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: i18n.t('adminWinners.formats.six') })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('opens month select and changes month label in subtitle', async () => {
    const user = userEvent.setup();
    render(<AdminWinnersContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminWinners.monthAria') }));
    await user.click(screen.getByRole('option', { name: i18n.t('adminWinners.months.june') }));

    expect(
      screen.getByText(i18n.t('adminWinners.subtitle', { month: 'June', year: 2026 })),
    ).toBeInTheDocument();
  });

  it('exposes view actions for each photographer', () => {
    render(<AdminWinnersContent />);

    expect(
      screen.getAllByRole('button', {
        name: i18n.t('adminWinners.view', { name: i18n.t('adminWinners.people.anna.name') }),
      }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', {
        name: i18n.t('adminWinners.view', { name: i18n.t('adminWinners.people.tomasz.name') }),
      }).length,
    ).toBeGreaterThan(0);
  });

  it('navigates to competition detail when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminWinnersContent />);

    const viewButtons = screen.getAllByRole('button', {
      name: i18n.t('adminWinners.view', { name: i18n.t('adminWinners.people.anna.name') }),
    });
    await user.click(viewButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/my-competitions/wings');
  });

  it('switches winners copy to Polish', async () => {
    render(<AdminWinnersContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Najlepsi fotografowie' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '6 zdjęć' })).toBeInTheDocument();
    expect(screen.getAllByText('Warszawa').length).toBeGreaterThan(0);
    expect(screen.getByText(/Lipiec 2026/)).toBeInTheDocument();
  });
});
