import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { ROUTES, APP_CONFIG } from '../config';
import { httpMethods } from '../services/httpMethods';
import { API_ENDPOINTS } from '../services/httpEndpoint';

import {
  LogIn,
  ShieldCheck,
  BarChart3,
  Users,
  Settings,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

const FEATURES = [
  { icon: BarChart3, label: 'Real-time analytics & reporting' },
  { icon: Users, label: 'Lead & customer management' },
  { icon: Settings, label: 'Full platform configuration' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(process.env.REACT_APP_DEV_DEFAULT_EMAIL || '');
  const [password, setPassword] = useState(process.env.REACT_APP_DEV_DEFAULT_PASSWORD || '');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      // ── Dev-only bypass: skip API when backend is not yet connected ──
      if (process.env.REACT_APP_DEV_MOCK_AUTH === 'true') {
        dispatch(loginSuccess({ user: { email }, token: null }));
        const destination = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
        navigate(destination, { replace: true });
        return;
      }

      const { data, error } = await httpMethods.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      if (error) {
        setErrors({
          form: error?.data?.message ?? error?.message ?? 'Invalid email or password.',
        });
        return;
      }
      const token = data?.token ?? data?.data?.token ?? data?.accessToken;
      const user = data?.user ?? data?.data?.user ?? null;
      dispatch(loginSuccess({ user, token }));
      const destination = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
      navigate(destination, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex">
      <div className="hidden lg:flex lg:w-[52%] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-orange-600/8 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
            <ShieldCheck size={20} className="text-white" aria-hidden="true" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">{APP_CONFIG.NAME}</span>
        </div>

        <div className="relative z-10">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Admin Dashboard
          </p>
          <h2 className="text-5xl font-bold text-white leading-tight mb-5">
            Welcome
            <br />
            back.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-12 max-w-xs">
            Sign in to manage your orders, leads, and platform settings from one powerful place.
          </p>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-orange-400" aria-hidden="true" />
                </div>
                <span className="text-slate-300 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">
          MakTech Admin Platform &mdash; v1.0
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center lg:hidden shadow-md shadow-orange-600/25">
              <ShieldCheck size={16} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">MakTech</span>
          </div>
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors duration-200 group"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to Home
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Sign in to your account</h1>
              <p className="text-gray-500 text-sm">
                Enter your credentials to continue to the dashboard.
              </p>
            </div>

            {errors.form && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5"
              >
                {errors.form}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-5 mb-7">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@test.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all shadow-sm ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={`w-full px-4 py-3 pr-11 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all shadow-sm ${
                      errors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 hover:shadow-orange-500/35 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn size={18} aria-hidden="true" />
                )}
                {isLoading ? 'Signing in…' : 'Sign In to Dashboard'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              &copy; {new Date().getFullYear()} {process.env.REACT_APP_NAME || 'My React App'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
