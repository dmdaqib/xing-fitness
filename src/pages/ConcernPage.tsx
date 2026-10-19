import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BRAND } from '../data/brand';
import type { ConcernCategory } from '../types/concern';
import {
  ShieldAlert,
  Dumbbell,
  Sparkles,
  UserCheck,
  Users,
  CreditCard,
  CalendarDays,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  Copy,
  Check,
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  ArrowRight,
  Info
} from 'lucide-react';

interface CategoryOption {
  label: ConcernCategory;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    label: 'Equipment or maintenance',
    icon: Dumbbell,
    description: 'Machines, weights, cables, AC, lockers, or repairs'
  },
  {
    label: 'Cleanliness and hygiene',
    icon: Sparkles,
    description: 'Floor hygiene, washrooms, sanitizers, or towels'
  },
  {
    label: 'Trainer or coaching',
    icon: UserCheck,
    description: 'PT sessions, trainer support, technique guidance'
  },
  {
    label: 'Staff behaviour',
    icon: Users,
    description: 'Front desk, customer care, or floor interactions'
  },
  {
    label: 'Membership or billing',
    icon: CreditCard,
    description: 'Renewals, invoice queries, plan transfers, freezing'
  },
  {
    label: 'Group classes',
    icon: CalendarDays,
    description: 'HIIT, CrossFit, Zumba, Yoga schedule or instructor'
  },
  {
    label: 'Safety concern',
    icon: ShieldAlert,
    description: 'Facility hazards, injuries, security, or emergency protocols'
  },
  {
    label: 'Suggestion',
    icon: Lightbulb,
    description: 'Ideas for new equipment, music, class timings, or perks'
  },
  {
    label: 'Other',
    icon: HelpCircle,
    description: 'Any other matter you wish to bring to management'
  }
];

const GYM_LOCATIONS = [
  'Main Training Floor (Free Weights / Dumbbells)',
  'Plate-Loaded & Pin-Loaded Machine Zone',
  'Cardio Deck (Treadmills / Ellipticals / Cycles)',
  'CrossFit & Functional Training Rig',
  'Group Fitness & Studio Area',
  'Male Locker Room & Restroom',
  'Female Locker Room & Restroom',
  'Reception & Front Desk Area',
  'Turnstile & Entrance Lobby',
  'Vehicle Parking Area',
  'Other / Not Location-Specific'
];

