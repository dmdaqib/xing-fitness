import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  CalendarDays,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const MemberClassBookingPage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    loadClassData();
  }, []);

  const loadClassData = async () => {
    try {
      setIsLoading(true);
      const [classList, bookingsData] = await Promise.all([
        api.getAvailableClasses(),
        api.getBookings()
      ]);
      setClasses(classList);
      setMyBookings(bookingsData?.classBookings || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (classItem: any) => {
    setBookingInProgress(classItem.id);
    setFeedback(null);
    try {
      await api.bookClass({
        classId: classItem.id,
        classDate: selectedDate
      });
      setFeedback({
        type: 'success',
        message: `Spot reserved successfully for ${classItem.title} on ${selectedDate}!`
      });
      // Refresh
      const [classList, bookingsData] = await Promise.all([
        api.getAvailableClasses(),
        api.getBookings()
      ]);
      setClasses(classList);
      setMyBookings(bookingsData?.classBookings || []);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Could not complete booking reservation.'
      });
    } finally {
      setBookingInProgress(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this class reservation?')) return;
    try {
      await api.cancelClassBooking(bookingId);
      setFeedback({
        type: 'success',
        message: 'Your class reservation has been cancelled.'
      });
      const bookingsData = await api.getBookings();
      setMyBookings(bookingsData?.classBookings || []);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to cancel reservation.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">Loading Studio Classes...</p>
      </div>
    );
  }

  // Active future bookings
  const upcomingBookings = myBookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'REQUESTED'
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          Group Fitness & Studio Schedule
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Reserve your spot in high-energy Zumba, Yoga, and functional conditioning classes inside our mirrored studio.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Date Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#12141A] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Select Class Date:
          </span>
        </div>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Classes Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
          Available Studio Classes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => {
            const isBookedForDate = myBookings.some(
              (b) => b.classId === cls.id && b.classDate === selectedDate && b.status !== 'CANCELLED'
            );
            const spotsRemaining = Math.max(0, cls.capacity - (cls.bookedCountToday || 0));
            const isFull = spotsRemaining <= 0;
            const isCancelled = cls.status === 'CANCELLED';

            return (
              <div
                key={cls.id}
                className="bg-[#12141A] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-[#D4AF37]">
                      {cls.category}
                    </span>
                    <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {cls.time} ({cls.duration})
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase text-white font-display">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-[#A1A1AA] mt-2 line-clamp-2">
                    {cls.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white/80">
                      <span className="flex items-center gap-2 text-[#A1A1AA]">
                        <User className="w-4 h-4 text-white/50" />
                        Instructor:
                      </span>
                      <span className="font-semibold text-white">{cls.trainerName}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/80">
                      <span className="flex items-center gap-2 text-[#A1A1AA]">
                        <Users className="w-4 h-4 text-white/50" />
                        Studio Capacity:
                      </span>
                      <span className="font-semibold text-white">
                        {spotsRemaining} / {cls.capacity} spots open
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  {isCancelled ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs uppercase"
                    >
                      Class Cancelled
                    </button>
                  ) : isBookedForDate ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Slot Reserved for {selectedDate}</span>
                    </div>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-white/5 text-white/40 font-bold text-xs uppercase cursor-not-allowed"
                    >
                      Class Full
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBook(cls)}
                      disabled={bookingInProgress === cls.id}
                      className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {bookingInProgress === cls.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>Book for {selectedDate}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member's Upcoming Bookings Table */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
          My Active Class Reservations ({upcomingBookings.length})
        </h3>

        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A1A1AA]">
            You have no upcoming class reservations. Select a date above to book your spot!
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white uppercase">{b.classTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    {b.classDate} at {b.classTime} • Instructor: {b.trainerName}
                  </p>
                </div>

                <button
                  onClick={() => handleCancel(b.id)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold text-xs uppercase transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
