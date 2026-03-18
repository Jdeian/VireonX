import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative bg-linear-to-br from-indigo-800 to-purple-800 py-16 overflow-hidden">
      {/* Subtle overlay texture to soften the gradient */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="container mx-auto px-4 text-center lg:px-8 relative z-10">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Ready to simplify your social media?
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-indigo-100">
          Join thousands of creators and businesses who trust VireonX.
        </p>

        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm px-6 py-3 text-lg text-indigo-800 shadow-md transition-all hover:bg-white hover:shadow-lg hover:scale-105 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Start your free trial
          <ChevronRight size={20} />
        </Link>

        <p className="mt-4 text-sm text-indigo-200">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </section>
  );
};

export default CTA;