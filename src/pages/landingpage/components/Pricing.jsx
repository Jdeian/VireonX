import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    description: 'Perfect for individuals and small businesses.',
    features: [
      '5 social accounts',
      '50 scheduled posts/month',
      'Basic analytics',
      'AI caption generator (100/month)',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For growing teams and agencies.',
    features: [
      '15 social accounts',
      'Unlimited scheduling',
      'Advanced analytics & reports',
      'AI caption generator (unlimited)',
      'Bulk scheduling',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations.',
    features: [
      'Unlimited accounts',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'On‑premise options',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-slate-600">
            No hidden fees. Cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-200'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-medium bg-indigo-600 text-white px-2 py-1 rounded-full inline-block mb-3">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">{plan.description}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.cta === 'Contact Sales' ? '/contact' : '/signup'}
                className={`block text-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;