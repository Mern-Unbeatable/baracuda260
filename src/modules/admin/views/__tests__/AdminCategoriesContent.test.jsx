import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminCategoriesContent from '@/modules/admin/views/AdminCategoriesContent';
import AddCategoryModal from '@/modules/admin/components/admin-categories/AddCategoryModal';

describe('AddCategoryModal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English add-category fields', () => {
    render(<AddCategoryModal open onClose={jest.fn()} onSave={jest.fn()} />);

    expect(screen.getByRole('textbox', { name: i18n.t('adminCategories.addModal.nameLabel') })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(i18n.t('adminCategories.addModal.namePlaceholder')),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCategories.addModal.save') })).toBeInTheDocument();
  });

  it('requires a name before saving', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<AddCategoryModal open onClose={jest.fn()} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.addModal.save') }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText(i18n.t('adminCategories.addModal.nameRequired'))).toBeInTheDocument();
  });

  it('closes via the close icon without saving', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSave = jest.fn();
    render(<AddCategoryModal open onClose={onClose} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.addModal.close') }));

    expect(onClose).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves a trimmed category name', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<AddCategoryModal open onClose={jest.fn()} onSave={onSave} />);

    await user.type(
      screen.getByPlaceholderText(i18n.t('adminCategories.addModal.namePlaceholder')),
      '  Astrophotography  ',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.addModal.save') }));

    expect(onSave).toHaveBeenCalledWith('Astrophotography');
  });

  it('switches add modal copy to Polish', async () => {
    render(<AddCategoryModal open onClose={jest.fn()} onSave={jest.fn()} />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('textbox', { name: 'Nazwa kategorii' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zapisz' })).toBeInTheDocument();
  });
});

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

  it('opens add modal and saves a new category chip', async () => {
    const user = userEvent.setup();
    render(<AdminCategoriesContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.add') }));
    expect(
      screen.getByRole('textbox', { name: i18n.t('adminCategories.addModal.nameLabel') }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(i18n.t('adminCategories.addModal.namePlaceholder')),
      'Documentary',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminCategories.addModal.save') }));

    expect(screen.getByText('Documentary')).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: i18n.t('adminCategories.addModal.nameLabel') }),
    ).not.toBeInTheDocument();
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
