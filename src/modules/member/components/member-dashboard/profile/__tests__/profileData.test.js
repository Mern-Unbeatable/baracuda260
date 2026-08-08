import {
  DEFAULT_ADMIN_PROFILE,
  validatePasswordChange,
  validateProfileUpdate,
} from '@/modules/member/data/profileData';

const t = (key) => key;

describe('admin profile data helpers', () => {
  it('exposes Figma default profile values', () => {
    expect(DEFAULT_ADMIN_PROFILE.displayName).toBe('Chowdhury Group Of Industries');
    expect(DEFAULT_ADMIN_PROFILE.email).toBe('admin@johnindustries.com');
  });

  it('validates profile update fields', () => {
    expect(validateProfileUpdate({ name: '', email: '' }, t)).toEqual({
      name: 'userProfile.errors.nameRequired',
      email: 'userProfile.errors.emailRequired',
    });
    expect(validateProfileUpdate({ name: 'A', email: 'bad' }, t)).toEqual({
      email: 'userProfile.errors.emailInvalid',
    });
    expect(validateProfileUpdate({ name: 'A', email: 'a@b.com' }, t)).toEqual({});
  });

  it('validates password change fields', () => {
    expect(
      validatePasswordChange(
        { currentPassword: '', newPassword: '', confirmPassword: '' },
        t,
      ),
    ).toEqual({
      currentPassword: 'userProfile.errors.currentRequired',
      newPassword: 'userProfile.errors.newRequired',
      confirmPassword: 'userProfile.errors.confirmRequired',
    });
    expect(
      validatePasswordChange(
        { currentPassword: 'old', newPassword: 'short', confirmPassword: 'short' },
        t,
      ),
    ).toEqual({
      newPassword: 'userProfile.errors.newTooShort',
    });
    expect(
      validatePasswordChange(
        {
          currentPassword: 'oldpass12',
          newPassword: 'newpass12',
          confirmPassword: 'mismatch1',
        },
        t,
      ),
    ).toEqual({
      confirmPassword: 'userProfile.errors.confirmMismatch',
    });
  });
});
