import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel or change your plan at any time. No long‑term contracts.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Absolutely! All plans come with a 14‑day free trial – no credit card required.',
  },
  {
    question: 'Which social media platforms are supported?',
    answer: 'We support Instagram, Facebook, Twitter, LinkedIn, Pinterest, and TikTok. More coming soon.',
  },
  {
    question: 'Is my data secure?',
    answer: 'We use industry‑standard encryption and never store your social media passwords. All connections are OAuth‑based.',
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Frequently asked questions</h2>
          <p className="text-lg text-slate-600">Got questions? We've got answers.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <summary className="font-medium text-slate-800 cursor-pointer flex items-center justify-between">
                {faq.question}
                <ChevronDown size={18} className="text-slate-500" />
              </summary>
              <p className="mt-2 text-slate-600 text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;