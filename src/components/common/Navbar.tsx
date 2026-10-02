import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { BRAND } from '../../data/brand';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenTrialModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrialModal }) => {
  const { isAuthenticated, role, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Why Xing', path: '/why-xing' },
    { label: 'Programs', path: '/programs' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Offers', path: '/offers' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090A0D]/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-white/10 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg p-1"
              aria-label="Xing Fitness Home"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1C212D] to-[#12151B] border border-white/15 rounded-xl flex items-center justify-center overflow-hidden shadow-lg group-hover:border-[#D4AF37]/50 transition-colors">
                <span className="font-extrabold text-lg sm:text-xl text-[#D4AF37] tracking-tighter">X</span>
                <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1 sm:gap-1.5">
                  <span className="font-display font-black text-lg sm:text-2xl text-white tracking-wider">
                    XING
                  </span>
                  <span className="font-display font-semibold text-base sm:text-xl text-[#D4AF37] tracking-widest">
                    FITNESS
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#8F9CAE] font-medium hidden sm:block">
                  Brookefield • Whitefield
                </span>
              </div>
            </Link>

            {/* Desktop Primary Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg relative ${
                    isActive(link.path)
                      ? 'text-[#D4AF37] bg-white/5 font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Actions: Auth + Book Free Trial CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link
                    to={role === 'ADMIN' ? '/admin/dashboard' : '/member/dashboard'}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-medium flex items-center gap-1.5 transition-all"
                  >
                    {role === 'ADMIN' ? (
                      <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                    <span>{role === 'ADMIN' ? 'Admin Portal' : 'Member Portal'}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Primary CTA */}
              <button
                type="button"
                id="nav-book-trial-btn"
                onClick={onOpenTrialModal}
                className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5"
              >
                <span>Book A Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={onOpenTrialModal}
                className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-[10px] uppercase tracking-wider hover:bg-[#C5A028]"
              >
                Free Trial
              </button>

              <button
                type="button"
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden pt-24 px-6 pb-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] px-3 pb-2 border-b border-white/10">
              Menu Navigation
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-all ${
                  isActive(link.path)
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex flex-col gap-2">
                  <Link
                    to={role === 'ADMIN' ? '/admin/dashboard' : '/member/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-2xl bg-white/5 text-sm font-semibold uppercase tracking-wider text-white flex items-center justify-between"
                  >
                    <span>{role === 'ADMIN' ? 'Admin Portal' : 'Member Portal'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrialModal();
              }}
              className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <span>Book A Free Trial Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-white/5 border border-white/15 text-white text-center text-xs font-bold uppercase tracking-wider block"
            >
              Chat on WhatsApp Concierge
            </a>
          </div>
        </div>
      )}
    </>
  );
};
