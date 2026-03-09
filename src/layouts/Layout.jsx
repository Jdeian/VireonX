import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  Bell,
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Schedule', path: '/schedule', icon: CalendarDays },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sticky Glassmorphic Header 
          The 'backdrop-blur' effect adds a premium feel.
      */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-600">
                VireonX
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 bg-slate-200 mx-2 hidden sm:block"></div>
              
              <button className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="container mx-auto py-8 px-4 lg:px-8">
        {/* Breadcrumb or Page Title Placeholder */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {navItems.find(n => n.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <p className="text-slate-500 text-sm">Manage your social media presence with ease.</p>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[calc(100vh-250px)]">
          {children}
        </div>
      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2026 <span className="font-semibold text-slate-600">VireonX</span>. 
            All systems operational.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;