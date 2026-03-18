import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import dashboardPreviewLight from '@assets/images/dashboardpreview-light.png';
import dashboardPreviewDark from '@assets/images/dashboardpreview-dark.png';

const Hero = () => {
  return (
    <section className="relative bg-linear-to-br from-indigo-50 via-white to-purple-50 pb-[30%] pt-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
            Schedule Smarter with{' '}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Precision
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-600 dark:text-slate-300">
            VireonX automates your social media scheduling, generates engaging captions, and provides deep analytics! All in one beautiful dashboard.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-lg text-white shadow-md transition-colors hover:bg-indigo-700"
            >
              Start free trial
              <ChevronRight size={20} />
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-lg text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Watch demo
            </a>
          </div>

          <div className="absolute left-1/2 mt-12 -translate-x-1/2 transform">
            <div className="max-w-3xl rounded-4xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <img
                src={dashboardPreviewLight}
                alt="Dashboard preview light"
                className="block w-full rounded-2xl dark:hidden"
              />
              <img
                src={dashboardPreviewDark}
                alt="Dashboard preview dark"
                className="hidden w-full rounded-2xl dark:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;