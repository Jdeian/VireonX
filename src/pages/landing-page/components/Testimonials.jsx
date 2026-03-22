import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Social Media Manager',
    content:
      'VireonX cut our scheduling time by 70%. The AI captions are surprisingly good – saves us hours every week.',
    avatar: 'SJ',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    content:
      'The analytics alone are worth the price. We increased engagement by 45% in the first month.',
    avatar: 'MC',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Content Creator',
    content:
      'Finally a tool that understands influencers. The bulk scheduler is a lifesaver for campaigns.',
    avatar: 'ER',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
            Loved by social media pros
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join thousands of marketers who trust VireonX.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="mb-4 text-slate-700 dark:text-slate-300">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {t.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;