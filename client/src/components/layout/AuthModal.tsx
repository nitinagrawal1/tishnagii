import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { getAuthErrorMessage } from '../../firebase';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser } = useShop();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const runAuthAction = async (action: () => Promise<void>) => {
    setError('');
    setIsSubmitting(true);
    try {
      await action();
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    return runAuthAction(() => mode === 'signin'
      ? signInWithEmail(email, password)
      : signUpWithEmail(email, password));
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto p-4 flex items-center justify-center" role="presentation">
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
        aria-label="Close account dialog"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
        className="relative z-10 w-full max-w-md overflow-hidden border border-ivory-200 bg-ivory-50 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ivory-200 bg-ivory-100 px-5 py-4">
          <div>
            <h2 id="account-dialog-title" className="font-serif text-lg font-medium text-burgundy-900">
              {user ? 'Your TISHNAGII account' : mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-xs text-burgundy-700/70">
              {user
                ? 'Your account is ready.'
                : mode === 'signin'
                  ? 'Sign in to continue to your account.'
                  : 'Create an account to save your favorites.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account dialog"
            className="rounded-full p-1.5 text-burgundy-900 transition-colors hover:bg-ivory-200/50 hover:text-gold-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {authLoading ? (
            <p className="py-5 text-center text-sm text-burgundy-700/70">Checking your session...</p>
          ) : user ? (
            <div className="space-y-5">
              <div className="border border-ivory-200 bg-white/50 p-4">
                <p className="text-xs uppercase tracking-wider text-burgundy-700/60">Signed in as</p>
                <p className="mt-1 break-all text-sm font-medium text-burgundy-900">
                  {user.displayName || user.email}
                </p>
                {user.displayName && <p className="text-xs text-burgundy-700/70">{user.email}</p>}
              </div>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => runAuthAction(signOutUser)}
                className="w-full border border-burgundy-900 px-4 py-3 text-sm font-medium text-burgundy-900 transition-colors hover:bg-burgundy-900 hover:text-ivory-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="account-email" className="mb-1 block text-xs font-medium text-burgundy-900">
                    Email address
                  </label>
                  <input
                    id="account-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full border border-ivory-200 bg-white/60 px-3 py-2.5 text-sm text-burgundy-900 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="account-password" className="mb-1 block text-xs font-medium text-burgundy-900">
                    Password
                  </label>
                  <input
                    id="account-password"
                    type="password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    minLength={6}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border border-ivory-200 bg-white/60 px-3 py-2.5 text-sm text-burgundy-900 focus:border-gold-500 focus:outline-none"
                  />
                </div>
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-burgundy-900 px-4 py-3 text-sm font-medium text-ivory-50 transition-colors hover:bg-burgundy-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign in with email' : 'Create account'}
                </button>
              </form>

              <div className="my-4 flex items-center gap-3 text-[11px] text-burgundy-700/50">
                <span className="h-px flex-1 bg-ivory-200" />
                <span>OR</span>
                <span className="h-px flex-1 bg-ivory-200" />
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => runAuthAction(signInWithGoogle)}
                className="w-full border border-ivory-200 bg-white/60 px-4 py-3 text-sm font-medium text-burgundy-900 transition-colors hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue with Google
              </button>

              <p className="mt-5 text-center text-sm text-burgundy-700/75">
                {mode === 'signin' ? "New to TISHNAGII?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="font-medium text-burgundy-900 underline decoration-gold-500 underline-offset-4"
                >
                  {mode === 'signin' ? 'Create an account' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};