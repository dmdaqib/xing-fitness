import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { api } from '../../services/api';
import {
  LayoutDashboard,
  CreditCard,
  CalendarDays,
  UserCheck,
  Dumbbell,
  TrendingUp,
  Clock,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
}

export const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    loadNotifications();
  }, [location.pathname]);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res && typeof res.unreadCount === 'number') {
        setUnreadCount(res.unreadCount);
      }
    } catch {
      // Ignored for layout
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
    { label: 'My Membership', path: '/member/membership', icon: CreditCard },
    { label: 'Class Schedule', path: '/member/classes', icon: CalendarDays },
    { label: 'Trainer Sessions', path: '/member/trainers', icon: UserCheck },
    { label: 'My Workouts', path: '/member/workouts', icon: Dumbbell },
    { label: 'Fitness Progress', path: '/member/progress', icon: TrendingUp },
    { label: 'Attendance', path: '/member/attendance', icon: Clock },
    {
      label: 'Notifications',
      path: '/member/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    }
  ];

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#12141A] border-b border-white/10 sticky top-0 z-40">
        <Link to="/member/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#D4AF37] flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-sm uppercase tracking-wider text-white">
            Xing <span className="text-[#D4AF37]">Member</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/member/notifications"
            className="p-2 rounded-lg bg-white/5 relative text-white/80 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-white/80"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#12141A] border-r border-white/10 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Dumbbell className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase font-display block leading-none">
                  Xing <span className="text-[#D4AF37]">Fitness</span>
                </span>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-semibold">
                  Member Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Profile Badge */}
          <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#D4AF37] flex items-center justify-center text-black font-black text-sm">
              {user?.name?.slice(0, 2).toUpperCase() || 'MB'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Member'}</p>
              <p className="text-[10px] text-[#D4AF37] font-semibold truncate">
                Role: {user?.role || 'MEMBER'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/10 font-bold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-black text-[#D4AF37]' : 'bg-[#D4AF37] text-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {(role === 'ADMIN' || role === 'STAFF') && (
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="px-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                Elevated Access
              </p>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
};
