import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import { ROUTES } from '@/shared/config';
import {
  appendDemoProfile,
  buildDemoProfileFromForm,
  getDemoProfilesStore,
  isDemoProfileFormValid,
  normalizeUsername,
  resetDemoProfilesStore,
} from '@/portals/admin/data/adminDemoProfilesData';
import AdminDemoProfilesCreateContent from '@/portals/admin/views/AdminDemoProfilesCreateContent';

const mockNavigate = jest.fn();

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

describe('Admin Demo Profiles create', () => {
  beforeEach(() => {
    resetDemoProfilesStore();
    mockNavigate.mockReset();
  });

  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders create form fields and actions', () => {
    render(<AdminDemoProfilesCreateContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminDemoProfiles.create.title') }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminDemoProfiles.create.submit') })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: i18n.t('adminDemoProfiles.create.back') })).toHaveAttribute(
      'href',
      ROUTES.ADMIN_DEMO_PROFILES,
    );
  });

  it('shows validation when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<AdminDemoProfilesCreateContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminDemoProfiles.create.submit') }));

    expect(screen.getByText(i18n.t('adminDemoProfiles.create.fullNameRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminDemoProfiles.create.formInvalid'))).toBeInTheDocument();
  });

  it('adds another social link field', async () => {
    const user = userEvent.setup();
    render(<AdminDemoProfilesCreateContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminDemoProfiles.create.addSocial') }));

    expect(screen.getAllByPlaceholderText(i18n.t('adminDemoProfiles.create.socialPlaceholder'))).toHaveLength(2);
  });

  it('creates a profile and navigates back to the list', async () => {
    const user = userEvent.setup();
    render(<AdminDemoProfilesCreateContent />);

    await user.type(
      screen.getByPlaceholderText(i18n.t('adminDemoProfiles.create.fullNamePlaceholder')),
      'Alex Morgan',
    );
    await user.type(
      screen.getByPlaceholderText(i18n.t('adminDemoProfiles.create.usernamePlaceholder')),
      'alexmorgan',
    );
    await user.type(
      screen.getByPlaceholderText(i18n.t('adminDemoProfiles.create.phonePlaceholder')),
      '+1 555 000 1111',
    );
    await user.type(
      screen.getByPlaceholderText(i18n.t('adminDemoProfiles.create.emailPlaceholder')),
      'alex@demo.io',
    );
    await user.type(
      screen.getByPlaceholderText(i18n.t('adminDemoProfiles.create.bioPlaceholder')),
      'Demo landscape photographer.',
    );
    await user.type(
      screen.getByPlaceholderText(i18n.t('adminDemoProfiles.create.socialPlaceholder')),
      'instagram.com/alexmorgan',
    );

    await user.click(screen.getByRole('button', { name: i18n.t('adminDemoProfiles.create.submit') }));

    expect(getDemoProfilesStore()).toHaveLength(11);
    expect(getDemoProfilesStore().at(-1).name).toBe('Alex Morgan');
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN_DEMO_PROFILES);
  });
});

describe('adminDemoProfilesData create helpers', () => {
  beforeEach(() => {
    resetDemoProfilesStore();
  });

  it('validates and builds a demo profile from form values', () => {
    const values = {
      fullName: 'Alex Morgan',
      username: 'alexmorgan',
      phone: '+1 555 000 1111',
      email: 'alex@demo.io',
      bio: 'Demo landscape photographer.',
      socialLinks: ['instagram.com/alexmorgan'],
      isActive: true,
      profilePhotoName: '',
      profilePhotoPreview: '',
      coverPhotoName: '',
      coverPhotoPreview: '',
    };

    expect(isDemoProfileFormValid(values)).toBe(true);
    expect(normalizeUsername('alexmorgan')).toBe('@alexmorgan');

    const profile = buildDemoProfileFromForm(values);
    expect(profile.name).toBe('Alex Morgan');
    expect(profile.username).toBe('@alexmorgan');
    expect(profile.socialUrl).toBe('instagram.com/alexmorgan');

    appendDemoProfile(profile);
    expect(getDemoProfilesStore()).toHaveLength(11);
  });
});
