import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminGalleryContent from '@/portals/admin/views/AdminGalleryContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('Admin Gallery content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, filters, cards, and pagination', () => {
    render(<AdminGalleryContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminGallery.title') }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.filters.all') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.filters.single') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.filters.six') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.filters.zodiac') })).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminGallery.cards.autumn.title')).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: i18n.t('adminGallery.delete') }).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: i18n.t('adminGallery.cards.autumn.title') })[0],
    ).toHaveAttribute('href', '/admin/gallery/autumn');
    expect(screen.getByLabelText(i18n.t('adminGallery.pagination.aria'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.pagination.page', { page: 1 }) })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('shows all cards by default and filters by album type', async () => {
    const user = userEvent.setup();
    render(<AdminGalleryContent />);

    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.filters.all') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: i18n.t('adminGallery.filters.zodiac') }));

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('button', { name: i18n.t('adminGallery.filters.zodiac') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('switches gallery copy to Polish', async () => {
    render(<AdminGalleryContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Galeria' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wszystkie' })).toBeInTheDocument();
    expect(screen.getAllByText('Autumn Sequence').length).toBeGreaterThan(0);
  });
});
