import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Search,
  Plus,
  UserCheck,
  UserX,
  CheckCircle2,
  X,
  RefreshCw,
  Eye
} from 'lucide-react';


export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    planId: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    fitnessGoal: 'Hypertrophy & Strength',
    emergencyContact: '',
    address: ''
  });
  const [createResult, setCreateResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
    loadPlans();
  }, []);

  const loadMembers = async (search?: string, status?: string) => {
    try {
      setIsLoading(true);
      const data = await api.getAdminMembers({ search, status });
      setMembers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const p = await api.getPublicPlans();
      setPlans(p);
      if (p.length > 0 && !createForm.planId) {
        setCreateForm((prev) => ({ ...prev, planId: p[0].id }));
      }
    } catch {
      // Ignored
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    loadMembers(val, statusFilter);
  };

  const handleFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    loadMembers(searchTerm, status);
  };

  const handleOpenDetail = async (memberId: string) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const detail = await api.getAdminMemberDetail(memberId);
      setSelectedMemberDetail(detail);
    } catch (err: any) {
      alert(err?.message || 'Failed to load member detail.');
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleStatus = async (member: any) => {
    const action = member.active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${member.name} (${member.membershipNumber})?`)) {
      return;
    }
    try {
      await api.toggleMemberStatus(member.id, !member.active);
      loadMembers(searchTerm, statusFilter);
    } catch (err: any) {
      alert(err?.message || `Failed to ${action} member.`);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setCreateResult(null);

    try {
      const res = await api.createMember(createForm);
      setCreateResult(res);
      loadMembers(searchTerm, statusFilter);
      // Reset form
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        planId: plans[0]?.id || '',
        dateOfBirth: '',
        gender: 'Prefer not to say',
        fitnessGoal: 'Hypertrophy & Strength',
        emergencyContact: '',
        address: ''
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create member account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Member Management
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Maintain member credentials, verified attendance, and plan statuses.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateResult(null);
            setErrorMessage(null);
            setCreateModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#12141A] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, phone, email, or member ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#A1A1AA] mr-1">Status:</span>
          {(['all', 'active', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-white/20 mx-auto mb-2" />
            <p className="text-xs text-[#A1A1AA]">Retrieving Members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#A1A1AA]">
            No members found matching the specified query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px] bg-white/[0.02]">
                  <th className="py-4 px-6 font-semibold">Member</th>
                  <th className="py-4 px-6 font-semibold">Contact</th>
                  <th className="py-4 px-6 font-semibold">Plan & Term</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">{member.name}</div>
                          <span className="text-[10px] font-mono text-[#D4AF37]">
                            {member.membershipNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-white/90">{member.phone}</div>
                      <div className="text-[11px] text-[#A1A1AA]">{member.email}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{member.membershipPlan}</div>
                      <div className="text-[10px] text-[#A1A1AA]">
                        {member.membershipEndDate ? `Expires: ${member.membershipEndDate}` : 'Pending'}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          member.active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {member.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(member.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            member.active
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                          }`}
                          title={member.active ? 'Deactivate Member' : 'Activate Member'}
                        >
                          {member.active ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MEMBER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white font-display mb-1">
              Enroll New Member
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Creates authenticated account, member profile, and active membership record.
            </p>

            {createResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Member Account Created Successfully!</p>
                    <p className="mt-1">
                      Member ID: <span className="font-mono font-bold">{createResult.member.membershipNumber}</span>
                    </p>
                    <p className="mt-1">
                      Temporary Sign-In Password:{' '}
                      <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-white font-bold">
                        {createResult.tempPassword}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Membership Plan *
                    </label>
                    <select
                      value={createForm.planId}
                      onChange={(e) => setCreateForm({ ...createForm, planId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.durationMonths}m)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Primary Fitness Goal
                    </label>
                    <select
                      value={createForm.fitnessGoal}
                      onChange={(e) => setCreateForm({ ...createForm, fitnessGoal: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Hypertrophy & Strength">Hypertrophy & Strength</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Posture & Functional Mobility">Posture Correction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      placeholder="Name & Contact No."
                      value={createForm.emergencyContact}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, emergencyContact: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-semibold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase hover:bg-[#C5A028] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Enroll & Generate Credentials'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MEMBER DETAIL DRAWER/MODAL */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {detailLoading || !selectedMemberDetail ? (
              <div className="p-12 text-center text-xs text-[#A1A1AA]">
                Loading Member Dossier...
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                      {selectedMemberDetail.member.membershipNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        selectedMemberDetail.member.active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {selectedMemberDetail.member.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white font-display">
                    {selectedMemberDetail.member.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    {selectedMemberDetail.member.email} • {selectedMemberDetail.member.phone}
                  </p>
                </div>

                {/* Membership details */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Plan:</span>
                    <span className="font-bold text-white">
                      {selectedMemberDetail.membership?.planName || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Term:</span>
                    <span className="text-white">
                      {selectedMemberDetail.membership?.startDate} to{' '}
                      {selectedMemberDetail.membership?.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Status:</span>
                    <span className="text-[#D4AF37] font-bold">
                      {selectedMemberDetail.membership?.status}
                    </span>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                    Verified Attendance ({selectedMemberDetail.attendance.length} Total Visits)
                  </h4>
                  {selectedMemberDetail.attendance.length === 0 ? (
                    <p className="text-xs text-[#A1A1AA]">No facility visits recorded.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
                      {selectedMemberDetail.attendance.map((a: any) => (
                        <div
                          key={a.id}
                          className="p-2.5 rounded-xl bg-white/5 flex justify-between text-xs text-white/80"
                        >
                          <span>{a.date}</span>
                          <span className="text-[#D4AF37] font-mono">
                            {a.checkInTime} - {a.checkOutTime || 'Ongoing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                    Biometric Check-Ins ({selectedMemberDetail.progress.length} Entries)
                  </h4>
                  {selectedMemberDetail.progress.length === 0 ? (
                    <p className="text-xs text-[#A1A1AA]">No weigh-ins logged.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
                      {selectedMemberDetail.progress.map((p: any) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-white/5 flex justify-between text-xs text-white/80"
                        >
                          <span>{p.date}</span>
                          <span className="text-white font-bold">{p.weightKg} kg</span>
                          <span className="text-[#D4AF37]">BMI {p.bmi}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
