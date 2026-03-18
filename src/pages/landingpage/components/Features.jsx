import React from 'react';
import {
  Calendar,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI recommends optimal posting times based on your audience activity.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    icon: Sparkles,
    title: 'AI Caption Generator',
    description: 'Generate engaging captions in seconds – choose tone, length, and hashtags.',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track engagement, reach, and growth across all your platforms.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Connect Instagram, Facebook, Twitter, LinkedIn and more – all in one place.',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Bulk Scheduling',
    description: 'Upload and schedule hundreds of posts at once with our CSV importer.',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime SLA.',
    color: 'text-sky-600',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="border-t border-slate-200 bg-white pb-20 pt-44 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
            Everything you need to manage social media
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Powerful features that save you time and boost engagement – all powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`mb-4 w-fit rounded-lg p-3 ${feature.bg}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;