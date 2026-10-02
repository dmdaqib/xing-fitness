import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
export const AdminBookingsPage: React.FC = () => {

  const [classBookings, setClassBookings] = useState<any[]>([]);
  const [trainerBookings, setTrainerBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'classes' | 'trainers'>('classes');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminBookings();
      setClassBookings(data?.classBookings || []);
      setTrainerBookings(data?.trainerBookings || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClassStatus = async (id: string, status: string) => {
    try {
      await api.updateClassBookingStatus(id, status);
      loadBookings();
    } catch (err: any) {
      alert(err?.message || 'Failed to update booking status.');
    }
  };

  const handleUpdateTrainerStatus = async (id: string, status: string) => {
    try {
      await api.updateTrainerBookingStatus(id, status);
      loadBookings();
    } catch (err: any) {
      alert(err?.message || 'Failed to update trainer session status.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          Bookings & Personal Training Sessions
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Review, confirm, and supervise member reservations for studio fitness classes and 1-on-1 coach appointments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Studio Class Bookings ({classBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('trainers')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'trainers'
              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Trainer 1-on-1 Requests ({trainerBookings.length})
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'classes' ? (
        <div className="rounded-3xl bg-[#12141A] border border-white/10 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Reservations...</div>
          ) : classBookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#A1A1AA]">
              No studio class bookings registered.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px] bg-white/[0.02]">
                    <th className="py-4 px-6 font-semibold">Member</th>
                    <th className="py-4 px-6 font-semibold">Studio Class</th>
                    <th className="py-4 px-6 font-semibold">Date & Time</th>
                    <th className="py-4 px-6 font-semibold">Instructor</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {classBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{b.memberName}</div>
                        <div className="text-[11px] text-[#A1A1AA]">{b.memberPhone}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-white">{b.classTitle}</td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{b.classDate}</div>
                        <div className="text-[10px] text-[#D4AF37] font-mono">{b.classTime}</div>
                      </td>
                      <td className="py-4 px-6 text-white/80">{b.trainerName}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : b.status === 'REQUESTED'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : b.status === 'CANCELLED'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-white/5 text-white/60'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateClassStatus(b.id, e.target.value)}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:outline-none"
                        >
                          <option value="REQUESTED">REQUESTED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#12141A] border border-white/10 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Trainer Requests...</div>
          ) : trainerBookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#A1A1AA]">
              No personal trainer coaching requests on file.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px] bg-white/[0.02]">
                    <th className="py-4 px-6 font-semibold">Member</th>
                    <th className="py-4 px-6 font-semibold">Coach</th>
                    <th className="py-4 px-6 font-semibold">Requested Slot</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Member Notes</th>
                    <th className="py-4 px-6 font-semibold text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trainerBookings.map((tb) => (
                    <tr key={tb.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{tb.memberName}</div>
                        <div className="text-[11px] text-[#A1A1AA]">{tb.memberPhone}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#D4AF37]">{tb.trainerName}</td>
                      <td className="py-4 px-6">
                        <div className="text-white font-medium">{tb.bookingDate}</div>
                        <div className="text-[10px] text-[#D4AF37] font-mono">{tb.timeSlot}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            tb.status === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : tb.status === 'REQUESTED'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : tb.status === 'CANCELLED'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-white/5 text-white/60'
                          }`}
                        >
                          {tb.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#A1A1AA] max-w-xs truncate">
                        {tb.notes || '—'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={tb.status}
                          onChange={(e) => handleUpdateTrainerStatus(tb.id, e.target.value)}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-[11px] focus:outline-none"
                        >
                          <option value="REQUESTED">REQUESTED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
