import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('landing.faq.items.q1.question'),
      answer: t('landing.faq.items.q1.answer'),
    },
    {
      question: t('landing.faq.items.q2.question'),
      answer: t('landing.faq.items.q2.answer'),
    },
    {
      question: t('landing.faq.items.q3.question'),
      answer: t('landing.faq.items.q3.answer'),
    },
    {
      question: t('landing.faq.items.q4.question'),
      answer: t('landing.faq.items.q4.answer'),
    },
    {
      question: t('landing.faq.items.q5.question'),
      answer: t('landing.faq.items.q5.answer'),
    },
    {
      question: t('landing.faq.items.q6.question'),
      answer: t('landing.faq.items.q6.answer'),
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('landing.faq.heading')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('landing.faq.subheading')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
