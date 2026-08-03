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
  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(() => 'blob:mock-photo'),
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

  it('renders English workspace, copyright confirm, and metadata form', () => {
    render(<SinglePhotoContent />);

    expect(screen.getByText(i18n.t('singlePhoto.backToSelection'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('singlePhoto.slotsTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByText('#6')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.elements.earth'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('singlePhoto.addPhoto') })).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('singlePhoto.collectionTitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.copyrightConfirm'))).toBeInTheDocument();
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
    expect(
      screen.getByText(/Potwierdzam, że posiadam pełne prawa autorskie/i),
    ).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<SinglePhotoContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('singlePhoto.submit') }));

    expect(await screen.findByText(i18n.t('singlePhoto.errors.titleRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.errors.storyRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.errors.photoRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.errors.copyrightRequired'))).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the success modal after a valid submit', async () => {
    const user = userEvent.setup();
    const { container } = render(<SinglePhotoContent />);

    await user.type(
      screen.getByLabelText(i18n.t('singlePhoto.collectionTitle')),
      'Celestial Archetypes',
    );
    await user.type(
      screen.getByLabelText(i18n.t('singlePhoto.storyLabel')),
      'A story about this cosmological series.',
    );
    await user.click(screen.getByText(i18n.t('singlePhoto.copyrightConfirm')));

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['photo'], 'virgo.png', { type: 'image/png' });
    await user.upload(fileInput, file);

    await user.click(screen.getByRole('button', { name: i18n.t('singlePhoto.submit') }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('singlePhoto.successModal.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.successModal.body'))).toBeInTheDocument();
  });
});
