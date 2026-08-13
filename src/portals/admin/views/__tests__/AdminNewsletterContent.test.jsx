import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminNewsletterContent from '@/portals/admin/views/AdminNewsletterContent';

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

  it('shows subscriber checkboxes when Send to Selected Users is chosen', async () => {
    const user = userEvent.setup();
    render(<AdminNewsletterContent />);

    await user.click(screen.getByRole('button', { name: /Send to Selected Users/i }));

    expect(screen.getByText(i18n.t('adminNewsletter.recipients.selectHint'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminNewsletter.recipients.selectedCount', { count: 0 }))).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
  });

  it('updates selected subscriber count when checkboxes are toggled', async () => {
    const user = userEvent.setup();
    render(<AdminNewsletterContent />);

    await user.click(screen.getByRole('button', { name: /Send to Selected Users/i }));
    await user.click(
      screen.getByRole('checkbox', {
        name: i18n.t('adminNewsletter.recipients.selectSubscriber', {
          email: 'john.anderson@company.com',
        }),
      }),
    );

    expect(
      screen.getByText(i18n.t('adminNewsletter.recipients.selectedCount', { count: 1 })),
    ).toBeInTheDocument();
  });

  it('requires at least one subscriber when sending to selected users', async () => {
    const user = userEvent.setup();
    render(<AdminNewsletterContent />);

    await user.click(screen.getByRole('button', { name: /Send to Selected Users/i }));
    fireEvent.change(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.subjectPlaceholder')),
      { target: { value: 'Test subject' } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.contentPlaceholder')),
      { target: { value: 'Test content' } },
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminNewsletter.send.button') }));

    expect(screen.getByText(i18n.t('adminNewsletter.send.recipientsRequired'))).toBeInTheDocument();
  });

  it('shows send button and validation errors when fields are empty', async () => {
    const user = userEvent.setup();
    render(<AdminNewsletterContent />);

    const sendBtn = screen.getByRole('button', { name: i18n.t('adminNewsletter.send.button') });
    expect(sendBtn).toBeInTheDocument();

    await user.click(sendBtn);

    expect(screen.getByText(i18n.t('adminNewsletter.send.subjectRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminNewsletter.send.contentRequired'))).toBeInTheDocument();
  });

  it('clears validation errors when fields are filled', async () => {
    render(<AdminNewsletterContent />);

    const sendBtn = screen.getByRole('button', { name: i18n.t('adminNewsletter.send.button') });
    fireEvent.click(sendBtn);

    expect(screen.getByText(i18n.t('adminNewsletter.send.subjectRequired'))).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.subjectPlaceholder')),
      { target: { value: 'Test subject' } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(i18n.t('adminNewsletter.composer.contentPlaceholder')),
      { target: { value: 'Test content' } },
    );

    expect(screen.queryByText(i18n.t('adminNewsletter.send.subjectRequired'))).not.toBeInTheDocument();
    expect(screen.queryByText(i18n.t('adminNewsletter.send.contentRequired'))).not.toBeInTheDocument();
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
