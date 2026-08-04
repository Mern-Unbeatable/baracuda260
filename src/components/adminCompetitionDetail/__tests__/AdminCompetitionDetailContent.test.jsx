import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminCompetitionDetailContent from '../AdminCompetitionDetailContent';

const mockUseParams = jest.fn(() => ({ id: 'wings' }));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
  useParams: () => mockUseParams(),
}));

describe('Admin Competition Detail content', () => {
  afterEach(async () => {
    mockUseParams.mockReturnValue({ id: 'wings' });
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders single photo details', () => {
    render(<AdminCompetitionDetailContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminCompetitionDetail.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('adminCompetitionDetail.entries.wings.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitions.types.single'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitionDetail.categories.nature'))).toBeInTheDocument();
    expect(screen.getByText('2150')).toBeInTheDocument();
    expect(screen.getByText('12400')).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminCompetitionDetail.photographerName')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitionDetail.signs.aries'))).toBeInTheDocument();
    expect(screen.queryByLabelText(i18n.t('adminCompetitionDetail.slidesAria'))).not.toBeInTheDocument();
  });

  it('renders six-photo red story strip and switches slides', () => {
    mockUseParams.mockReturnValue({ id: 'autumn' });
    render(<AdminCompetitionDetailContent />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('adminCompetitionDetail.entries.autumn.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('adminCompetitionDetail.slidesAria'))).toBeInTheDocument();

    const taurus = screen.getByRole('button', {
      name: i18n.t('adminCompetitionDetail.signs.taurus'),
    });
    fireEvent.click(taurus);
    expect(taurus).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders six-photo blue and twelve-photo variants', () => {
    mockUseParams.mockReturnValue({ id: 'city' });
    const { unmount } = render(<AdminCompetitionDetailContent />);

    expect(
      screen.getAllByText(i18n.t('adminCompetitionDetail.signs.libra')).length,
    ).toBeGreaterThan(0);
    unmount();

    mockUseParams.mockReturnValue({ id: 'zodiac' });
    render(<AdminCompetitionDetailContent />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('adminCompetitionDetail.entries.zodiac.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('adminCompetitionDetail.slidesAria'))).toBeInTheDocument();
    expect(
      screen.getAllByText(i18n.t('adminCompetitionDetail.signs.aries')).length,
    ).toBeGreaterThan(0);
  });

  it('switches detail copy to Polish', async () => {
    render(<AdminCompetitionDetailContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Zarządzanie konkursami' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Szczegóły zdjęcia')).toBeInTheDocument();
    expect(screen.getByText('Otrzymane głosy')).toBeInTheDocument();
    expect(screen.getByText('Fotograf')).toBeInTheDocument();
  });
});
