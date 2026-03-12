import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-16 bg-linear-to-r from-indigo-600 to-purple-600">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to simplify your social media?</h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of creators and businesses who trust VireonX.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 text-lg rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
        >
          Start your free trial
          <ChevronRight size={20} />
        </Link>
        <p className="text-sm text-indigo-200 mt-4">No credit card required. 14‑day free trial.</p>
      </div>
    </section>
  );
};

export default CTA;