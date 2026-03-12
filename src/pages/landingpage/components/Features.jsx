import React from 'react';
import { Calendar, Sparkles, BarChart3, Globe, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI recommends optimal posting times based on your audience activity.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Sparkles,
    title: 'AI Caption Generator',
    description: 'Generate engaging captions in seconds – choose tone, length, and hashtags.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track engagement, reach, and growth across all your platforms.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Globe,
    title: 'Multi‑Platform',
    description: 'Connect Instagram, Facebook, Twitter, LinkedIn and more – all in one place.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Zap,
    title: 'Bulk Scheduling',
    description: 'Upload and schedule hundreds of posts at once with our CSV importer.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise‑grade security with 99.9% uptime SLA.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Everything you need to manage social media</h2>
          <p className="text-lg text-slate-600">
            Powerful features that save you time and boost engagement – all powered by AI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg ${feature.bg} w-fit mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;