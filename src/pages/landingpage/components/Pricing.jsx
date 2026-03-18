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
      'On-premise options',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-indigo-600 bg-white shadow-lg ring-2 ring-indigo-200 dark:bg-slate-950 dark:ring-indigo-500/20'
                  : 'border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'
              }`}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block rounded-full bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {plan.name}
              </h3>

              <div className="mb-4 mt-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {plan.price}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {plan.period}
                </span>
              </div>

              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                {plan.description}
              </p>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-indigo-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta === 'Contact Sales' ? '/contact' : '/signup'}
                className={`block rounded-lg px-4 py-2 text-center font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20'
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