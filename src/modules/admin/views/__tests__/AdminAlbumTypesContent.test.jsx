import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminAlbumTypesContent from '@/modules/admin/views/AdminAlbumTypesContent';
import AlbumTypeModal from '@/modules/admin/components/admin-album-types/AlbumTypeModal';
import { MODAL_MODE } from '@/modules/admin/data/adminAlbumTypesData';

describe('AlbumTypeModal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English create-modal fields', () => {
    render(
      <AlbumTypeModal open mode={MODAL_MODE.CREATE} onClose={jest.fn()} onSave={jest.fn()} />,
    );

    expect(
      screen.getByRole('heading', { name: i18n.t('adminAlbumTypes.modal.createTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Album type name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prize money/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.modal.save') })).toBeInTheDocument();
  });

  it('requires fields before saving', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(
      <AlbumTypeModal open mode={MODAL_MODE.CREATE} onClose={jest.fn()} onSave={onSave} />,
    );

    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.modal.save') }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText(i18n.t('adminAlbumTypes.modal.nameRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAlbumTypes.modal.prizeRequired'))).toBeInTheDocument();
  });

  it('saves a valid create form', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(
      <AlbumTypeModal open mode={MODAL_MODE.CREATE} onClose={jest.fn()} onSave={onSave} />,
    );

    await user.type(screen.getByLabelText(/Album type name/i), 'Documentary');
    await user.type(screen.getByLabelText(/Prize money/i), '1200.50');
    await user.type(screen.getByLabelText(/Description/i), 'A long-form visual essay.');
    await user.type(screen.getByLabelText(/Featured/i), 'Feature A{enter}Feature B');
    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.modal.save') }));

    expect(onSave).toHaveBeenCalledWith({
      name: 'Documentary',
      prizeMoney: '1200.50',
      description: 'A long-form visual essay.',
      featured: 'Feature A\nFeature B',
    });
  });

  it('prefills edit values and closes via cancel', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const albumType = {
      id: 'single-photo',
      name: 'Single Photo',
      description: 'One shot.',
      features: ['Monthly competition'],
      prizeMoney: 1500,
    };

    render(
      <AlbumTypeModal
        open
        mode={MODAL_MODE.EDIT}
        albumType={albumType}
        onClose={onClose}
        onSave={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: i18n.t('adminAlbumTypes.modal.editTitle') }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Album type name/i)).toHaveValue('Single Photo');
    expect(screen.getByLabelText(/Prize money/i)).toHaveValue('1500.00');

    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.modal.cancel') }));
    expect(onClose).toHaveBeenCalled();
  });

  it('switches modal copy to Polish', async () => {
    render(
      <AlbumTypeModal open mode={MODAL_MODE.CREATE} onClose={jest.fn()} onSave={jest.fn()} />,
    );

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { name: 'Nowy typ albumu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zapisz zmiany' })).toBeInTheDocument();
  });
});

describe('Admin Album types content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header and three album cards', () => {
    render(<AdminAlbumTypesContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminAlbumTypes.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAlbumTypes.eyebrow'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAlbumTypes.subtitle'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.create') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAlbumTypes.items.single.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAlbumTypes.items.six.name'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminAlbumTypes.items.zodiac.name'))).toBeInTheDocument();
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
    expect(screen.getByText('$2500.00')).toBeInTheDocument();
    expect(screen.getByText('$3500.00')).toBeInTheDocument();
  });

  it('opens create modal from the header CTA', async () => {
    const user = userEvent.setup();
    render(<AdminAlbumTypesContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.create') }));

    expect(
      screen.getByRole('heading', { name: i18n.t('adminAlbumTypes.modal.createTitle') }),
    ).toBeInTheDocument();
  });

  it('opens edit modal with card values and saves updates', async () => {
    const user = userEvent.setup();
    render(<AdminAlbumTypesContent />);

    const singleHeading = screen.getByRole('heading', {
      name: i18n.t('adminAlbumTypes.items.single.name'),
    });
    const card = singleHeading.closest('article');
    expect(card).not.toBeNull();

    await user.click(
      within(card).getByRole('button', { name: i18n.t('adminAlbumTypes.editAlbum') }),
    );

    expect(
      screen.getByRole('heading', { name: i18n.t('adminAlbumTypes.modal.editTitle') }),
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Album type name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Single Photo Plus');
    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.modal.save') }));

    expect(screen.getByText('Single Photo Plus')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: i18n.t('adminAlbumTypes.modal.editTitle') }),
    ).not.toBeInTheDocument();
  });

  it('creates a new album type card', async () => {
    const user = userEvent.setup();
    render(<AdminAlbumTypesContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.create') }));
    await user.type(screen.getByLabelText(/Album type name/i), 'Portrait Series');
    await user.type(screen.getByLabelText(/Prize money/i), '900');
    await user.type(screen.getByLabelText(/Description/i), 'A portrait-focused format.');
    await user.type(screen.getByLabelText(/Featured/i), 'Studio lighting');
    await user.click(screen.getByRole('button', { name: i18n.t('adminAlbumTypes.modal.save') }));

    expect(screen.getByText('Portrait Series')).toBeInTheDocument();
    expect(screen.getByText('$900.00')).toBeInTheDocument();
  });

  it('switches album types copy to Polish', async () => {
    render(<AdminAlbumTypesContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Typy albumów' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '＋ Utwórz typ albumu' })).toBeInTheDocument();
    expect(screen.getByText('Pojedyncze zdjęcie')).toBeInTheDocument();
    expect(screen.getByText('Historia 6 zdjęć')).toBeInTheDocument();
  });
});
