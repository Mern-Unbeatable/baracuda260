import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminCompetitionDetailContent from '@/portals/admin/views/AdminCompetitionDetailContent';

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
    jest.useRealTimers();
    mockUseParams.mockReturnValue({ id: 'wings' });
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders single photo details', () => {
    render(<AdminCompetitionDetailContent />);

    expect(screen.getByText(i18n.t('adminCompetitionDetail.back'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: i18n.t('adminCompetitionDetail.entries.wings.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitionDetail.typeBadges.single'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitionDetail.categories.nature'))).toBeInTheDocument();
    expect(screen.getByText('2150')).toBeInTheDocument();
    expect(screen.getByText('12400')).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminCompetitionDetail.photographerName')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitionDetail.viewProfile'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitionDetail.signs.aries'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('competitionDetails.rankingsTitle') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminCompetitionDetail.commentsTitle') }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(i18n.t('adminCompetitionDetail.slidesAria'))).not.toBeInTheDocument();
    expect(document.querySelector('img[src="/assets/home/detail-hero.jpg"]')).toBeInTheDocument();
  });

  it('renders six-photo red story strip and switches slides', () => {
    mockUseParams.mockReturnValue({ id: 'autumn' });
    render(<AdminCompetitionDetailContent />);

    expect(
      screen.getByRole('heading', {
        level: 1,
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
        level: 1,
        name: i18n.t('adminCompetitionDetail.entries.zodiac.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('adminCompetitionDetail.slidesAria'))).toBeInTheDocument();
    expect(
      screen.getAllByText(i18n.t('adminCompetitionDetail.signs.aries')).length,
    ).toBeGreaterThan(0);
  });

  it('auto-advances story slides every 6 seconds', () => {
    jest.useFakeTimers();
    mockUseParams.mockReturnValue({ id: 'autumn' });
    render(<AdminCompetitionDetailContent />);

    const aries = screen.getByRole('button', {
      name: i18n.t('adminCompetitionDetail.signs.aries'),
    });
    const taurus = screen.getByRole('button', {
      name: i18n.t('adminCompetitionDetail.signs.taurus'),
    });

    expect(aries).toHaveAttribute('aria-pressed', 'true');

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(taurus).toHaveAttribute('aria-pressed', 'true');
    jest.useRealTimers();
  });

  it('switches detail copy to Polish', async () => {
    render(<AdminCompetitionDetailContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Powrót do wyboru')).toBeInTheDocument();
    expect(screen.getByText('OTRZYMANE GŁOSY')).toBeInTheDocument();
    expect(screen.getByText('Fotograf')).toBeInTheDocument();
    expect(screen.getByText('Komentarze')).toBeInTheDocument();
  });
});
