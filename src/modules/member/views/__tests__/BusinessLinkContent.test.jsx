import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import BusinessLinkContent from '@/modules/member/views/BusinessLinkContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('Business Link Photos page', () => {
  beforeAll(() => {
    let blobCount = 0;
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(() => {
        blobCount += 1;
        return `blob:mock-business-${blobCount}`;
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

  it('renders English gateway, slots, and form', () => {
    render(<BusinessLinkContent />);

    expect(screen.getByText(i18n.t('businessLink.backToSelection'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('businessLink.infoTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.infoBody'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('businessLink.gridTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#6')).toBeInTheDocument();
    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.signs.aries.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.signs.pisces.name'))).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: i18n.t('businessLink.addPhoto') })).toHaveLength(
      12,
    );
    expect(screen.getByLabelText(i18n.t('businessLink.collectionTitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.copyrightConfirm'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('businessLink.submit') }),
    ).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<BusinessLinkContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Wróć do wyboru')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Brama Business Link — 12 zdjęć',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Profesjonalna rama wizualna 12 znaków zodiaku',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prześlij swoje zdjęcia' })).toBeInTheDocument();
    expect(screen.getByText(/ekskluzywne, komercyjne portfolio/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<BusinessLinkContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('businessLink.submit') }));

    expect(
      await screen.findByText(i18n.t('businessLink.errors.titleRequired')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.errors.storyRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.errors.photosRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('businessLink.errors.copyrightRequired'))).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the success popup after a valid submit', async () => {
    const user = userEvent.setup();
    const { container } = render(<BusinessLinkContent />);

    await user.type(
      screen.getByLabelText(i18n.t('businessLink.collectionTitle')),
      'Commercial Zodiac Set',
    );
    await user.type(
      screen.getByLabelText(i18n.t('businessLink.storyLabel')),
      'Licensed full zodiac portfolio for brand partners.',
    );
    await user.click(screen.getByText(i18n.t('businessLink.copyrightConfirm')));

    const fileInput = container.querySelector('input[type="file"]');
    for (let index = 0; index < 12; index += 1) {
      const addButton = screen.getAllByRole('button', {
        name: i18n.t('businessLink.addPhoto'),
      })[0];
      await user.click(addButton);
      await user.upload(fileInput, new File(['photo'], `slot-${index}.png`, { type: 'image/png' }));
    }

    await user.click(screen.getByRole('button', { name: i18n.t('businessLink.submit') }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('singlePhoto.successModal.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.successModal.body'))).toBeInTheDocument();
  }, 15000);

  it('closes artistic category dropdown on outside click', async () => {
    const user = userEvent.setup();
    render(<BusinessLinkContent />);

    await user.click(
      screen.getByRole('button', {
        name: i18n.t('businessLink.categories.astrophotography'),
      }),
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
