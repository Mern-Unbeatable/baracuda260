/** Demo login accounts for User / Admin dashboards. */
export const DEMO_PASSWORD = 'password';

export const DEMO_ACCOUNTS = {
  user: {
    email: 'user@gmail.com',
    fullName: 'Sarah Jenkins',
    role: 'user',
  },
  admin: {
    email: 'admin@gmail.com',
    fullName: 'Admin',
    role: 'admin',
  },
};

export const getDemoAccount = (email, password) => {
  const normalized = String(email || '')
    .trim()
    .toLowerCase();
  if (password !== DEMO_PASSWORD) return null;

  if (normalized === DEMO_ACCOUNTS.user.email) return { ...DEMO_ACCOUNTS.user };
  if (normalized === DEMO_ACCOUNTS.admin.email) return { ...DEMO_ACCOUNTS.admin };
  return null;
};
