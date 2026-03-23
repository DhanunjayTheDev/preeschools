import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import NotificationBell from '../NotificationBell';

const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/enquiries', label: 'Enquiries', icon: '📋' },
  { path: '/admin/students', label: 'Students', icon: '🎓' },
  { path: '/admin/fees', label: 'Fees', icon: '💰' },
  { path: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { path: '/admin/activities', label: 'Activities', icon: '📚' },
  { path: '/admin/calendar', label: 'Calendar', icon: '📅' },
  { path: '/admin/teachers', label: 'Teachers', icon: '👩‍🏫' },
  { path: '/admin/teacher-applications', label: 'Teacher Applications', icon: '📝' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
];

const teacherLinks = [
  { path: '/teacher', label: 'Dashboard', icon: '📊' },
  { path: '/teacher/activities', label: 'Activities', icon: '📚' },
  { path: '/teacher/students', label: 'Students', icon: '🎓' },
  { path: '/teacher/attendance', label: 'Attendance', icon: '✅' },
  { path: '/teacher/notifications', label: 'Notifications', icon: '🔔' },
];

const parentLinks = [
  { path: '/parent', label: 'Dashboard', icon: '🏠' },
  { path: '/parent/activities', label: 'Activities', icon: '📚' },
  { path: '/parent/announcements', label: 'Announcements', icon: '📢' },
  { path: '/parent/fees', label: 'Fees', icon: '💰' },
  { path: '/parent/calendar', label: 'Calendar', icon: '📅' },
  { path: '/parent/notifications', label: 'Notifications', icon: '🔔' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // On small screens default sidebar closed
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    fetchNotifications({ limit: 5 });
    const interval = setInterval(() => fetchNotifications({ limit: 5 }), 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const getLinks = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return adminLinks;
      case 'TEACHER':
        return teacherLinks;
      case 'PARENT':
        return parentLinks;
      default:
        return [];
    }
  };

  const links = getLinks();
  
  // Filter links based on search
  const filteredLinks = links.filter(link => 
    link.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: in-flow | mobile: fixed overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300
        lg:static lg:z-auto
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {(sidebarOpen || mobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">K</div>
              <span className="font-bold text-gray-900">Kohsha</span>
            </div>
          )}
          {/* Desktop toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hidden lg:block ml-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
          {/* Mobile close */}
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden ml-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search input */}
        {(sidebarOpen || mobileOpen) && (
          <div className="px-3 py-2 mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [scrollbar-width:thin] [scrollbar-color:rgb(209_213_219)_transparent]">
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg flex-shrink-0">{link.icon}</span>
                {(sidebarOpen || mobileOpen) && <span className="text-sm">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-gray-200 px-2 py-3">
          {(sidebarOpen || mobileOpen) ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-700 font-medium text-sm">{user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role?.replace('_', ' ')}</p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" title="Logout">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-gray-400 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base lg:text-lg font-semibold text-gray-900">
              {links.find((l) => l.path === location.pathname)?.label || 'Kohsha Academy'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/profile' : user?.role === 'TEACHER' ? '/teacher/profile' : '/parent/profile'}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center justify-center w-10 h-10"
              title="Profile"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
