/**
 * Login Page
 *
 * User login page with Supabase Auth integration.
 * Supports OAuth (Google, LinkedIn) and email/password login.
 *
 * File: client/src/pages/LoginPage.tsx
 */

import type { ReactElement, FormEvent } from 'react';
import { useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';
import { SocialLoginButtons, OrDivider } from '../components/auth/SocialLoginButtons';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  navigate?: (page: string) => void;
}

export function LoginPage({ navigate }: LoginPageProps): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError('Authentication service is not configured. Please try again later.');
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Provide user-friendly error messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (navigate) {
        navigate('analyze');
      } else {
        window.location.href = '/analyze';
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    if (navigate) {
      navigate('signup');
    } else {
      window.location.href = '/signup';
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue analyzing resumes
          </p>
        </div>

        {/* Social Login Buttons */}
        <SocialLoginButtons
          mode="login"
          disabled={loading}
          onError={setError}
        />

        <OrDivider />

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={handleSignupClick}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create one for free
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
