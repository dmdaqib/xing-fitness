import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Target,
  Gift,
  CalendarCheck,
  CreditCard,
  UserCheck,
  CalendarDays,
  Tag,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Dumbbell,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Leads & Enquiries', path: '/admin/leads', icon: Target },
    { label: 'Free Trials', path: '/admin/trials', icon: Gift },
    { label: 'Bookings & PT', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Membership Plans', path: '/admin/plans', icon: CreditCard },
    { label: 'Trainer Roster', path: '/admin/trainers', icon: UserCheck },
    { label: 'Studio Classes', path: '/admin/classes', icon: CalendarDays },
    { label: 'Offers & Promos', path: '/admin/offers', icon: Tag }
  ];

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#12141A] border-b border-white/10 sticky top-0 z-40">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-[#D4AF37] flex items-center justify-center">
            <Shield className="w-4 h-4 text-black font-bold" />
          </div>
          <span className="font-black text-sm uppercase tracking-wider text-white">
            Xing <span className="text-red-400">Admin</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 text-white/80"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#12141A] border-r border-white/10 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-[#D4AF37] flex items-center justify-center shadow-lg shadow-red-500/20">
                <Shield className="w-5 h-5 text-black font-bold" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase font-display block leading-none">
                  Xing <span className="text-red-400">Control</span>
                </span>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-semibold">
                  Management Console
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

          {/* Role Pill */}
          <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-[#D4AF37] flex items-center justify-center text-black font-black text-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                System Role: {role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-red-500/20 border border-red-500/40 text-red-300 font-bold shadow-md shadow-red-500/5'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-white/50'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="px-3 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
              Member View
            </p>
            <Link
              to="/member/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Member Dashboard</span>
            </Link>
          </div>
        </nav>

        {/* Footer Actions */}
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

      {/* Main Content View */}
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
