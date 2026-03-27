import { useState, useEffect, useRef, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  CalendarRange,
  CalendarDays,
  PanelsTopLeft,
  BarChart3,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  AlertTriangle,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@common/components/shadcn/breadcrumb";
import { Button } from "@common/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@common/components/shadcn/dropdown-menu";

import logo from "@assets/images/logo.png";
import { auth } from "@common/services/config";

import { getProfile } from '@common/services/profileService';
import { fetchPosts } from '@common/services/postService';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Content Planner", path: "/content-planner", icon: CalendarRange },
    { name: "Content Center", path: "/content-center", icon: PanelsTopLeft },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  const getBreadcrumbItems = () => {
    const pathname = location.pathname;
    const items = [{ label: "Dashboard", href: "/" }];

    if (pathname === "/") {
      return items;
    }

    if (pathname.includes("/settings")) {
      items.push({ label: "Settings", href: "/settings" });
    } else if (pathname.includes("/profile")) {
      items.push({ label: "Profile", href: "/profile" });
    } else if (pathname.includes("/notifications")) {
      items.push({ label: "Notifications", href: "/notifications" });
    } else {
      const matchingItem = navItems.find((item) => item.path === pathname);
      if (matchingItem) {
        items.push({ label: matchingItem.name, href: matchingItem.path });
      }
    }

    return items;
  };

  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  

  const buildNotificationsFromPosts = (posts) => {
  return [...posts]
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
    .slice(0, 4)
    .map((p) => {
      const date = new Date(p.scheduledAt);
      const platform = p.platform?.charAt(0).toUpperCase() + p.platform?.slice(1);
      const preview = p.message?.slice(0, 40) + (p.message?.length > 40 ? '...' : '');

      if (p.status === 'published') return `${platform} post published successfully — "${preview}"`;
      if (p.status === 'failed')    return `${platform} post failed to publish — "${preview}"`;
      if (p.status === 'processing') return `${platform} post is being processed — "${preview}"`;
      return `${platform} post scheduled for ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} — "${preview}"`;
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setProfileLoading(false);
        return;
      }
      try {
        const [profile, posts] = await Promise.all([
          getProfile(user.uid),
          fetchPosts(),
        ]);
        setUserName(profile?.fullName || user.displayName || user.email?.split('@')[0] || 'User');
        setAvatarUrl(profile?.avatarUrl || null);
        setNotifications(buildNotificationsFromPosts(posts));
      } catch (err) {
        console.error('Failed to load layout data:', err);
      } finally {
        setProfileLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const notificationRef = useRef(null);

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/landing-page");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsVisible(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationsVisible(false);
      }
    };

    if (notificationsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsVisible]);

  const getNotificationIcon = (notification) => {
    if (notification.includes("scheduled")) {
      return <CalendarDays size={16} />;
    } else if (notification.includes("completed")) {
      return <CheckCircle size={16} />;
    } else if (notification.includes("published")) {
      return <FileText size={16} />;
    }
    return <AlertTriangle size={16} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and navigation */}
            <div className="flex items-center gap-10">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-2xl font-black tracking-tighter text-indigo-600"
              >
                <img src={logo} alt="VireonX" className="h-8 w-auto" />
                <span className="hidden sm:inline">VireonX</span>
              </Link>

              <nav className="hidden items-center gap-2 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                        : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
                  )}
                </Button>

                {notificationsVisible && (
                  <div
                    ref={notificationRef}
                    className="absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-colors dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {notifications.length} new
                        </span>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                          {notifications.map((notification, index) => (
                            <li
                              key={index}
                              className="flex cursor-pointer items-start gap-3 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                            >
                              <span className="mt-0.5 shrink-0">
                                {getNotificationIcon(notification)}
                              </span>
                              <span className="flex-1">{notification}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                          No notifications
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 px-4 py-2 text-center dark:border-slate-800">
                      <Link
                        to="/notifications"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        onClick={() => setNotificationsVisible(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

              {/* Avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-sm overflow-hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-sm overflow-hidden">
                        {profileLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : avatarUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${avatarUrl}`}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={16} />
                        )}
                    </div>
                    </div>
                    {profileLoading ? (
                      <span className="hidden h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700 sm:block" />
                    ) : (
                      <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                        {userName}
                      </span>
                    )}
                    <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <DropdownMenuLabel className="px-2 py-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Account
                  </DropdownMenuLabel>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400 dark:focus:bg-slate-800 dark:focus:text-indigo-400"
                    >
                      <User size={16} />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400 dark:focus:bg-slate-800 dark:focus:text-indigo-400"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-slate-200 dark:bg-slate-800" />

                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-slate-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-400"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-10 pt-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbItems().map((item, index) => (
                <Fragment key={item.label + index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to={item.href}
                        className="text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {index < getBreadcrumbItems().length - 1 && (
                    <BreadcrumbSeparator className="text-slate-400 dark:text-slate-600" />
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="min-h-screen">{children}</div>
      </main>

      <footer className="w-full py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              VireonX
            </span>{" "}
            All systems operational.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;