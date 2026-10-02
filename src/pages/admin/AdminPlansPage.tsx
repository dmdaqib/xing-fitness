import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Check,
  Edit,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';


export const AdminPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit / Create modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    tier: 'monthly',
    durationMonths: 1,
    priceDisplay: '[MEMBERSHIP PRICE]',
    basePrice: 0,
    benefitsText: '',
    popular: false,
    active: true
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminPlans();
      setPlans(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      tier: 'monthly',
      durationMonths: 1,
      priceDisplay: '[MEMBERSHIP PRICE]',
      basePrice: 0,
      benefitsText: 'Full floor & Matrix machine access\nDigital locker & private shower suites\nInitial movement screening\nFree Wi-Fi & parking',
      popular: false,
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tier: plan.tier || 'monthly',
      durationMonths: plan.durationMonths,
      priceDisplay: plan.priceDisplay,
      basePrice: plan.basePrice || 0,
      benefitsText: (plan.benefits || []).join('\n'),
      popular: plan.popular || false,
      active: plan.active
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const benefits = formData.benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const payload = {
      ...(editingPlan ? { id: editingPlan.id } : {}),
      name: formData.name,
      tier: formData.tier,
      durationMonths: Number(formData.durationMonths),
      priceDisplay: formData.priceDisplay,
      basePrice: Number(formData.basePrice),
      benefits,
      popular: formData.popular,
      active: formData.active
    };

    try {
      await api.saveAdminPlan(payload);
      setModalOpen(false);
      loadPlans();
    } catch (err: any) {
      alert(err?.message || 'Failed to save membership plan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (plan: any) => {
    try {
      await api.saveAdminPlan({ ...plan, active: !plan.active });
      loadPlans();
    } catch (err: any) {
      alert(err?.message || 'Failed to update plan status.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Membership Plan Management
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Configure dynamic membership tiers, duration options, pricing tags, and enrolled benefits.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Membership Plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
              plan.active
                ? 'bg-[#12141A] border-white/10 hover:border-white/20'
                : 'bg-[#12141A]/40 border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-[#D4AF37]">
                  {plan.durationMonths} Month{plan.durationMonths > 1 ? 's' : ''}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase ${
                    plan.active ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-lg font-black uppercase text-white font-display">{plan.name}</h3>

              <div className="text-sm font-bold text-[#D4AF37] mt-1">
                {plan.priceDisplay || '[MEMBERSHIP PRICE]'}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                {(plan.benefits || []).map((b: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-white/70">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(plan)}
                className="text-xs font-semibold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {plan.active ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-white/40" />
                    <span>Inactive</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenEdit(plan)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}


      {/* EDIT / CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white font-display mb-1">
              {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Configure plan duration, display pricing tag, and benefits list.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Plan Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Year Elite Access"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Duration (Months) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    required
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Price Display Tag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="[MEMBERSHIP PRICE] or ₹18,000"
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Benefits (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.benefitsText}
                  onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-[#D4AF37]"
                  />
                  <span>Mark as Popular Choice</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-[#D4AF37]"
                  />
                  <span>Active (Visible to Members)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
