import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Award,
  Send
} from 'lucide-react';


export const MemberTrainerBookingPage: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [myTrainerBookings, setMyTrainerBookings] = useState<any[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    loadTrainerData();
  }, []);

  const loadTrainerData = async () => {
    try {
      setIsLoading(true);
      const [trainerList, bookingsData] = await Promise.all([
        api.getAvailableTrainers(),
        api.getBookings()
      ]);
      setTrainers(trainerList);
      if (trainerList.length > 0) {
        setSelectedTrainerId(trainerList[0].id);
      }
      setMyTrainerBookings(bookingsData?.trainerBookings || []);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTrainer = trainers.find((t) => t.id === selectedTrainerId);

  // Compute available time slots for the chosen date based on trainer's configured schedule
  const getAvailableSlotsForDate = () => {
    if (!selectedTrainer || !bookingDate) return [];
    const dateObj = new Date(bookingDate + 'T00:00:00');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = dayNames[dateObj.getDay()];

    const daySchedule = selectedTrainer.availability?.find(
      (a: any) => a.dayOfWeek === dayOfWeek
    );
    return daySchedule?.timeSlots || [];
  };

  const availableSlots = getAvailableSlotsForDate();

  const handleBookTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setFeedback({ type: 'error', message: 'Please select an available time slot.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await api.bookTrainer({
        trainerId: selectedTrainerId,
        bookingDate,
        timeSlot: selectedSlot,
        notes
      });

      setFeedback({
        type: 'success',
        message: `Personal training session request submitted for ${selectedTrainer.name} on ${bookingDate} at ${selectedSlot}.`
      });

      // Clear slot & notes
      setSelectedSlot('');
      setNotes('');

      // Reload bookings
      const bookingsData = await api.getBookings();
      setMyTrainerBookings(bookingsData?.trainerBookings || []);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to submit trainer session request.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Cancel this personal training session request?')) return;
    try {
      await api.cancelTrainerBooking(bookingId);
      setFeedback({
        type: 'success',
        message: 'Personal training booking request has been cancelled.'
      });
      const bookingsData = await api.getBookings();
      setMyTrainerBookings(bookingsData?.trainerBookings || []);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Could not cancel booking.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Trainer Availability...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          Personal Coaching & Trainer Sessions
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Schedule 1-on-1 coaching sessions with certified coaches for form refinement, biomechanics analysis, and tailored program guidance.
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

      {/* Trainer Roster Selection */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
          1. Choose Your Coach
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((t) => {
            const isSelected = selectedTrainerId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTrainerId(t.id);
                  setSelectedSlot('');
                }}
                className={`rounded-3xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 ring-1 ring-[#D4AF37]'
                    : 'bg-[#12141A] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-white/5 relative">
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase">
                        Selected
                      </div>
                    )}
                  </div>

                  <h4 className="text-base font-black uppercase text-white font-display">
                    {t.name}
                  </h4>
                  <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">{t.role}</p>
                  <p className="text-xs text-[#A1A1AA] mt-2 line-clamp-2">{t.bio}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.specialization?.slice(0, 2).map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.certifications?.[0] || 'Certified'}
                  </span>
                  <span>{t.availability?.length || 3} Days Scheduled</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form */}
      {selectedTrainer && (
        <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-6">
            2. Schedule Session with {selectedTrainer.name}
          </h3>

          <form onSubmit={handleBookTrainer} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Select Target Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      setSelectedSlot('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Select Time Slot ({availableSlots.length} Available)
                </label>
                {availableSlots.length === 0 ? (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#A1A1AA]">
                    {selectedTrainer.name} has no scheduled coaching blocks on this day of the week.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot: string) => {
                      const isSlotSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSlotSelected
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                              : 'bg-white/5 text-white/90 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Session Focus / Coach Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need assistance dialing in barbell deadlift form or shoulder impingement check"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <p className="text-xs text-[#A1A1AA]">
                Trainer sessions are submitted in <span className="text-amber-400 font-semibold">REQUESTED</span> state and confirmed by the coach.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || !selectedSlot}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Submit Session Request</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member's Active Trainer Bookings */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
          My Scheduled Coaching Sessions ({myTrainerBookings.length})
        </h3>

        {myTrainerBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A1A1AA]">
            You have no upcoming or past trainer requests on file.
          </div>
        ) : (
          <div className="space-y-3">
            {myTrainerBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white uppercase">
                      1-on-1 with {b.trainerName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : b.status === 'REQUESTED'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    {b.bookingDate} at {b.timeSlot} {b.notes ? `• Notes: "${b.notes}"` : ''}
                  </p>
                </div>

                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold text-xs uppercase transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
