import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import AdminCategoriesContent from '../AdminCategoriesContent';

describe('Admin Categories content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, panel, and category chips', () => {
    render(<AdminCategoriesContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminCategories.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCategories.eyebrow'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCategories.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminCategories.panelTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCategories.add') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCategories.items.nature'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCategories.items.street'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCategories.items.night'))).toBeInTheDocument();
  });

  it('removes a category chip when trash is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminCategoriesContent />);

    const natureLabel = i18n.t('adminCategories.items.nature');
    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.remove', { name: natureLabel }) }));

    expect(screen.queryByText(natureLabel)).not.toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCategories.items.portrait'))).toBeInTheDocument();
  });

  it('adds a new category chip', async () => {
    const user = userEvent.setup();
    render(<AdminCategoriesContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.add') }));

    expect(
      screen.getByText(i18n.t('adminCategories.items.newCategory', { number: 1 })),
    ).toBeInTheDocument();
  });

  it('switches categories copy to Polish', async () => {
    render(<AdminCategoriesContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Kategorie' })).toBeInTheDocument();
    expect(screen.getByText('TAKSONOMIA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dodaj kategorię' })).toBeInTheDocument();
    expect(screen.getByText('Natura')).toBeInTheDocument();
    expect(screen.getByText('Fotografia uliczna')).toBeInTheDocument();
  });
});
