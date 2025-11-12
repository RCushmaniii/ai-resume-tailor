import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Do I need to create an account?',
      answer: 'No! Simply paste your resume and job description to get instant results. No signup, no email required.',
    },
    {
      question: 'Is my data stored or shared?',
      answer: 'Never. Analysis happens in real-time and nothing is saved to our servers. Your resume and personal information remain completely private.',
    },
    {
      question: 'What AI model powers this?',
      answer: 'We use GPT-4 Turbo, the same advanced AI that powers ChatGPT Plus. It\'s trained on thousands of successful resumes and job descriptions.',
    },
    {
      question: 'Does it work for all industries?',
      answer: 'Yes! Our AI analyzes any resume against any job description, from tech and finance to healthcare and creative fields.',
    },
    {
      question: 'How accurate is the analysis?',
      answer: 'Our AI provides objective analysis based on keyword matching, semantic similarity, and professional writing standards. While no tool is perfect, our users report 85% average match scores.',
    },
    {
      question: 'Can I analyze multiple resumes?',
      answer: 'Absolutely! There\'s no limit. Analyze as many resume-job combinations as you need, completely free.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about AI Resume Tailor
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
