import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import CompetitionDetailsContent from '@/portals/public/competition-details/CompetitionDetailsContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
  useParams: () => ({ id: 'monochrome' }),
}));

describe('My Competition Details page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English hero, metrics, slides, and rankings', () => {
    render(<CompetitionDetailsContent />);

    expect(
      screen.getByRole('link', { name: i18n.t('competitionDetails.back') }),
    ).toHaveAttribute('href', '/admin/my-competitions');
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('competitionDetails.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('competitionDetails.description'))).toBeInTheDocument();
    expect(screen.getByText('1,284')).toBeInTheDocument();
    expect(screen.getByText('15 th')).toBeInTheDocument();
    expect(
      screen.getAllByText(i18n.t('competitionDetails.signs.aries')).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: i18n.t('competitionDetails.signs.taurus') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('competitionDetails.rankingsTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('competitionDetails.rankings.sarah'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('competitionDetails.rankings.alessandro'))).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t('competitionDetails.showing', { count: 5, total: '24,802' }),
      ),
    ).toBeInTheDocument();
  });

  it('updates active slide when a thumb is selected', () => {
    render(<CompetitionDetailsContent />);

    const geminiButton = screen.getByRole('button', {
      name: i18n.t('competitionDetails.signs.gemini'),
    });
    fireEvent.click(geminiButton);

    expect(geminiButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches copy to Polish', async () => {
    render(<CompetitionDetailsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Minimalistyczna monochromia' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Powrót do Moich konkursów' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Ranking globalny' })).toBeInTheDocument();
    expect(screen.getAllByText('Baran').length).toBeGreaterThan(0);
  });
});
