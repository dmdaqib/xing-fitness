import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Phone,
  Mail,
  X
} from 'lucide-react';


export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Update modal
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [followUpNote, setFollowUpNote] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [statusFilter, sourceFilter]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminLeads({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined
      });
      setLeads(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpdate = (lead: any) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setFollowUpNote('');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      await api.updateLeadStatus(selectedLead.id, newStatus, followUpNote);
      setSelectedLead(null);
      loadLeads();
    } catch (err: any) {
      alert(err?.message || 'Failed to update lead status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          Lead & Enquiry Management
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Follow up with prospects, trial visitors, and membership applicants across digital and desk touchpoints.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-[#12141A] border border-white/10 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#A1A1AA] mr-1">Status:</span>
          {['all', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'TRIAL BOOKED', 'JOINED', 'NOT INTERESTED'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#D4AF37] text-black font-black'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A1A1AA]">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Sources</option>
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Free Trial">Free Trial</option>
            <option value="Membership">Membership</option>
            <option value="Trainer">Trainer</option>
            <option value="Class">Class</option>
            <option value="Contact Form">Contact Form</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Leads Pipeline...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#A1A1AA]">
            No leads match the specified filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px] bg-white/[0.02]">
                  <th className="py-4 px-6 font-semibold">Prospect</th>
                  <th className="py-4 px-6 font-semibold">Source</th>
                  <th className="py-4 px-6 font-semibold">Interest Type</th>
                  <th className="py-4 px-6 font-semibold">Pref. Slot</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="text-[#A1A1AA] text-xs flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-[#D4AF37]" />
                        <span>{lead.phone}</span>
                      </div>
                      {lead.email && (
                        <div className="text-white/40 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase">
                        {lead.source}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-white/90">{lead.type}</div>
                      {lead.message && (
                        <div className="text-[11px] text-[#A1A1AA] line-clamp-1 italic mt-0.5">
                          "{lead.message}"
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-[#A1A1AA]">
                      {lead.preferredDate ? (
                        <span>
                          {lead.preferredDate} {lead.preferredTime || ''}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          lead.status === 'NEW'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : lead.status === 'CONTACTED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : lead.status === 'CONFIRMED' || lead.status === 'TRIAL BOOKED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : lead.status === 'COMPLETED' || lead.status === 'TRIAL COMPLETED'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : lead.status === 'CANCELLED' || lead.status === 'NOT INTERESTED'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : lead.status === 'JOINED'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                            : 'bg-white/5 text-white/50 border border-white/5'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#A1A1AA]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenUpdate(lead)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE STATUS & NOTES MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white font-display mb-1">
              Lead Follow-Up: {selectedLead.name}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Phone: {selectedLead.phone} • Source: {selectedLead.source}
            </p>

            {selectedLead.followUpNotes && (
              <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/5 max-h-32 overflow-y-auto text-xs text-white/80 whitespace-pre-line">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                  Prior Log Notes:
                </span>
                {selectedLead.followUpNotes}
              </div>
            )}

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Update Lead Pipeline Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="TRIAL BOOKED">TRIAL BOOKED</option>
                  <option value="TRIAL COMPLETED">TRIAL COMPLETED</option>
                  <option value="JOINED">JOINED</option>
                  <option value="NOT INTERESTED">NOT INTERESTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Append Follow-Up Notes
                </label>
                <textarea
                  rows={3}
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="e.g. Called lead. Scheduled facility walk-through for Friday at 6pm."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Lead Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
