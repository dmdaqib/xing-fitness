import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  CreditCard,
  UserCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemberNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.getNotifications();
      setNotifications(res?.notifications || []);
      setUnreadCount(res?.unreadCount || 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Ignored
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Ignored
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Notifications...
        </p>
      </div>
    );
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'membership':
        return <CreditCard className="w-4 h-4 text-[#D4AF37]" />;
      case 'class':
      case 'booking':
        return <Calendar className="w-4 h-4 text-[#D4AF37]" />;
      case 'trainer':
        return <UserCheck className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Real system communications regarding your memberships, class bookings, and facility notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-[#D4AF37] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl bg-[#12141A] border border-white/10 p-12 text-center">
          <Bell className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-black uppercase text-white">No Notifications</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">
            You're completely up to date. You will receive alerts when bookings or renewals change.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                n.read
                  ? 'bg-[#12141A]/60 border-white/5 opacity-80'
                  : 'bg-[#12141A] border-white/10 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.read ? 'bg-white/5' : 'bg-white/10 ring-1 ring-[#D4AF37]/50'
                  }`}
                >
                  {getIconForType(n.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    )}
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xl">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-white/40 block mt-2">
                    {new Date(n.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {n.link && (
                  <Link
                    to={n.link}
                    className="p-2 rounded-xl bg-white/5 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}

                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
