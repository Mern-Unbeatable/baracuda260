/** Admin My Profile — Figma node 339:5727. */

const A = '/assets/admin-profile';

export const ADMIN_PROFILE_ASSETS = {
  user: `${A}/icon-user.svg`,
  eye: `${A}/icon-eye.svg`,
  eyeOff: `${A}/icon-eye-off.svg`,
};

export const USER_ICON_SIZE = 56;
export const AVATAR_SIZE = 89;
export const EYE_ICON_WIDTH = 22;
export const EYE_ICON_HEIGHT = 15;

export const DEFAULT_ADMIN_PROFILE = {
  displayName: 'Chowdhury Group Of Industries',
  displayEmail: 'chowdhury@gmail.com',
  name: 'John Industries',
  email: 'admin@johnindustries.com',
};

export const MIN_PASSWORD_LENGTH = 8;

/**
 * @param {{
 *   currentPassword: string,
 *   newPassword: string,
 *   confirmPassword: string,
 * }} values
 * @param {(key: string) => string} t
 */
export const validatePasswordChange = (values, t) => {
  const next = {};
  const { currentPassword, newPassword, confirmPassword } = values;

  if (!currentPassword) next.currentPassword = t('userProfile.errors.currentRequired');
  if (!newPassword) next.newPassword = t('userProfile.errors.newRequired');
  else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    next.newPassword = t('userProfile.errors.newTooShort');
  }
  if (!confirmPassword) next.confirmPassword = t('userProfile.errors.confirmRequired');
  else if (newPassword && confirmPassword !== newPassword) {
    next.confirmPassword = t('userProfile.errors.confirmMismatch');
  }

  return next;
};

/**
 * @param {{ name: string, email: string }} values
 * @param {(key: string) => string} t
 */
export const validateProfileUpdate = (values, t) => {
  const next = {};
  if (!values.name?.trim()) next.name = t('userProfile.errors.nameRequired');
  if (!values.email?.trim()) next.email = t('userProfile.errors.emailRequired');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    next.email = t('userProfile.errors.emailInvalid');
  }
  return next;
};
