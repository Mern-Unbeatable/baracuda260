export const DEFAULT_MEMBER_SETTINGS = {
  fullName: 'Sarah Jenkins',
  username: '@sarajenkis',
  phone: '0416584 - 4551',
  email: 'sarah@yk.com',
  website: 'www.ismail.com',
  facebook: 'www.facebook.com',
  instagram: '@ismail1256',
  twitter: 'www.twitter.com',
  linkedin: '@ismail1256',
};

export const validateMemberProfile = (values, t) => {
  const next = {};
  if (!values.fullName?.trim()) next.fullName = t('memberSettings.errors.fullNameRequired');
  if (!values.username?.trim()) next.username = t('memberSettings.errors.usernameRequired');
  if (!values.phone?.trim()) next.phone = t('memberSettings.errors.phoneRequired');
  if (!values.email?.trim()) next.email = t('memberSettings.errors.emailRequired');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    next.email = t('memberSettings.errors.emailInvalid');
  }
  return next;
};
