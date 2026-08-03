import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import MyCompetitionsContent from '../MyCompetitionsContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('My Competitions page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, stats, filters, and submissions', () => {
    render(<MyCompetitionsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('myCompetitions.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('myCompetitions.subtitle'))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: i18n.t('myCompetitions.newEntry') })).toHaveAttribute(
      'href',
      '/admin/upload-photos',
    );
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('842')).toBeInTheDocument();
    expect(screen.getByText('#4')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('myCompetitions.stats.globalRanking'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('myCompetitions.filtersLabel'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('myCompetitions.statusOptions.all'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('myCompetitions.categoryOptions.all'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('myCompetitions.items.monochrome.title'),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('myCompetitions.items.celestial.title'),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('myCompetitions.items.oak.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('myCompetitions.showing', { count: 3, total: 12 }))).toBeInTheDocument();
  });

  it('filters submissions by status', () => {
    render(<MyCompetitionsContent />);

    fireEvent.click(screen.getByText(i18n.t('myCompetitions.statusOptions.all')));
    fireEvent.click(screen.getByRole('option', { name: i18n.t('myCompetitions.statusOptions.pending') }));

    expect(
      screen.getAllByRole('heading', { level: 2, name: i18n.t('myCompetitions.items.oak.title') }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: i18n.t('myCompetitions.items.monochrome.title'),
      }),
    ).not.toBeInTheDocument();
  });

  it('paginates submissions', () => {
    render(<MyCompetitionsContent />);

    const pagination = screen.getByRole('navigation', {
      name: i18n.t('myCompetitions.paginationAria'),
    });
    fireEvent.click(within(pagination).getByRole('button', { name: i18n.t('myCompetitions.pageNumber', { page: 2 }) }));

    expect(screen.getByText(i18n.t('myCompetitions.showing', { count: 3, total: 12 }))).toBeInTheDocument();
    expect(
      within(pagination).getByRole('button', { name: i18n.t('myCompetitions.pageNumber', { page: 2 }) }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('closes filter dropdown on outside click', () => {
    render(<MyCompetitionsContent />);

    fireEvent.click(screen.getByText(i18n.t('myCompetitions.categoryOptions.all')));
    expect(
      screen.getByRole('listbox', { name: i18n.t('myCompetitions.categoryFilterAria') }),
    ).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('heading', { level: 1 }));

    expect(
      screen.queryByRole('listbox', { name: i18n.t('myCompetitions.categoryFilterAria') }),
    ).not.toBeInTheDocument();
  });

  it('closes filter dropdown on Escape', () => {
    render(<MyCompetitionsContent />);

    fireEvent.click(screen.getByText(i18n.t('myCompetitions.statusOptions.all')));
    expect(
      screen.getByRole('listbox', { name: i18n.t('myCompetitions.statusFilterAria') }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.queryByRole('listbox', { name: i18n.t('myCompetitions.statusFilterAria') }),
    ).not.toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<MyCompetitionsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Moje zgłoszenia konkursowe' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Nowe zgłoszenie')).toBeInTheDocument();
    expect(screen.getByText('Filtry:')).toBeInTheDocument();
    expect(screen.getByText('Wszystkie statusy')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Minimalistyczna monochromia' })).toBeInTheDocument();
  });
});
