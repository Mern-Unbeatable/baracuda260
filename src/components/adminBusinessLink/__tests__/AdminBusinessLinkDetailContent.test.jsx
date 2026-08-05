import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminBusinessLinkDetailContent from '../AdminBusinessLinkDetailContent';

const mockUseParams = jest.fn(() => ({ id: 'john-anderson' }));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
  useParams: () => mockUseParams(),
}));

describe('Admin Business Link Details', () => {
  const writeText = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: 'john-anderson' });
    writeText.mockClear();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    jest.clearAllMocks();
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders the Figma album detail for a submission id', () => {
    render(<AdminBusinessLinkDetailContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminBusinessLink.detail.name') }),
    ).toBeInTheDocument();
    expect(screen.getByText('amelia.carter@northwind.co')).toBeInTheDocument();
    expect(screen.getByText('ALB-45215')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminBusinessLink.detail.photoTitle') }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminBusinessLink.detail.photoDescription')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminBusinessLink.detail.photographer'))).toBeInTheDocument();
    expect(screen.getByText('https://website.com/business/album-45215')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('adminBusinessLink.detail.copyLink') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: i18n.t('adminBusinessLink.detail.selectPhoto', { number: 1, sign: 'Aries' }),
      }),
    ).toHaveAttribute('aria-current', 'true');
    expect(
      screen.getByRole('button', {
        name: i18n.t('adminBusinessLink.detail.selectPhoto', { number: 1, sign: 'Aries' }),
      }).querySelector('img[src*="icon-aries"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: i18n.t('adminBusinessLink.detail.selectPhoto', { number: 9, sign: 'Sagittarius' }),
      }).querySelector('img[src*="icon-sagittarius"]'),
    ).toBeInTheDocument();
  });

  it('copies the generated business link', async () => {
    render(<AdminBusinessLinkDetailContent />);

    fireEvent.click(screen.getByRole('button', { name: i18n.t('adminBusinessLink.detail.copyLink') }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('https://website.com/business/album-45215');
    });
    expect(toast.success).toHaveBeenCalledWith(i18n.t('adminBusinessLink.detail.copySuccess'));
  });

  it('shows not-found state for unknown ids', () => {
    mockUseParams.mockReturnValue({ id: 'missing-id' });
    render(<AdminBusinessLinkDetailContent />);

    expect(screen.getByText(i18n.t('adminBusinessLink.detail.notFound'))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: i18n.t('adminBusinessLink.detail.back') })).toHaveAttribute(
      'href',
      '/admin/business-link-photos',
    );
  });

  it('switches detail copy to Polish', async () => {
    render(<AdminBusinessLinkDetailContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Amelia Carter' })).toBeInTheDocument();
    expect(screen.getByText('Stany Zjednoczone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kopiuj link' })).toBeInTheDocument();
    expect(screen.getByText('Wygenerowany link biznesowy')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Młody mężczyzna pewnie idący cichą miejską ulicą podczas złotej godziny/,
      ),
    ).toBeInTheDocument();
  });
});
