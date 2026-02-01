/**
 * Checkout Success Page
 *
 * Displayed after successful Stripe payment.
 * Handles session verification and account creation for guests.
 *
 * File: client/src/pages/CheckoutSuccessPage.tsx
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, Sparkles, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';

interface CheckoutSuccessPageProps {
  navigate: (page: string) => void;
}

interface SessionStatus {
  status: 'complete' | 'open' | 'expired';
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required';
  customerEmail: string | null;
}

type PageState = 'loading' | 'success' | 'create-account' | 'error';

export function CheckoutSuccessPage({ navigate }: CheckoutSuccessPageProps) {
  const { t } = useTranslation();
  const { refreshSubscription } = useSubscription();
  const { user, supabase } = useAuth();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [sessionData, setSessionData] = useState<SessionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Account creation form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      // Get session_id from URL
      const urlParams = new URLSearchParams(window.location.search);
      const sid = urlParams.get('session_id');
      setSessionId(sid);

      if (!sid) {
        setError('No session ID found. Please try again.');
        setPageState('error');
        return;
      }

      try {
        const response = await fetch(`/api/checkout/session-status?session_id=${sid}`);

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data: SessionStatus = await response.json();
        setSessionData(data);

        if (data.status === 'complete' && data.paymentStatus === 'paid') {
          // Check if user is logged in
          if (user) {
            // Authenticated user - go straight to success
            setPageState('success');
            await refreshSubscription();
          } else {
            // Guest user - prompt to create account
            setPageState('create-account');
          }
        } else if (data.status === 'expired') {
          setError('This checkout session has expired. Please try again.');
          setPageState('error');
        } else {
          setError('Payment was not completed. Please try again.');
          setPageState('error');
        }
      } catch (err) {
        console.error('Session verification error:', err);
        setError('Unable to verify payment. Please contact support if you were charged.');
        setPageState('error');
      }
    };

    verifySession();
  }, [refreshSubscription, user]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!password) {
      setFormError(t('checkout.createAccount.errors.passwordRequired', 'Password is required'));
      return;
    }

    if (password.length < 8) {
      setFormError(t('checkout.createAccount.errors.passwordTooShort', 'Password must be at least 8 characters'));
      return;
    }

    if (password !== confirmPassword) {
      setFormError(t('checkout.createAccount.errors.passwordMismatch', 'Passwords do not match'));
      return;
    }

    if (!supabase || !sessionData?.customerEmail) {
      setFormError(t('checkout.createAccount.errors.generic', 'Unable to create account. Please try again.'));
      return;
    }

    setIsCreatingAccount(true);

    try {
      // Create account with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: sessionData.customerEmail,
        password: password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Account created - now link the Stripe subscription
        const linkResponse = await fetch('/api/subscription/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.session?.access_token}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            email: sessionData.customerEmail,
          }),
        });

        if (!linkResponse.ok) {
          console.warn('Failed to link subscription, but account was created');
        }

        setAccountCreated(true);
        setPageState('success');
        await refreshSubscription();

        toast.success(t('checkout.createAccount.success', 'Account created successfully!'));
      }
    } catch (err) {
      console.error('Account creation error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setFormError(message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleSkipAccountCreation = () => {
    setPageState('success');
  };

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('checkout.verifying', 'Verifying your payment...')}
          </h2>
          <p className="text-gray-500">
            {t('checkout.pleaseWait', 'Please wait while we confirm your purchase.')}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (pageState === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              {t('checkout.errorTitle', 'Payment Issue')}
            </CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => navigate('pricing')}
            >
              {t('checkout.tryAgain', 'Try Again')}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('home')}
            >
              {t('checkout.backHome', 'Back to Home')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create account state (for guests)
  if (pageState === 'create-account') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-8">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {t('checkout.createAccount.title', 'Payment Successful!')}
            </CardTitle>
            <CardDescription className="text-base">
              {t('checkout.createAccount.subtitle', 'Create your account to access your Pro features')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account creation form */}
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t('checkout.createAccount.emailLabel', 'Your Email')}
                    </p>
                    <p className="text-sm text-gray-600">{sessionData?.customerEmail}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      {t('checkout.createAccount.passwordLabel', 'Create Password')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="••••••••"
                      className="mt-1"
                      autoFocus
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">
                      {t('checkout.createAccount.confirmLabel', 'Confirm Password')}
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 text-center">{formError}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isCreatingAccount}
              >
                {isCreatingAccount ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('checkout.createAccount.creating', 'Creating Account...')}
                  </>
                ) : (
                  <>
                    {t('checkout.createAccount.submit', 'Create Account & Continue')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Benefits reminder */}
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <p className="text-sm text-indigo-700">
                <Sparkles className="w-4 h-4 inline mr-1" />
                {t('checkout.createAccount.whyCreate', 'Create an account to manage your subscription and save analyses')}
              </p>
            </div>

            {/* Skip option */}
            <button
              type="button"
              onClick={handleSkipAccountCreation}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {t('checkout.createAccount.skip', 'Skip for now (you can create an account later)')}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-8">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            {t('checkout.successTitle', 'Welcome to Pro!')}
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </CardTitle>
          <CardDescription className="text-lg">
            {accountCreated
              ? t('checkout.successMessageWithAccount', 'Your account is ready! You now have full access to all Pro features.')
              : t('checkout.successMessage', 'Your payment was successful. You now have full access to all Pro features.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features unlocked */}
          <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-indigo-900 text-sm uppercase tracking-wide">
              {t('checkout.unlockedFeatures', 'Your Pro Benefits')}
            </h3>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {t('checkout.feature1', 'AI Resume Rewriter - Optimize your resume instantly')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {t('checkout.feature2', 'Custom Cover Letter Generator')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {t('checkout.feature3', '50 analyses per month')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {t('checkout.feature4', 'Interview prep questions')}
              </li>
            </ul>
          </div>

          {/* Email confirmation */}
          {sessionData?.customerEmail && (
            <p className="text-sm text-gray-500 text-center">
              {t('checkout.confirmationSent', 'A confirmation email has been sent to')}{' '}
              <span className="font-medium text-gray-700">{sessionData.customerEmail}</span>
            </p>
          )}

          {/* CTA */}
          <Button
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('analyze')}
          >
            {t('checkout.startAnalyzing', 'Start Analyzing Your Resume')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-gray-400 text-center">
            {t('checkout.supportNote', 'Questions? Contact us at support@airesume.tailor')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckoutSuccessPage;
