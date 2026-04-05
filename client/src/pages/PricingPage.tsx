/**
 * Pricing Page with Stripe Embedded Checkout
 *
 * All users must be authenticated before reaching this page.
 * Uses Stripe Elements for embedded checkout experience.
 *
 * File: client/src/pages/PricingPage.tsx
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Sparkles, ShieldCheck, Star, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';
import { SignIn } from '@clerk/clerk-react';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type CheckoutState = 'pricing' | 'checkout';

export function PricingPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading, getToken } = useAuth();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('pricing');
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const benefits = [
    {
      text: t('pricing.benefits.rewrite', 'AI Resume Rewriter'),
      subtext: t('pricing.benefits.rewriteDesc', 'Instantly integrate missing keywords naturally into your bullet points.')
    },
    {
      text: t('pricing.benefits.coverLetter', 'Custom Cover Letter Generator'),
      subtext: t('pricing.benefits.coverLetterDesc', 'Personalized for this specific job description.')
    },
    {
      text: t('pricing.benefits.score', 'Guaranteed Score Boost'),
      subtext: t('pricing.benefits.scoreDesc', 'Reach 95%+ match to pass ATS filters.')
    },
  ];

  const createCheckoutSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/checkout/create-session`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ billingPeriod: 'monthly' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setCheckoutState('checkout');
      } else {
        throw new Error('No checkout session created');
      }

    } catch (error) {
      console.error("Payment Error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(t('pricing.errors.checkoutFailed', 'Could not start checkout'), {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [getToken, t]);

  const handleBack = () => {
    setClientSecret(null);
    setCheckoutState('pricing');
  };

  // Auth gate: require sign-in before pricing/checkout
  if (!authLoading && !user) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {t('pricing.authGate.title', 'Sign in to upgrade')}
          </h1>
          <p className="text-muted-foreground">
            {t('pricing.authGate.subtitle', 'Create a free account or sign in to access Pro features.')}
          </p>
        </div>
        <SignIn
          routing="hash"
          forceRedirectUrl="/pricing"
          appearance={{
            elements: {
              rootBox: 'mx-auto w-full',
              card: 'shadow-none border border-gray-200 rounded-xl',
            },
          }}
        />
      </div>
    );
  }

  // Render embedded checkout
  if (checkoutState === 'checkout' && clientSecret) {
    return (
      <div className="max-w-lg mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('pricing.back', 'Back')}
        </Button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white text-center">
            <h2 className="text-lg font-semibold">
              {t('pricing.secureCheckout', 'Secure Checkout')}
            </h2>
            <p className="text-sm text-indigo-100">
              {t('pricing.poweredByStripe', 'Powered by Stripe')}
            </p>
          </div>

          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  // Render main pricing page
  return (
    <div className="max-w-lg mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white text-center relative rounded-t-xl">
        {/* PRO Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          PRO
        </div>

        {/* Star Icon */}
        <div className="inline-flex p-3 bg-white/10 rounded-full mb-4 ring-1 ring-white/30 shadow-lg backdrop-blur-md">
          <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {t('pricing.title', 'Unlock the Perfect Resume')}
        </h1>
        <p className="text-indigo-100 text-base">
          {t('pricing.subtitle', 'Get hired faster with AI-powered optimization.')}
        </p>
      </div>

      <div className="p-8 bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-lg">
        {/* Benefits List */}
        <div className="space-y-6 mb-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {benefit.text}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {benefit.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Offer */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-gray-900">$12</span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-center text-sm text-blue-600 mt-1">
            {t('pricing.annualOption', 'or $79/year (save 45%)')}
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            {t('pricing.includes', '50 analyses/month + all Pro features')}
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-indigo-50 rounded-lg p-3 mb-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <span className="text-xs text-indigo-700 font-medium">
            {t('pricing.socialProof', 'Join 500+ professionals who got hired faster')}
          </span>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => createCheckoutSession()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('pricing.processing', 'Processing...')}
              </>
            ) : (
              <>
                {t('pricing.cta', 'Upgrade & Unlock Now')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-3 h-3" />
            <span>{t('pricing.secure', 'Secure SSL Encrypted Payment')}</span>
          </div>

          <p className="text-xs text-gray-400 text-center">
            {t('pricing.guarantee', '30-day money-back guarantee')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
