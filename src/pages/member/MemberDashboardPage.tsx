import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  CreditCard,
  CalendarDays,
  UserCheck,
  Dumbbell,
  TrendingUp,
  Clock,
  Bell,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';

export const MemberDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [profData, memData, attData, progData, bkgData, notifData] = await Promise.all([
        api.getMemberProfile().catch(() => null),
        api.getMembership().catch(() => null),
        api.getAttendance().catch(() => null),
        api.getProgress().catch(() => []),
        api.getBookings().catch(() => null),
        api.getNotifications().catch(() => ({ notifications: [] }))
      ]);

      setProfile(profData);
      setMembership(memData);
      setAttendance(attData);
      setProgress(progData || []);
      setBookings(bkgData);
      setNotifications(notifData?.notifications?.slice(0, 3) || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCheckIn = async () => {
    setCheckInLoading(true);
    setCheckInMessage(null);
    try {
      await api.checkIn();
      setCheckInMessage('Workout session checked in successfully!');
      // Refresh attendance
      const freshAtt = await api.getAttendance();
      setAttendance(freshAtt);
    } catch (err: any) {
      setCheckInMessage(err?.message || 'Check-in failed.');
    } finally {
      setCheckInLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#D4AF37] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Member Experience...
        </p>
      </div>
    );
  }

  const memberName = profile?.name || user?.name || 'MEMBER';
  const status = membership?.status || 'PENDING';

  // Find next upcoming booking (class or trainer)
  const upcomingClass = bookings?.classBookings?.find(
    (c: any) => c.status === 'CONFIRMED' || c.status === 'REQUESTED'
  );
  const upcomingTrainer = bookings?.trainerBookings?.find(
    (t: any) => t.status === 'CONFIRMED' || t.status === 'REQUESTED'
  );

  const latestProgress = progress.length > 0 ? progress[progress.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#12141A] via-[#1A1D24] to-[#12141A] border border-white/10 p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-[#D4AF37]">
                <Sparkles className="w-3 h-3" />
                {profile?.membershipNumber || 'XING FITNESS'}
              </span>

              {status === 'ACTIVE' && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  ACTIVE
                </span>
              )}
              {status === 'EXPIRING_SOON' && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  EXPIRING SOON
                </span>
              )}
              {status === 'EXPIRED' && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
                  EXPIRED
                </span>
              )}
              {status === 'PENDING' && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                  PENDING ACTIVATION
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase font-display">
              WELCOME, {memberName}
            </h1>

            <p className="mt-2 text-sm text-[#A1A1AA] max-w-xl">
              {membership
                ? `${membership.planName} • Valid until ${new Date(membership.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })} (${membership.daysRemaining} days remaining)`
                : 'Your membership is being set up by the concierge desk.'}
            </p>
          </div>

          {/* Quick Check-in action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleQuickCheckIn}
              disabled={checkInLoading}
              className="px-5 py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50"
            >
              {checkInLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span>Quick Check-In Today</span>
            </button>
          </div>
        </div>

        {checkInMessage && (
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{checkInMessage}</span>
          </div>
        )}
      </div>

      {/* Expiry Warning Callout if Expiring or Expired */}
      {status === 'EXPIRING_SOON' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase text-amber-300">
                MEMBERSHIP EXPIRING SOON
              </h4>
              <p className="text-xs text-amber-200/80">
                Your current cycle ends in {membership.daysRemaining} days. Renew now to preserve grandfathered rates and locker continuity.
              </p>
            </div>
          </div>
          <Link
            to="/member/membership"
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex-shrink-0"
          >
            RENEW MEMBERSHIP
          </Link>
        </div>
      )}

      {status === 'EXPIRED' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase text-red-300">
                MEMBERSHIP EXPIRED
              </h4>
              <p className="text-xs text-red-200/80">
                Your membership access has lapsed. Reactivate today to continue workout logging and class reservations.
              </p>
            </div>
          </div>
          <Link
            to="/member/membership"
            className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-wider hover:bg-red-400 transition-all flex-shrink-0"
          >
            RENEW NOW
          </Link>
        </div>
      )}

      {/* QUICK ACTIONS BAR (Strictly required in Prompt 5) */}
      <div>
        <h3 className="text-xs uppercase font-bold text-[#A1A1AA] tracking-widest mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/member/classes"
            className="p-4 rounded-2xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform mb-2">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              BOOK CLASS
            </span>
          </Link>

          <Link
            to="/member/trainers"
            className="p-4 rounded-2xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform mb-2">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              BOOK TRAINER
            </span>
          </Link>

          <Link
            to="/member/workouts"
            className="p-4 rounded-2xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-2">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              VIEW WORKOUT
            </span>
          </Link>

          <Link
            to="/member/progress"
            className="p-4 rounded-2xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              VIEW PROGRESS
            </span>
          </Link>

          <Link
            to="/member/membership"
            className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              RENEW MEMBERSHIP
            </span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD CARDS (Strictly required in Prompt 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Membership */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Membership Card
              </span>
              <CreditCard className="w-5 h-5 text-white/40" />
            </div>

            <h3 className="text-xl font-black uppercase text-white font-display">
              {membership?.planName || 'General Membership'}
            </h3>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#A1A1AA]">Status:</span>
                <span className="font-bold text-white uppercase">{status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#A1A1AA]">Start Date:</span>
                <span className="text-white">{membership?.startDate || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#A1A1AA]">Expiry Date:</span>
                <span className="text-white">{membership?.endDate || '—'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A1A1AA]">Payment Status:</span>
                <span className="text-[#D4AF37] font-semibold">
                  {membership?.paymentStatus === 'PAID_OFFLINE_VERIFIED'
                    ? 'Verified at Desk'
                    : 'Pending Confirmation'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/member/membership"
              className="flex items-center justify-between text-xs font-bold text-[#D4AF37] hover:underline"
            >
              <span>Manage Plan & Benefits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Attendance Card
              </span>
              <Clock className="w-5 h-5 text-white/40" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center my-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-white">{attendance?.weeklyVisits || 0}</div>
                <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">This Week</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-[#D4AF37]">
                  {attendance?.monthlyVisits || 0}
                </div>
                <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">This Month</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-[#D4AF37]">
                  {attendance?.totalVisits || 0}
                </div>
                <div className="text-[10px] text-[#A1A1AA] uppercase mt-1">Total Visits</div>
              </div>
            </div>

            <p className="text-xs text-[#A1A1AA] mt-3">
              {attendance?.records?.[0]
                ? `Last visit logged: ${attendance.records[0].date} at ${attendance.records[0].checkInTime}`
                : 'No gym sessions logged yet this week.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/member/attendance"
              className="flex items-center justify-between text-xs font-bold text-[#D4AF37] hover:underline"
            >
              <span>View Visit History</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 3: Progress */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Progress Card
              </span>
              <TrendingUp className="w-5 h-5 text-white/40" />
            </div>

            {latestProgress ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <div>
                    <span className="text-3xl font-black text-white">{latestProgress.weightKg}</span>
                    <span className="text-xs text-[#A1A1AA] ml-1">kg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400">BMI {latestProgress.bmi}</span>
                    <p className="text-[10px] text-[#A1A1AA]">Recorded: {latestProgress.date}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 text-xs text-white/80">
                  <p className="font-semibold text-white/90">Target: {latestProgress.fitnessGoal}</p>
                  {latestProgress.notes && (
                    <p className="text-[11px] text-[#A1A1AA] mt-1 italic">
                      "{latestProgress.notes}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-[#A1A1AA] mb-3">No biometric progress logged yet.</p>
                <Link
                  to="/member/progress"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-[#D4AF37] hover:bg-white/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log First Weigh-In</span>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/member/progress"
              className="flex items-center justify-between text-xs font-bold text-[#D4AF37] hover:underline"
            >
              <span>Biometric History & Charts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 4: Upcoming Booking */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Upcoming Booking
              </span>
              <CalendarDays className="w-5 h-5 text-white/40" />
            </div>

            {upcomingClass || upcomingTrainer ? (
              <div className="space-y-3">
                {upcomingClass && (
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-[#D4AF37]">
                        Studio Class
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        {upcomingClass.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{upcomingClass.classTitle}</h4>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      {upcomingClass.classDate} at {upcomingClass.classTime}
                    </p>
                  </div>
                )}

                {upcomingTrainer && (
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-[#D4AF37]">
                        PT Session
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-bold">
                        {upcomingTrainer.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      1-on-1 with {upcomingTrainer.trainerName}
                    </h4>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      {upcomingTrainer.bookingDate} at {upcomingTrainer.timeSlot}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-[#A1A1AA] mb-3">No upcoming bookings.</p>
                <div className="flex justify-center gap-2">
                  <Link
                    to="/member/classes"
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-[#D4AF37] hover:bg-white/10 font-bold"
                  >
                    BOOK A CLASS
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/member/classes"
              className="flex items-center justify-between text-xs font-bold text-[#D4AF37] hover:underline"
            >
              <span>Explore Group Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 5: Notifications */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all md:col-span-2 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Notifications & Announcements
              </span>
              <Bell className="w-5 h-5 text-white/40" />
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border text-xs transition-colors flex items-start gap-3 ${
                      n.read
                        ? 'bg-white/[0.02] border-white/5 text-white/60'
                        : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.read ? 'bg-white/20' : 'bg-[#D4AF37]'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-xs">{n.title}</p>
                        <span className="text-[10px] text-[#A1A1AA]">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#A1A1AA] text-xs mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#A1A1AA]">
                You're all caught up! No unread notifications.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/member/notifications"
              className="flex items-center justify-between text-xs font-bold text-[#D4AF37] hover:underline"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
