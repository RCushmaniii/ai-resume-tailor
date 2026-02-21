/**
 * Pricing Page with Stripe Embedded Checkout
 *
 * Supports both authenticated users and guest checkout.
 * Uses Stripe Elements for embedded checkout experience.
 *
 * File: client/src/pages/PricingPage.tsx
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Sparkles, ShieldCheck, Star, ArrowRight, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type CheckoutState = 'pricing' | 'email' | 'checkout';

export function PricingPage() {
  const { t } = useTranslation();
  const { user, getToken } = useAuth();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('pricing');
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const createCheckoutSession = useCallback(async (email?: string) => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      // Add auth token if user is logged in
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body: Record<string, string> = { billingPeriod: 'monthly' };
      if (email) {
        body.email = email;
      }

      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
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

  const handleUpgradeClick = () => {
    if (user) {
      // Logged in user - go directly to checkout
      createCheckoutSession();
    } else {
      // Guest - show email form
      setCheckoutState('email');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!guestEmail.trim()) {
      setEmailError(t('pricing.errors.emailRequired', 'Email is required'));
      return;
    }

    if (!validateEmail(guestEmail)) {
      setEmailError(t('pricing.errors.emailInvalid', 'Please enter a valid email'));
      return;
    }

    createCheckoutSession(guestEmail);
  };

  const handleBack = () => {
    if (checkoutState === 'checkout') {
      setClientSecret(null);
      setCheckoutState(user ? 'pricing' : 'email');
    } else {
      setCheckoutState('pricing');
    }
  };

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

  // Render email form for guest checkout
  if (checkoutState === 'email') {
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

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-indigo-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t('pricing.guestCheckout.title', 'Enter Your Email')}
            </h2>
            <p className="text-gray-500 text-sm">
              {t('pricing.guestCheckout.description', "We'll send your receipt and Pro access details here.")}
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('pricing.guestCheckout.emailLabel', 'Email Address')}</Label>
              <Input
                id="email"
                type="email"
                value={guestEmail}
                onChange={(e) => {
                  setGuestEmail(e.target.value);
                  setEmailError(null);
                }}
                placeholder="you@example.com"
                className={emailError ? 'border-red-500' : ''}
                autoFocus
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('pricing.processing', 'Processing...')}
                </>
              ) : (
                <>
                  {t('pricing.continueToPayment', 'Continue to Payment')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            {t('pricing.guestCheckout.accountNote', 'You can create an account after purchase to manage your subscription.')}
          </p>
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
                <h4 className="font-bold text-gray-900 text-sm">
                  {benefit.text}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {benefit.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Offer */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {t('pricing.oneTimePayment', 'One-time payment')}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">$4.99</span>
              <span className="text-sm text-gray-400 line-through decoration-gray-400">$19.99</span>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              75% OFF
            </span>
          </div>
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
            onClick={handleUpgradeClick}
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
