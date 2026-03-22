import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel or change your plan at any time. No long-term contracts.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Absolutely! All plans come with a 14-day free trial – no credit card required.',
  },
  {
    question: 'Which social media platforms are supported?',
    answer: 'We support Instagram, Facebook, Twitter, LinkedIn, Pinterest, and TikTok. More coming soon.',
  },
  {
    question: 'Is my data secure?',
    answer: 'We use industry-standard encryption and never store your social media passwords. All connections are OAuth-based.',
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-white py-20 dark:bg-slate-950">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium text-slate-800 dark:text-slate-100">
                {faq.question}
                <ChevronDown size={18} className="text-slate-500 dark:text-slate-400" />
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;