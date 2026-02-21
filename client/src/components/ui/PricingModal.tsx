import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ShieldCheck, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      const response = await fetch('/api/checkout/create-session', {
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
        // For embedded checkout, would need Stripe.js integration
        console.log('Checkout session created:', data.sessionId);
        alert('Stripe checkout integration in progress. Session ID: ' + data.sessionId);
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error) {
      console.error("Payment Error:", error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Could not initialize payment: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      handleUpgrade();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl">
        
        {/* Hero Header: Gradient Background */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white text-center relative">
          {/* PRO Badge */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            PRO
          </div>
          
          {/* Star Icon */}
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-4 ring-1 ring-white/30 shadow-lg backdrop-blur-md">
            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
          </div>
          
          <DialogTitle className="text-2xl font-bold mb-2">
            {t('pricing.title', 'Unlock the Perfect Resume')}
          </DialogTitle>
          <DialogDescription className="text-indigo-100 text-base">
            {t('pricing.subtitle', 'Get hired faster with AI-powered optimization.')}
          </DialogDescription>
        </div>

        <div className="p-8 bg-white">
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
          <DialogFooter className="flex-col sm:justify-center gap-3">
            <Button 
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCustomUpgrade}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
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
              {t('pricing.guarantee', '30-day money-back guarantee • Cancel anytime')}
            </p>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PricingModal;
