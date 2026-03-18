import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import logo from '@assets/images/vireonx-logo.png';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-12 text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 font-semibold text-white dark:text-slate-100">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white dark:text-slate-100">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white dark:text-slate-100">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white dark:text-slate-100">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img src={logo} alt="VireonX" className="h-6 w-auto" />
            <span className="font-bold text-white dark:text-slate-100">
              VireonX
            </span>
          </div>

          <p className="text-sm">
            &copy; {new Date().getFullYear()} VireonX. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
              <Instagram size={18} />
            </a>
            <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
              <Facebook size={18} />
            </a>
            <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
              <Twitter size={18} />
            </a>
            <a href="#" className="transition-colors hover:text-white dark:hover:text-slate-100">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;