import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  MessageSquare,
  UserCheck,
  AlertTriangle,
  FileText,
  CheckCircle,
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
import logo from "@assets/images/vireonx-logo.png";

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Schedule", path: "/schedule", icon: CalendarDays },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const items = [{ label: "Home", href: "/" }];

    // Check if we're on a dynamic route like /settings or /profile
    const pathname = location.pathname;

    if (pathname.includes("/settings")) {
      items.push({ label: "Settings", href: "/settings" });
    } else if (pathname.includes("/profile")) {
      items.push({ label: "Profile", href: "/profile" });
    } else {
      // Find matching main nav item
      const matchingItem = navItems.find((item) => item.path === pathname);
      if (matchingItem) {
        items.push({ label: matchingItem.name, href: matchingItem.path });
      }
    }

    return items;
  };

  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [notifications] = React.useState([
    "Your post 'Summer Sale' is scheduled for tomorrow at 10 AM",
    "AI caption generation completed for Instagram post",
    "Analytics report for last week is ready",
    "Facebook post published successfully",
  ]);
  const notificationRef = React.useRef(null);

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sticky glassmorphic header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and navigation */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-indigo-600">
                <img src={logo} alt="VireonX" className="h-8 w-auto" />
                <span className="hidden sm:inline">VireonX</span>
              </Link>

              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${isActive(item.path)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notification dropdown with AI scheduler context */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="relative p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-colors"
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </Button>

                {notificationsVisible && (
                  <div
                    ref={notificationRef}
                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg border border-slate-200 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700">Notifications</h3>
                      {notifications.length > 0 && (
                        <span className="text-xs text-slate-400">{notifications.length} new</span>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                          {notifications.map((notification, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
                            >
                              <span className="shrink-0 mt-0.5">
                                {getNotificationIcon(notification)}
                              </span>
                              <span className="flex-1">{notification}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-slate-400">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="border-t border-slate-100 px-4 py-2 text-center">
                      <Link
                        to="/notifications"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        onClick={() => setNotificationsVisible(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* Avatar dropdown with chevron */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                      <User size={16} />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700">John Jedric Belita</span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2 p-1 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <DropdownMenuLabel className="text-xs font-medium text-slate-500 px-2 py-2">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600">
                      <User size={16} />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-slate-200" />
                  <DropdownMenuItem asChild>
                    <button className="flex items-center gap-2 px-2 py-2 text-sm rounded-md w-full text-left cursor-pointer hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
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

      {/* Main content */}
      <main className="container mx-auto pt-6 pb-10 px-4 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbItems().map((item, index) => (
                <React.Fragment key={item.href}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={item.href} className="text-sm text-slate-600 hover:text-indigo-600">
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < getBreadcrumbItems().length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page content */}
        <div className="min-h-screen">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-600">VireonX </span>
            All systems operational.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;