import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import Zodiac12Content from '@/portals/member/views/Zodiac12Content';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('12 Photo Zodiac Album page', () => {
  beforeAll(() => {
    let blobCount = 0;
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(() => {
        blobCount += 1;
        return `blob:mock-photo-${blobCount}`;
      }),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    URL.createObjectURL.mockClear();
    URL.revokeObjectURL.mockClear();
  });

  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    document.body.style.overflow = '';
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English banner, red/blue slots, and form', () => {
    render(<Zodiac12Content />);

    expect(screen.getByText(i18n.t('zodiac12.backToSelection'))).toBeInTheDocument();
    expect(screen.getByText(/Spring, Summer, Autumn and Winter/i)).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.bannerSubtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('zodiac12.gridTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#6')).toBeInTheDocument();
    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.signs.aries.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.signs.pisces.name'))).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: i18n.t('zodiac12.addPhoto') })).toHaveLength(12);
    expect(screen.getByLabelText(i18n.t('zodiac12.collectionTitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.copyrightConfirm'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('zodiac12.submit') })).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<Zodiac12Content />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Wróć do wyboru')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Profesjonalna rama wizualna 12 znaków zodiaku',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prześlij swoje zdjęcia' })).toBeInTheDocument();
    expect(screen.getByText(/pełna historia 12 znaków zodiaku/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<Zodiac12Content />);

    await user.click(screen.getByRole('button', { name: i18n.t('zodiac12.submit') }));

    expect(await screen.findByText(i18n.t('zodiac12.errors.titleRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.errors.storyRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.errors.photosRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('zodiac12.errors.copyrightRequired'))).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the same success popup after a valid submit', async () => {
    const user = userEvent.setup();
    const { container } = render(<Zodiac12Content />);

    await user.type(
      screen.getByLabelText(i18n.t('zodiac12.collectionTitle')),
      'Full Zodiac Story',
    );
    await user.type(
      screen.getByLabelText(i18n.t('zodiac12.storyLabel')),
      'A complete red and blue zodiac series.',
    );
    await user.click(screen.getByText(i18n.t('zodiac12.copyrightConfirm')));

    const fileInput = container.querySelector('input[type="file"]');
    for (let index = 0; index < 12; index += 1) {
      const addButton = screen.getAllByRole('button', { name: i18n.t('zodiac12.addPhoto') })[0];
      await user.click(addButton);
      await user.upload(fileInput, new File(['photo'], `slot-${index}.png`, { type: 'image/png' }));
    }

    await user.click(screen.getByRole('button', { name: i18n.t('zodiac12.submit') }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('singlePhoto.successModal.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.successModal.body'))).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: i18n.t('singlePhoto.successModal.goHome') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: i18n.t('singlePhoto.successModal.uploadAnother') }),
    ).toBeInTheDocument();
  }, 15000);
});
