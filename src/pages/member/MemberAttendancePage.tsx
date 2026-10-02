import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut
} from 'lucide-react';

export const MemberAttendancePage: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAttendance();
      setAttendanceData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    setFeedback(null);
    try {
      const res = await api.checkIn();
      setFeedback({
        type: 'success',
        message: res.checkOutTime
          ? `Checked out successfully at ${res.checkOutTime}. Session concluded!`
          : `Checked in successfully at ${res.checkInTime}. Have a great workout!`
      });
      const freshData = await api.getAttendance();
      setAttendanceData(freshData);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Check-in operation failed.'
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Attendance Log...
        </p>
      </div>
    );
  }

  const records = attendanceData?.records || [];
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = records.find((r: any) => r.date === today);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Attendance & Facility Check-Ins
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Real verification records of your gym floor sessions and studio classes at Brookefield.
          </p>
        </div>

        {/* Check-In CTA Button */}
        <button
          onClick={handleCheckIn}
          disabled={isCheckingIn || (todayRecord && todayRecord.status === 'COMPLETED')}
          className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isCheckingIn ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : todayRecord && !todayRecord.checkOutTime ? (
            <LogOut className="w-4 h-4" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <span>
            {todayRecord && !todayRecord.checkOutTime
              ? 'Check Out Session Today'
              : todayRecord && todayRecord.status === 'COMPLETED'
              ? 'Today Session Completed'
              : 'Log Floor Check-In Now'}
          </span>
        </button>
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

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 text-center">
          <span className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider block">
            Weekly Visits (Last 7 Days)
          </span>
          <div className="text-4xl font-black text-white mt-2">
            {attendanceData?.weeklyVisits || 0}
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Sessions this rolling week</p>
        </div>

        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 text-center">
          <span className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider block">
            Monthly Visits (Last 30 Days)
          </span>
          <div className="text-4xl font-black text-[#D4AF37] mt-2">
            {attendanceData?.monthlyVisits || 0}
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Sessions this rolling month</p>
        </div>

        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 text-center">
          <span className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider block">
            All-Time Total Visits
          </span>
          <div className="text-4xl font-black text-[#D4AF37] mt-2">
            {attendanceData?.totalVisits || 0}
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Lifetime verified entries</p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
          Verified Attendance Record ({records.length} Entries)
        </h3>

        {records.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#A1A1AA]">
            No facility visits logged yet. Use the Check-In button when you arrive on the training floor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Check-In Time</th>
                  <th className="pb-3 font-semibold">Check-Out Time</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Verification Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map((r: any) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-white font-medium flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{r.date}</span>
                    </td>
                    <td className="py-3 text-[#D4AF37] font-mono font-bold">{r.checkInTime}</td>
                    <td className="py-3 text-white/80 font-mono">
                      {r.checkOutTime || 'In Session'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          r.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#A1A1AA]">Xing Brookefield Turnstile #1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
