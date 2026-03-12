import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-16 pb-20 lg:pt-24 lg:pb-28 bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Schedule Smarter with{' '}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI‑Powered Precision
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            VireonX automates your social media scheduling, generates engaging captions, and provides deep analytics! All in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              Start free trial
              <ChevronRight size={20} />
            </Link>
            <a
              href="#features"
              className="px-6 py-3 bg-white text-slate-700 text-lg rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Watch demo
            </a>
          </div>
          <div className="mt-12 flex justify-center">
            {/* Placeholder for dashboard mockup – replace with actual image */}
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-2 max-w-3xl">
              <img
                src="https://www.larksuite.com/en_us/blog/ai-dashboard"
                alt="Dashboard preview"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;