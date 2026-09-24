import { useState, useRef } from 'react';
import { Navigation, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login } from '../api/client';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');

    try {
      const { token } = await login(username, password);
      localStorage.setItem('admin_token', token);
      onLogin(token);
    } catch (err: any) {
      setError(err.message === 'HTTP 401'
        ? 'Invalid username or password.'
        : 'Could not connect to server. Make sure the backend is running.');
      setLoading(false);
      usernameRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 font-sans p-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-purple-600 shadow-2xl shadow-purple-600/40 mb-4">
            <Navigation className="h-9 w-9 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">UNIJOS Campus Navigator</p>
        </div>

        {/* Login card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" aria-hidden="true" />
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-username" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <input
                id="admin-username"
                ref={usernameRef}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                aria-required="true"
                aria-describedby={error ? 'login-error' : undefined}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="admin"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPw
                    ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                    : <Eye className="h-4 w-4" aria-hidden="true" />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                id="login-error"
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              aria-busy={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Back to map */}
        <button
          onClick={() => { window.location.hash = ''; }}
          className="w-full mt-4 py-2.5 text-sm text-slate-400 hover:text-white transition-colors text-center"
        >
          ← Back to map
        </button>
      </div>
    </div>
  );
}
