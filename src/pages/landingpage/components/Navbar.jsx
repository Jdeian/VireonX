import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@common/components/shadcn/button';
import logo from '@assets/images/vireonx-logo.png';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [activeSection, setActiveSection] = useState('');

  const sections = ['features', 'how-it-works', 'pricing', 'faq'];
  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' }
  ];

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Handle anchor click
  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is near the top (within 200px of the top)
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // call once to set initial active

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - scrolls to top when clicked */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-indigo-600 cursor-pointer"
          >
            <img src={logo} alt="VireonX" className="h-8 w-auto" />
            VireonX
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleLinkClick(e, id)}
                className={`text-sm transition-colors ${
                  activeSection === id
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-2">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleLinkClick(e, id)}
                className={`block px-2 py-2 transition-colors ${
                  activeSection === id
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="px-2 py-2 text-slate-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
              <Link to="/signup" className="px-2 py-2 bg-indigo-600 text-white rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                Start free trial
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;