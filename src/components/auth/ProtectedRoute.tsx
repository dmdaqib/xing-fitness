import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090A0D] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#D4AF37] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-white/5 border-b-[#D4AF37] animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">Verifying Xing Fitness Security Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-[#090A0D] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white mb-2">Restricted Access Portal</h1>
        <p className="text-sm text-[#A1A1AA] max-w-md mb-8">
          Your account role (<span className="text-[#D4AF37] font-semibold">{role}</span>) does not have authorization to view this area.
        </p>
        <div className="flex gap-4">
          {role === 'MEMBER' && (
            <a
              href="/member/dashboard"
              className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-bold text-sm tracking-wide hover:bg-[#C5A028] transition-all"
            >
              Return to Member Dashboard
            </a>
          )}
          <a
            href="/"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
