import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import MemberChatContent from '@/portals/member/views/MemberChatContent';

describe('Member chat page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders conversation list and active thread', () => {
    render(<MemberChatContent />);

    expect(screen.getByRole('heading', { level: 1, name: i18n.t('memberChat.title') })).toBeInTheDocument();
    expect(screen.getByText('29')).toBeInTheDocument();
    expect(screen.getAllByText('Azunyan U. Wu').length).toBeGreaterThan(0);
    expect(screen.getByText('@azusanakano_1997')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('memberChat.online'))).toBeInTheDocument();
    expect(screen.getByText('Design_project_2025.docx')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(i18n.t('memberChat.inputPlaceholder'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('memberChat.addNewChat') })).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<MemberChatContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Wiadomości' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Wyślij wiadomość...')).toBeInTheDocument();
  });
});
