import React, { useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { menuService } from '../../services/mockMenuService';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await menuService.authenticate(mode, {
        name: mode === 'register' ? name : undefined,
        email,
        password,
      });
      onAuthenticated();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F5F7] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-[430px] rounded-xl bg-white border border-[#E3E6E8] px-8 py-9 shadow-[0_12px_30px_rgba(20,30,35,0.10)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#1C1D1F] text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="font-serif-display text-[28px] font-bold text-[#17191B]">MenuOptimizer</h1>
          <p className="mt-2 text-sm text-[#687078]">
            Sign in to your hospitality workspace
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === 'register' && (
            <label className="block text-sm font-semibold text-[#202326]">
              Name
              <input
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-1.5 w-full rounded-md border border-[#D2D7DB] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#874A2B] focus:ring-2 focus:ring-[#874A2B]/10"
              />
            </label>
          )}

          <label className="block text-sm font-semibold text-[#202326]">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="mt-1.5 w-full rounded-md border border-[#D2D7DB] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#874A2B] focus:ring-2 focus:ring-[#874A2B]/10"
            />
          </label>

          <label className="block text-sm font-semibold text-[#202326]">
            Password
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-1.5 w-full rounded-md border border-[#D2D7DB] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#874A2B] focus:ring-2 focus:ring-[#874A2B]/10"
            />
          </label>

          {error && <p className="text-sm text-[#9A3827]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1C1D1F] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#34353A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? 'Signing in...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#33383D]">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="font-semibold text-[#874A2B] underline underline-offset-2"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  );
};
