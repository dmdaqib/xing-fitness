import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Edit,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';


export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    badge: 'Founding Member Privilege',
    description: '',
    discount: '40% OFF',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    eligibility: 'First 50 Registrations / Annual Plans',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminOffers();
      setOffers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      title: '40% OFF Annual Membership for First 50 Members',
      badge: 'Limited Founding Offer',
      description: 'Exclusive founding membership rate at our Brookefield facility. Includes all group classes and 2 personal coaching sessions.',
      discount: '40% OFF',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      eligibility: 'First 50 Members in Brookefield',
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (off: any) => {
    setEditingOffer(off);
    setFormData({
      title: off.title,
      badge: off.badge,
      description: off.description,
      discount: off.discount,
      startDate: off.startDate,
      endDate: off.endDate,
      eligibility: off.eligibility,
      active: off.active
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...(editingOffer ? { id: editingOffer.id } : {}),
      ...formData
    };
    try {
      await api.saveAdminOffer(payload);
      setModalOpen(false);
      loadOffers();
    } catch (err: any) {
      alert(err?.message || 'Failed to save offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (off: any) => {
    try {
      await api.saveAdminOffer({ ...off, active: !off.active });
      loadOffers();
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle offer.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Promotional Offers Management
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Centrally manage promotional discounts, founding rates, and reception banners.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotion</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Promotions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {offers.map((off) => {
          const isExpired = off.endDate < today;
          return (
            <div
              key={off.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                off.active && !isExpired
                  ? 'bg-[#12141A] border-white/10 hover:border-white/20'
                  : 'bg-[#12141A]/40 border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-[#D4AF37]">
                    {off.badge}
                  </span>

                  <div className="flex items-center gap-2">
                    {isExpired ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400">
                        Expired
                      </span>
                    ) : off.active ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                        Live Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 text-white/50">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-2xl font-black text-[#D4AF37] font-display mb-1">
                  {off.discount}
                </div>

                <h3 className="text-base font-bold text-white uppercase">{off.title}</h3>
                <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">{off.description}</p>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Eligibility:</span>
                    <span className="font-semibold text-white">{off.eligibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Window:</span>
                    <span className="text-white">
                      {off.startDate} to {off.endDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(off)}
                  className="text-xs font-semibold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {off.active ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-white/40" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(off)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Offer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}


      {/* MODAL */}
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
              {editingOffer ? 'Edit Promotion' : 'Create Promotion'}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Configure offer headline, discount amount, validity period, and eligibility criteria.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 40% OFF Annual Membership for First 50 Members"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Discount Badge
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 40% OFF"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Ribbon Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Founding Member Special"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  placeholder="e.g. First 50 New Members in Whitefield"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-[#D4AF37]"
                />
                <label htmlFor="offerActive" className="text-xs text-white cursor-pointer">
                  Publish to website immediately
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
                  {isSubmitting ? 'Saving...' : 'Save Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
