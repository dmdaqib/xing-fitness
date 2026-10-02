import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Edit,
  Award,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';


export const AdminTrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photoUrl: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
    specializationText: '',
    experience: '[YEARS EXPERIENCE]',
    certificationsText: '',
    bio: '',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminTrainers();
      setTrainers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      role: 'Strength & Biomechanics Specialist',
      photoUrl: '/images/real/training-floor/xing-fitness-dumbbell-benches-training-md.webp',
      specializationText: 'Matrix Machine Biomechanics\nPowerlifting & Barbell Form',
      experience: '[YEARS EXPERIENCE]',
      certificationsText: '[CERTIFICATION - CSCS / ACE]\nCPR & First Aid',
      bio: 'Coaches progressive overload, joint alignment, and resistance periodization.',
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setEditingTrainer(t);
    setFormData({
      name: t.name,
      role: t.role,
      photoUrl: t.photoUrl,
      specializationText: (t.specialization || []).join('\n'),
      experience: t.experience,
      certificationsText: (t.certifications || []).join('\n'),
      bio: t.bio,
      active: t.active
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const specialization = formData.specializationText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const certifications = formData.certificationsText
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const payload = {
      ...(editingTrainer ? { id: editingTrainer.id, availability: editingTrainer.availability } : {
        availability: [
          { dayOfWeek: 'Mon', timeSlots: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'] },
          { dayOfWeek: 'Wed', timeSlots: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'] },
          { dayOfWeek: 'Fri', timeSlots: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'] }
        ]
      }),
      name: formData.name,
      role: formData.role,
      photoUrl: formData.photoUrl,
      specialization,
      experience: formData.experience,
      certifications,
      bio: formData.bio,
      active: formData.active
    };

    try {
      await api.saveAdminTrainer(payload);
      setModalOpen(false);
      loadTrainers();
    } catch (err: any) {
      alert(err?.message || 'Failed to save trainer profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (t: any) => {
    try {
      await api.saveAdminTrainer({ ...t, active: !t.active });
      loadTrainers();
    } catch (err: any) {
      alert(err?.message || 'Failed to update trainer status.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Trainer & Coaching Roster
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Maintain coach credentials, real floor facility portraits, specialties, and 1-on-1 availability slots.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainer Profile</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Trainer Roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        {trainers.map((t) => (
          <div
            key={t.id}
            className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
              t.active
                ? 'bg-[#12141A] border-white/10 hover:border-white/20'
                : 'bg-[#12141A]/40 border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-white/5 relative">
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  className="w-full h-full object-cover object-center"
                />
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    t.active ? 'bg-emerald-500/80 text-black' : 'bg-red-500/80 text-white'
                  }`}
                >
                  {t.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-base font-black uppercase text-white font-display">{t.name}</h3>
              <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">{t.role}</p>
              <p className="text-xs text-[#A1A1AA] mt-2 line-clamp-2">{t.bio}</p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs">
                <div className="text-[11px] text-white/70">
                  <span className="font-semibold text-white">Experience:</span> {t.experience}
                </div>
                <div className="text-[11px] text-white/70 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.certifications?.[0] || 'Certified'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(t)}
                className="text-xs font-semibold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {t.active ? (
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
                onClick={() => handleOpenEdit(t)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}


      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white font-display mb-1">
              {editingTrainer ? 'Edit Trainer Profile' : 'Add Coach Profile'}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Configure name, role, specialization tags, and bio.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Coach Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Role / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Strength & Conditioning Coach"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Facility Photo URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Specialization Tags (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.specializationText}
                  onChange={(e) => setFormData({ ...formData, specializationText: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Certifications (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.certificationsText}
                  onChange={(e) => setFormData({ ...formData, certificationsText: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Coach Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
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
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
