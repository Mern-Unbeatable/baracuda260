import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import SinglePhotoContent from '../SinglePhotoContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('Single Photo page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English workspace and metadata form', () => {
    render(<SinglePhotoContent />);

    expect(screen.getByText(i18n.t('singlePhoto.backToSelection'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('singlePhoto.slotsTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText('#6')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.elements.earth'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('singlePhoto.addPhoto') })).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('singlePhoto.collectionTitle'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('singlePhoto.submit') })).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<SinglePhotoContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Wróć do wyboru')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Siatka slotów zdjęć zodiaku' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dodaj zdjęcie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prześlij swoje zdjęcia' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<SinglePhotoContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('singlePhoto.submit') }));

    expect(await screen.findByText(i18n.t('singlePhoto.errors.titleRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.errors.storyRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.errors.photoRequired'))).toBeInTheDocument();
  });
});
