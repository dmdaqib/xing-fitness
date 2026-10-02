import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  TrendingUp,
  Scale,
  Plus,
  AlertCircle,
  CheckCircle2,
  Activity
} from 'lucide-react';


export const MemberProgressPage: React.FC = () => {
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('178');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Hypertrophy & Strength');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProgress();
      setProgressEntries(data || []);
      if (data && data.length > 0) {
        const latest = data[data.length - 1];
        setHeightCm(String(latest.heightCm || 178));
        setFitnessGoal(latest.fitnessGoal || 'Hypertrophy & Strength');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculatedBmi = () => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm) / 100;
    if (w > 0 && h > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return null;
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);

    if (isNaN(w) || w < 30 || w > 250) {
      setFeedback({ type: 'error', message: 'Please enter a valid weight between 30 and 250 kg.' });
      return;
    }
    if (isNaN(h) || h < 100 || h > 240) {
      setFeedback({ type: 'error', message: 'Please enter a valid height between 100 and 240 cm.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await api.addProgress({
        weightKg: w,
        heightCm: h,
        fitnessGoal,
        notes
      });

      setFeedback({
        type: 'success',
        message: 'Biometric update logged successfully!'
      });
      setWeightKg('');
      setNotes('');
      // Reload entries
      const updated = await api.getProgress();
      setProgressEntries(updated || []);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Failed to record entry.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Biometric Data...
        </p>
      </div>
    );
  }

  // Render SVG Chart only when sufficient real historical data points exist (at least 2 points)
  const hasSufficientDataForChart = progressEntries.length >= 2;

  // Compute SVG chart coordinates
  const weights = progressEntries.map((p) => p.weightKg);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;
  const chartHeight = 160;
  const chartWidth = 500;

  const points = progressEntries.map((p, idx) => {
    const x = (idx / (progressEntries.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - ((p.weightKg - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
    return { x, y, weight: p.weightKg, date: p.date, bmi: p.bmi };
  });

  const pathD = points.length > 0
    ? points.reduce(
        (acc, pt, idx) => (idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
        ''
      )
    : '';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          Fitness Progress & Biometrics
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Track body composition, weigh-in consistency, and BMI trajectory over time. All data remains strictly private to your account.
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

      {/* Visual Chart Section (Only shown when sufficient data exists) */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white font-display">
                Weight Trajectory
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">
                {hasSufficientDataForChart
                  ? `${progressEntries.length} logged data points on record`
                  : 'Requires at least 2 logged weigh-ins to plot trend line'}
              </p>
            </div>
          </div>

          {progressEntries.length > 0 && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">
                Latest Record
              </span>
              <span className="text-xl font-black text-white">
                {progressEntries[progressEntries.length - 1].weightKg} kg
              </span>
            </div>
          )}
        </div>

        {hasSufficientDataForChart ? (
          <div className="overflow-x-auto pb-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 overflow-visible"
            >
              {/* Subtle background guide lines */}
              <line x1="30" y1="20" x2={chartWidth - 30} y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="30" y1={chartHeight / 2} x2={chartWidth - 30} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="30" y1={chartHeight - 20} x2={chartWidth - 30} y2={chartHeight - 20} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Trend Path */}
              <path
                d={pathD}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#090A0D"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {pt.weight}kg
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#71717A"
                    fontSize="9"
                  >
                    {pt.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/5">
            <Activity className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-[#A1A1AA]">
              Log at least two weigh-in entries using the form below to activate your interactive progress chart.
            </p>
          </div>
        )}
      </div>

      {/* Log New Entry Form */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-6 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Record New Weigh-In / Biometric Check</span>
        </h3>

        <form onSubmit={handleAddEntry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Current Weight (kg) *
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 76.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="e.g. 178"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Calculated BMI
              </label>
              <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-black text-[#D4AF37]">
                {calculatedBmi() || '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Current Primary Goal
              </label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Hypertrophy & Strength">Hypertrophy & Strength</option>
                <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                <option value="Posture Correction">Posture & Mobility</option>
                <option value="Endurance & Performance">Endurance & Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Progress / Training Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Increased squat by 5kg, energy high"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={isSubmitting || !weightKg}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Save Biometric Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* History Log Table */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
          Historical Check-In Log ({progressEntries.length} Entries)
        </h3>

        {progressEntries.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A1A1AA]">
            No historical logs recorded. Submit your first weigh-in above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Weight</th>
                  <th className="pb-3 font-semibold">Height</th>
                  <th className="pb-3 font-semibold">BMI</th>
                  <th className="pb-3 font-semibold">Goal</th>
                  <th className="pb-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...progressEntries].reverse().map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-white font-medium">{entry.date}</td>
                    <td className="py-3 text-[#D4AF37] font-bold">{entry.weightKg} kg</td>
                    <td className="py-3 text-white/80">{entry.heightCm} cm</td>
                    <td className="py-3 text-[#D4AF37] font-semibold">{entry.bmi}</td>
                    <td className="py-3 text-white/70">{entry.fitnessGoal}</td>
                    <td className="py-3 text-[#A1A1AA] italic">{entry.notes || '—'}</td>
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
