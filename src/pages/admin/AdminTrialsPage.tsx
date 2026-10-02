import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  X
} from 'lucide-react';


export const AdminTrialsPage: React.FC = () => {
  const [trials, setTrials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrial, setSelectedTrial] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [followUpNote, setFollowUpNote] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadTrials();
  }, []);

  const loadTrials = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminTrials();
      setTrials(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpdate = (trial: any) => {
    setSelectedTrial(trial);
    setNewStatus(trial.status);
    setFollowUpNote('');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrial) return;
    setIsUpdating(true);
    try {
      await api.updateLeadStatus(selectedTrial.id, newStatus, followUpNote);
      setSelectedTrial(null);
      loadTrials();
    } catch (err: any) {
      alert(err?.message || 'Failed to update trial status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          Free Trial Pass Management
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Review prospective visitor bookings, preferred trial dates, and staff scheduling confirmations.
        </p>
      </div>

      <div className="rounded-3xl bg-[#12141A] border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Free Trial Requests...</div>
        ) : trials.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#A1A1AA]">
            No Free Trial requests recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px] bg-white/[0.02]">
                  <th className="py-4 px-6 font-semibold">Prospect</th>
                  <th className="py-4 px-6 font-semibold">Preferred Schedule</th>
                  <th className="py-4 px-6 font-semibold">Fitness Goal</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Received</th>
                  <th className="py-4 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trials.map((trial) => (
                  <tr key={trial.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{trial.name}</div>
                      <div className="text-[#A1A1AA] text-xs flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-[#D4AF37]" />
                        <span>{trial.phone}</span>
                      </div>
                      {trial.email && (
                        <div className="text-white/40 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{trial.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-white font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{trial.preferredDate || 'Flexible / Today'}</span>
                      </div>
                      <div className="text-[11px] text-[#A1A1AA] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                        <span>{trial.preferredTime || 'Anytime'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-white/90">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-[#D4AF37]">
                        {trial.fitnessGoal || 'Strength & Fitness'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          trial.status === 'NEW'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : trial.status === 'CONTACTED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : trial.status === 'CONFIRMED' || trial.status === 'SCHEDULED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : trial.status === 'COMPLETED'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : trial.status === 'CANCELLED'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : trial.status === 'JOINED'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                            : 'bg-white/5 text-white/50 border border-white/5'
                        }`}
                      >
                        {trial.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#A1A1AA]">
                      {new Date(trial.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenUpdate(trial)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedTrial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedTrial(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white font-display mb-1">
              Trial Action: {selectedTrial.name}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Preferred: {selectedTrial.preferredDate} ({selectedTrial.preferredTime || 'Anytime'})
            </p>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Trial Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED (Staff Confirmed)</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="JOINED">JOINED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Staff Directives / Confirmation Notes
                </label>
                <textarea
                  rows={3}
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="e.g. Confirmed pass over WhatsApp. Assigned coach for movement screen."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTrial(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Confirm Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
