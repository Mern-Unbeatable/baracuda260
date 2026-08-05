import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminNewsletterContent from '../AdminNewsletterContent';

describe('Admin Newsletter content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, subscribers, composer, and recipients', () => {
    render(<AdminNewsletterContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminNewsletter.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminNewsletter.subtitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminNewsletter.columns.email'))).toBeInTheDocument();
    expect(screen.getByText('john.anderson@company.com')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminNewsletter.composer.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.subjectPlaceholder')),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminNewsletter.recipients.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send to Everyone/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches recipient selection', async () => {
    const user = userEvent.setup();
    render(<AdminNewsletterContent />);

    const selected = screen.getByRole('button', { name: /Send to Selected Users/i });
    await user.click(selected);

    expect(selected).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Send to Everyone/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('updates composer fields', () => {
    render(<AdminNewsletterContent />);

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.subjectPlaceholder')),
      { target: { value: 'Spring campaign' } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.contentPlaceholder')),
      { target: { value: 'Hello subscribers' } },
    );

    expect(screen.getByDisplayValue('Spring campaign')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello subscribers')).toBeInTheDocument();
  });

  it('closes and reopens the composer', async () => {
    const user = userEvent.setup();
    render(<AdminNewsletterContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminNewsletter.composer.close') }));
    expect(
      screen.queryByRole('heading', { level: 2, name: i18n.t('adminNewsletter.composer.title') }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: i18n.t('adminNewsletter.composer.reopen') }));
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminNewsletter.composer.title') }),
    ).toBeInTheDocument();
  });

  it('switches newsletter copy to Polish', async () => {
    render(<AdminNewsletterContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Newsletter' })).toBeInTheDocument();
    expect(
      screen.getByText('Zarządzaj subskrybentami newslettera i kampaniami e-mail.'),
    ).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Data subskrypcji')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Kompozytor e-mail' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Odbiorcy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Wyślij do wszystkich/i })).toBeInTheDocument();
  });
});
