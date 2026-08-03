import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import SixPhotoContent from '../SixPhotoContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('6 Photo page', () => {
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

  it('renders English theme selector, spring slots, and form', () => {
    render(<SixPhotoContent />);

    expect(screen.getByText(i18n.t('sixPhoto.backToSelection'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('sixPhoto.selectTheme') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Spring and Summer/i }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(i18n.t('sixPhoto.or'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('sixPhoto.slotsTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.aries.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.virgo.name'))).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: i18n.t('sixPhoto.addPhoto') })).toHaveLength(6);
    expect(screen.getByLabelText(i18n.t('sixPhoto.collectionTitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.copyrightConfirm'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('sixPhoto.submit') })).toBeInTheDocument();
  });

  it('switches theme to autumn blue slots', async () => {
    const user = userEvent.setup();
    render(<SixPhotoContent />);

    await user.click(screen.getByRole('button', { name: /Autumn and Winter/i }));

    expect(screen.getByRole('button', { name: /Autumn and Winter/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /Spring and Summer/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.libra.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.scorpio.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.sagittarius.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.capricorn.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.aquarius.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.pisces.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.signs.libra.range'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('sixPhoto.signs.aries.name'))).not.toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<SixPhotoContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Wróć do wyboru')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Wybierz akcent motywu astro-akustycznego',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('LUB')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Siatka slotów zdjęć zodiaku' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prześlij swoje zdjęcia' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<SixPhotoContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('sixPhoto.submit') }));

    expect(await screen.findByText(i18n.t('sixPhoto.errors.titleRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.errors.storyRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.errors.photosRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('sixPhoto.errors.copyrightRequired'))).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the same success popup after a valid submit', async () => {
    const user = userEvent.setup();
    const { container } = render(<SixPhotoContent />);

    await user.type(
      screen.getByLabelText(i18n.t('sixPhoto.collectionTitle')),
      'Celestial Archetypes of Fire',
    );
    await user.type(
      screen.getByLabelText(i18n.t('sixPhoto.storyLabel')),
      'A spring and summer photo story.',
    );
    await user.click(screen.getByText(i18n.t('sixPhoto.copyrightConfirm')));

    const fileInput = container.querySelector('input[type="file"]');
    for (let index = 0; index < 6; index += 1) {
      const addButton = screen.getAllByRole('button', { name: i18n.t('sixPhoto.addPhoto') })[0];
      await user.click(addButton);
      await user.upload(fileInput, new File(['photo'], `slot-${index}.png`, { type: 'image/png' }));
    }

    await user.click(screen.getByRole('button', { name: i18n.t('sixPhoto.submit') }));

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
  });
});
