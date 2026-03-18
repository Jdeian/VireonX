import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LoginModal from './components/login/LoginModal';
import SignupModal from './components/signup/SignupModal';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      const isDark = parsed.darkMode ?? false;
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', JSON.stringify({ darkMode: newDarkMode }));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openSignupModal = () => setSignupModalOpen(true);
  const closeSignupModal = () => setSignupModalOpen(false);

  const switchToSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  const switchToLogin = () => {
    closeSignupModal();
    openLoginModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans antialiased transition-colors">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onSignInClick={openLoginModal}
        onSignUpClick={openSignupModal}
      />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />

      {/* Floating theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed right-5 cursor-pointer top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={switchToSignup}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={closeSignupModal}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default LandingPage;