import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import UploadPhotosContent from '@/portals/member/views/UploadPhotosContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('Upload Photos page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, tiers, and CTAs', () => {
    render(<UploadPhotosContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('uploadPhotos.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('uploadPhotos.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('uploadPhotos.tiers.single.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('uploadPhotos.tiers.story6.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('uploadPhotos.tiers.zodiac12.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('uploadPhotos.mostPopular'))).toBeInTheDocument();
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
    expect(screen.getByText('$2500.00')).toBeInTheDocument();
    expect(screen.getByText('$3500.00')).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('uploadPhotos.enterNow'))).toHaveLength(3);
    const enterLinks = screen.getAllByRole('link', { name: i18n.t('uploadPhotos.enterNow') });
    expect(enterLinks).toHaveLength(3);
    expect(enterLinks[0]).toHaveAttribute('href', '/admin/upload-photos/single');
    expect(enterLinks[1]).toHaveAttribute('href', '/admin/upload-photos/six');
    expect(enterLinks[2]).toHaveAttribute('href', '/admin/upload-photos/zodiac');
  });

  it('switches copy to Polish', async () => {
    render(<UploadPhotosContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Centrum kreatywnego przesyłania' }),
    ).toBeInTheDocument();
    expect(screen.getByText('NAJPOPULARNIEJSZE')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Pojedyncze zdjęcie' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Historia 6 zdjęć' })).toBeInTheDocument();
    expect(screen.getAllByText('Dołącz teraz')).toHaveLength(3);
  });
});
