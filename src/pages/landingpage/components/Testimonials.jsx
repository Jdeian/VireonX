import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Social Media Manager',
    content: 'VireonX cut our scheduling time by 70%. The AI captions are surprisingly good – saves us hours every week.',
    avatar: 'SJ',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    content: 'The analytics alone are worth the price. We increased engagement by 45% in the first month.',
    avatar: 'MC',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Content Creator',
    content: 'Finally a tool that understands influencers. The bulk scheduler is a lifesaver for campaigns.',
    avatar: 'ER',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Loved by social media pros</h2>
          <p className="text-lg text-slate-600">
            Join thousands of marketers who trust VireonX.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
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