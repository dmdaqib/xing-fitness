import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Clock,
  User,
  Users,
  Edit,
  XCircle,
  CheckCircle2,
  X
} from 'lucide-react';


export const AdminClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Zumba',
    trainerName: '[TRAINER NAME - Group Studio Lead]',
    dayOfWeek: 'Mon',
    time: '06:30 PM',
    duration: '50 min',
    capacity: 15,
    status: 'ACTIVE',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminClasses();
      setClasses(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormData({
      title: '',
      category: 'Zumba',
      trainerName: '[TRAINER NAME - Group Studio Lead]',
      dayOfWeek: 'Mon',
      time: '06:30 PM',
      duration: '50 min',
      capacity: 15,
      status: 'ACTIVE',
      description: 'Energetic group class in mirrored purple studio.'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cls: any) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      category: cls.category,
      trainerName: cls.trainerName,
      dayOfWeek: cls.dayOfWeek,
      time: cls.time,
      duration: cls.duration,
      capacity: cls.capacity,
      status: cls.status,
      description: cls.description
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...(editingClass ? { id: editingClass.id } : {}),
      ...formData,
      capacity: Number(formData.capacity)
    };
    try {
      await api.saveAdminClass(payload);
      setModalOpen(false);
      loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Failed to save class.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClass = async (cls: any) => {
    if (!window.confirm(`Mark class "${cls.title}" as CANCELLED? Members will be prevented from booking.`)) {
      return;
    }
    try {
      await api.saveAdminClass({ ...cls, status: 'CANCELLED' });
      loadClasses();
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel class.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Studio Class Timetable
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Maintain group studio schedule, instructor assignments, capacities, and cancellation statuses.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Studio Class</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading Studio Classes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
              cls.status === 'ACTIVE'
                ? 'bg-[#12141A] border-white/10 hover:border-white/20'
                : 'bg-[#12141A]/40 border-white/5 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-[#D4AF37]">
                  {cls.category}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    cls.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : cls.status === 'CANCELLED'
                      ? 'bg-red-500/20 text-red-400 font-bold'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {cls.status}
                </span>
              </div>

              <h3 className="text-xl font-black uppercase text-white font-display">{cls.title}</h3>
              <p className="text-xs text-[#A1A1AA] mt-1.5">{cls.description}</p>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Schedule:
                  </span>
                  <span className="font-semibold text-white">
                    {cls.dayOfWeek} • {cls.time} ({cls.duration})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-white/50" /> Instructor:
                  </span>
                  <span className="font-semibold text-white">{cls.trainerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-white/50" /> Capacity Limit:
                  </span>
                  <span className="font-semibold text-white">{cls.capacity} Members Max</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              {cls.status === 'ACTIVE' ? (
                <button
                  onClick={() => handleCancelClass(cls)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Class</span>
                </button>
              ) : (
                <button
                  onClick={() => api.saveAdminClass({ ...cls, status: 'ACTIVE' }).then(loadClasses)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Activate</span>
                </button>
              )}

              <button
                onClick={() => handleOpenEdit(cls)}
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


      {/* CREATE / EDIT MODAL */}
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
              {editingClass ? 'Edit Studio Class' : 'Create Studio Class'}
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-6">
              Configure class title, instructor, weekly day & time slot, and capacity.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saturday HIIT & Functional Bootcamp"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Zumba">Zumba</option>
                    <option value="Yoga">Yoga</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Functional">Functional</option>
                    <option value="Strength">Strength</option>
                    <option value="Dance Fitness">Dance Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Day of Week
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Class Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 06:30 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                    Capacity Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Instructor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coach Vikram"
                  value={formData.trainerName}
                  onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                  Class Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {isSubmitting ? 'Saving...' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
