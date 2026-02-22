/**
 * Checkout Success Page
 *
 * Displayed after successful Stripe payment.
 * Handles session verification and prompts guests to create an account.
 *
 * File: client/src/pages/CheckoutSuccessPage.tsx
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/lib/useAuth';
import { SignUp } from '@clerk/clerk-react';

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
  const { user, getToken } = useAuth();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [sessionData, setSessionData] = useState<SessionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
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

  // When user signs up via Clerk's SignUp component, claim the subscription
  useEffect(() => {
    const claimSubscription = async () => {
      if (user && sessionData?.customerEmail && pageState === 'create-account') {
        try {
          const token = await getToken();
          const apiUrl = import.meta.env.VITE_API_URL || '/api';
          const linkResponse = await fetch(`${apiUrl}/subscription/claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              session_id: sessionId,
              email: sessionData.customerEmail,
            }),
          });

          if (!linkResponse.ok) {
            console.warn('Failed to link subscription, but account was created');
          }

          setPageState('success');
          await refreshSubscription();
        } catch (err) {
          console.error('Failed to claim subscription:', err);
          setPageState('success');
        }
      }
    };

    claimSubscription();
  }, [user, sessionData, pageState, getToken, sessionId, refreshSubscription]);

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

  // Create account state (for guests) - use Clerk's SignUp
  if (pageState === 'create-account') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-8">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('checkout.createAccount.title', 'Payment Successful!')}
            </h2>
            <p className="text-gray-600 mt-2">
              {t('checkout.createAccount.subtitle', 'Create your account to access your Pro features')}
            </p>
          </div>

          <SignUp
            routing="hash"
            forceRedirectUrl="/analyze"
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-none border border-gray-200',
              },
            }}
          />

          <button
            type="button"
            onClick={handleSkipAccountCreation}
            className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {t('checkout.createAccount.skip', 'Skip for now (you can create an account later)')}
          </button>
        </div>
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
            {t('checkout.successMessage', 'Your payment was successful. You now have full access to all Pro features.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {sessionData?.customerEmail && (
            <p className="text-sm text-gray-500 text-center">
              {t('checkout.confirmationSent', 'A confirmation email has been sent to')}{' '}
              <span className="font-medium text-gray-700">{sessionData.customerEmail}</span>
            </p>
          )}

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
