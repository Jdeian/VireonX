import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Connect your accounts',
    description: 'Link your social media profiles in one click – we support all major platforms.',
  },
  {
    number: '02',
    title: 'Create or import content',
    description: 'Write posts manually, generate AI captions, or bulk upload from a spreadsheet.',
  },
  {
    number: '03',
    title: 'Schedule with AI',
    description: 'Our engine picks the best times for each post, or you can set custom schedules.',
  },
  {
    number: '04',
    title: 'Analyze & optimize',
    description: 'Get detailed insights and let AI suggest improvements for future content.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">How VireonX works</h2>
          <p className="text-lg text-slate-600">
            Get started in minutes – no technical skills required.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="text-5xl font-black text-indigo-100 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;