export const ConcernPage: React.FC = () => {
  // Form State
  const [category, setCategory] = useState<ConcernCategory | ''>('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [gymLocation, setGymLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'Phone Call' | 'WhatsApp' | 'Email' | 'No contact needed'>('Phone Call');
  const [websiteUrl, setWebsiteUrl] = useState(''); // Honeypot field

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Set noindex, nofollow and title for unlisted security
  useEffect(() => {
    document.title = "We're Listening | Member Feedback & Concern System | Xing Fitness";

    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const originalContent = metaTag ? metaTag.getAttribute('content') : null;

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      if (originalContent) {
        metaTag?.setAttribute('content', originalContent);
      } else if (metaTag && metaTag.parentNode) {
        metaTag.parentNode.removeChild(metaTag);
      }
    };
  }, []);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!category) {
      errs.category = 'Please choose a category that best describes your feedback.';
    }

    if (!subject.trim()) {
      errs.subject = 'Please enter a brief subject.';
    } else if (subject.trim().length < 3) {
      errs.subject = 'Subject must be at least 3 characters.';
    } else if (subject.trim().length > 150) {
      errs.subject = 'Subject cannot exceed 150 characters.';
    }

    if (!description.trim()) {
      errs.description = 'Please describe your concern or suggestion.';
    } else if (description.trim().length < 10) {
      errs.description = 'Please provide a bit more detail (at least 10 characters).';
    } else if (description.trim().length > 3000) {
      errs.description = 'Description cannot exceed 3000 characters.';
    }

    if (incidentDate) {
      const today = new Date().toISOString().split('T')[0];
      if (incidentDate > today) {
        errs.incidentDate = 'Incident date cannot be in the future.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        category: category as ConcernCategory,
        subject: subject.trim(),
        description: description.trim(),
        incidentDate: incidentDate ? incidentDate.trim() : undefined,
        gymLocation: gymLocation ? gymLocation.trim() : undefined,
        isAnonymous,
        name: isAnonymous ? undefined : name.trim() || undefined,
        phone: isAnonymous ? undefined : phone.trim() || undefined,
        email: isAnonymous ? undefined : email.trim() || undefined,
        contactInfo: isAnonymous ? undefined : (phone.trim() || email.trim() || undefined),
        preferredContactMethod: isAnonymous ? undefined : ((phone.trim() || email.trim()) ? preferredContactMethod : undefined),
        websiteUrl: websiteUrl.trim() || undefined // Honeypot
      };

      const result = await api.submitConcern(payload);
      setSubmissionSuccess(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrors({
        form: err?.message || 'Unable to submit your feedback right now. Please try again or speak with the manager on duty.'
      });
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (submissionSuccess?.referenceId) {
      navigator.clipboard.writeText(submissionSuccess.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleResetForm = () => {
    setSubmissionSuccess(null);
    setCategory('');
    setSubject('');
    setDescription('');
    setIncidentDate('');
    setGymLocation('');
    setIsAnonymous(false);
    setName('');
    setPhone('');
    setEmail('');
    setPreferredContactMethod('Phone Call');
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // SUCCESS CONFIRMATION VIEW
  // -------------------------------------------------------------
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
        {/* Discreet Header */}
        <header className="px-4 py-4 border-b border-white/10 bg-[#12141A]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center font-black text-black text-sm">
                X
              </div>
              <div>
                <span className="text-sm font-black tracking-wider uppercase text-white font-display block leading-none">
                  Xing Fitness
                </span>
                <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase font-semibold">
                  Management Desk
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Transmitted
            </span>
          </div>
        </header>

        {/* Confirmation Card */}
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
          <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/20">
                <CheckCircle2 className="w-9 h-9 text-black stroke-[2.5]" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display tracking-tight">
                  Concern Submitted
                </h1>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  Thank you for sharing your concern. Your feedback has been submitted to the Xing Fitness management team.
                </p>
              </div>

              {/* Reference ID Box */}
              <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#1A1D24] border border-[#D4AF37]/30 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">
                      Unique Reference ID
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-black text-white tracking-wider">
                      {submissionSuccess.referenceId}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyReference}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    {copiedRef ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#D4AF37]" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A1A1AA]">
                  <span>Category: <strong className="text-white">{submissionSuccess.category}</strong></span>
                  <span>•</span>
                  <span>Logged: <strong className="text-white">{new Date(submissionSuccess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                  {submissionSuccess.googleSheetsSynced && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Recorded in Google Sheets
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Important Disclaimers */}
              <div className="space-y-3 text-xs text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p>
                    {isAnonymous ? (
                      <span>
                        You submitted this concern <strong>anonymously</strong>. Your report has been dispatched to facility management for review and audit, but our team cannot follow up with you directly.
                      </span>
                    ) : (
                      <span>
                        Your submission includes contact details. Our management team reviews submissions in priority order and will reach out via your preferred method if follow-up is needed.
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-start gap-2.5 text-[#A1A1AA]">
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p>
                    Please save your Reference ID if you wish to mention it to front desk staff or facility management in person.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Submit Another Feedback
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c29e2f] text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
                >
                  <span>Return to Website</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="px-4 py-6 border-t border-white/10 text-center text-xs text-[#A1A1AA]">
          <p>© {new Date().getFullYear()} {BRAND.name}. Confidential Management Feedback Channel.</p>
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN CONCERN SUBMISSION FORM
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Discreet Dedicated Brand Header */}
      <header className="px-4 py-4 border-b border-white/10 bg-[#12141A]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center font-black text-black shadow-md shadow-[#D4AF37]/20">
              X
            </div>
            <div>
              <span className="text-sm sm:text-base font-black tracking-wider uppercase text-white font-display block leading-none">
                Xing Fitness
              </span>
              <span className="text-[10px] text-[#A1A1AA] tracking-widest uppercase font-semibold">
                Member Services • Management Direct
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-[#A1A1AA] border border-white/10">
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span className="hidden sm:inline">Encrypted Channel</span>
              <span className="sm:hidden">Private</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Emergency Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-300 block uppercase tracking-wide text-[11px] mb-0.5">
              Urgent Safety / Emergency Notice
            </strong>
            This feedback form is reviewed by authorised management and should not be used for emergencies. If you are experiencing an immediate physical hazard or medical emergency, please alert floor staff immediately or dial local emergency services.
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
            <span>Direct Management Line</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-display tracking-tight">
            WE'RE LISTENING
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Your feedback helps us make Xing Fitness a better place to train. Share a concern, report an issue, or suggest an improvement directly to our management team.
          </p>
        </div>

        {/* Global Error Alert */}
        {errors.form && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p>{errors.form}</p>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Honeypot field (hidden from real users) */}
          <div className="hidden" aria-hidden="true" tabIndex={-1}>
            <label htmlFor="websiteUrl">Do not fill this field</label>
            <input
              type="text"
              id="websiteUrl"
              name="websiteUrl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* STEP 1: CONCERN CATEGORY */}
          <div className="bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-black uppercase text-white font-display tracking-wider block">
                  1. Concern Category <span className="text-[#D4AF37]">*</span>
                </label>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Select the category that best matches your feedback
                </p>
              </div>
              {category && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                  Selected
                </span>
              )}
            </div>

            {errors.category && (
              <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.category}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CATEGORY_OPTIONS.map((item) => {
                const isSelected = category === item.label;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setCategory(item.label);
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: '' }));
                      }
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/10'
                        : 'bg-[#1A1D24] border-white/5 text-[#A1A1AA] hover:border-white/20 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-[#D4AF37]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: CONCERN DETAILS */}
          <div className="bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5">
            <div>
              <label className="text-sm font-black uppercase text-white font-display tracking-wider block">
                2. Details of Your Feedback <span className="text-[#D4AF37]">*</span>
              </label>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Provide as much context as possible to help our team take prompt action
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="concern-subject" className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Brief Subject <span className="text-[#D4AF37]">*</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {subject.length}/150
                </span>
              </div>
              <input
                id="concern-subject"
                type="text"
                maxLength={150}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                }}
                placeholder="e.g., Cable crossover pulley squeaking, water cooler refill"
                className={`w-full px-4 py-3 rounded-xl bg-[#1A1D24] border text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-colors ${
                  errors.subject
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-[#D4AF37]'
                }`}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
              />
              {errors.subject && (
                <p id="subject-error" className="text-xs text-red-400 font-semibold flex items-center gap-1.5" role="alert">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="concern-description" className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Detailed Description <span className="text-[#D4AF37]">*</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {description.length}/3000
                </span>
              </div>
              <textarea
                id="concern-description"
                rows={5}
                maxLength={3000}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                placeholder="Please describe what happened, what equipment was involved, or how you would like management to improve things..."
                className={`w-full px-4 py-3 rounded-xl bg-[#1A1D24] border text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-colors leading-relaxed ${
                  errors.description
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-[#D4AF37]'
                }`}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <p id="description-error" className="text-xs text-red-400 font-semibold flex items-center gap-1.5" role="alert">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Optional Incident Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="concern-date" className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Date of Incident (Optional)</span>
                </label>
                <input
                  id="concern-date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={incidentDate}
                  onChange={(e) => {
                    setIncidentDate(e.target.value);
                    if (errors.incidentDate) setErrors((prev) => ({ ...prev, incidentDate: '' }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37] scheme-dark"
                />
                {errors.incidentDate && (
                  <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errors.incidentDate}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="concern-location" className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Location in Gym (Optional)</span>
                </label>
                <select
                  id="concern-location"
                  value={gymLocation}
                  onChange={(e) => setGymLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Select location / zone...</option>
                  {GYM_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: PRIVACY & CONTACT DETAILS */}
          <div className="bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5">
            <div>
              <label className="text-sm font-black uppercase text-white font-display tracking-wider block">
                3. Privacy & Contact Preference
              </label>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                You can choose to remain fully anonymous or share your contact details for follow-up
              </p>
            </div>

            {/* Anonymous Toggle Switch */}
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Submit Anonymously
                  </span>
                  {isAnonymous && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When checked, your name and contact info are withheld. Management reviews all anonymous feedback thoroughly, but cannot reply to you directly.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isAnonymous}
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-1 ${
                  isAnonymous ? 'bg-[#D4AF37]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isAnonymous ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* Contact Details (Only when not anonymous) */}
            {!isAnonymous ? (
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="space-y-1.5">
                  <label htmlFor="concern-name" className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Your Name (Optional)</span>
                  </label>
                  <input
                    id="concern-name"
                    type="text"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rohan Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="concern-phone" className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Phone Number (Optional)</span>
                    </label>
                    <input
                      id="concern-phone"
                      type="tel"
                      maxLength={50}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="concern-email" className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Email Address (Optional)</span>
                    </label>
                    <input
                      id="concern-email"
                      type="email"
                      maxLength={100}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., rohan@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {(phone.trim() || email.trim()) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                      Preferred Follow-up Method
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['Phone Call', 'WhatsApp', 'Email', 'No contact needed'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPreferredContactMethod(method)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                            preferredContactMethod === method
                              ? 'bg-[#D4AF37] text-black font-black'
                              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Contact fields omitted for anonymity. No personal identifying records will be attached.</span>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#c59f2e] hover:to-amber-600 text-black font-black uppercase tracking-wider text-sm shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Feedback Securely...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Submit to Management</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
              Submissions are stored persistently on the Xing Fitness server and routed directly to authorized facility supervisors and ownership.
            </p>
          </div>
        </form>
      </main>

      {/* Discreet Footer */}
      <footer className="px-4 py-8 border-t border-white/10 bg-[#090A0D] text-center text-xs text-zinc-500 space-y-1">
        <p className="font-semibold text-zinc-400">
          Xing Fitness — Brookefield, AECS Layout, Whitefield, Bengaluru
        </p>
        <p className="text-[11px]">
          Dedicated Unlisted Route • Direct Management Supervision
        </p>
      </footer>
    </div>
  );
};
