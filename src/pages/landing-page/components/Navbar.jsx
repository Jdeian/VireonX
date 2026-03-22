import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@common/components/shadcn/button';
import logo from '@assets/images/logo.png';

const sections = ['features', 'how-it-works', 'pricing', 'faq'];

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen, onSignInClick, onSignUpClick }) => {
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2 text-2xl font-black tracking-tighter text-indigo-600"
          >
            <img src={logo} alt="VireonX" className="h-8 w-auto" />
            <span className="hidden sm:inline">VireonX</span>
          </button>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-10 md:flex">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleLinkClick(e, id)}
                className={`text-sm transition-colors ${
                  activeSection === id
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignInClick}
              className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Sign in
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onSignUpClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Start free trial
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-slate-200 py-4 dark:border-slate-800 md:hidden">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleLinkClick(e, id)}
                className={`block px-2 py-2 transition-colors ${
                  activeSection === id
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
                }`}
              >
                {label}
              </a>
            ))}

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSignInClick();
                  setMobileMenuOpen(false);
                }}
                className="justify-start px-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                Sign in
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onSignUpClick();
                  setMobileMenuOpen(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Start free trial
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;