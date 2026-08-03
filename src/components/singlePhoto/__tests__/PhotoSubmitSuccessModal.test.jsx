import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import { ROUTES } from '../../../config';
import PhotoSubmitSuccessModal from '../PhotoSubmitSuccessModal';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

describe('PhotoSubmitSuccessModal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    document.body.style.overflow = '';
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders nothing when closed', () => {
    render(<PhotoSubmitSuccessModal open={false} onClose={jest.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders English success content and action links when open', () => {
    render(<PhotoSubmitSuccessModal open onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('singlePhoto.successModal.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('singlePhoto.successModal.body'))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: i18n.t('singlePhoto.successModal.goHome') })).toHaveAttribute(
      'href',
      ROUTES.HOME,
    );
    expect(
      screen.getByRole('link', { name: i18n.t('singlePhoto.successModal.uploadAnother') }),
    ).toHaveAttribute('href', ROUTES.ADMIN_UPLOAD_PHOTOS);
  });

  it('switches modal copy to Polish', async () => {
    render(<PhotoSubmitSuccessModal open onClose={jest.fn()} />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 2, name: '📷 Gratulacje!' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Twoje zdjęcia zostały przesłane i biorą teraz udział w konkursie głosowania. Powodzenia!',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Przejdź na stronę główną' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Prześlij kolejny album' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<PhotoSubmitSuccessModal open onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: i18n.t('singlePhoto.successModal.close') }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<PhotoSubmitSuccessModal open onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
