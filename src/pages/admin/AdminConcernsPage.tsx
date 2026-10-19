import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { api } from '../../services/api';
import { getConcernPageUrl, getProductionBaseUrl } from '../../utils/concernUrl';
import type { ConcernSubmission, ConcernStatus, ConcernStats } from '../../types/concern';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  Dumbbell,
  UserCheck,
  Users,
  CreditCard,
  CalendarDays,
  Lightbulb,
  HelpCircle,
  QrCode,
  Printer,
  Download,
  Copy,
  Check,
  Send,
  Eye,
  X,
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  Info
} from 'lucide-react';

const CATEGORIES = [
  'Equipment or maintenance',
  'Cleanliness and hygiene',
  'Trainer or coaching',
  'Staff behaviour',
  'Membership or billing',
  'Group classes',
  'Safety concern',
  'Suggestion',
  'Other'
];

const STATUS_CONFIG: Record<
  ConcernStatus,
  { label: string; bg: string; text: string; border: string; glow: string }
> = {
  NEW: {
    label: 'New Unreviewed',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/10'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/10'
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/10'
  },
  CLOSED: {
    label: 'Closed / Archived',
    bg: 'bg-zinc-500/20',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
    glow: 'shadow-zinc-500/10'
  }
};

export const AdminConcernsPage: React.FC = () => {
  // Concerns State
  const [concerns, setConcerns] = useState<ConcernSubmission[]>([]);
  const [stats, setStats] = useState<ConcernStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Detail Modal
  const [selectedConcern, setSelectedConcern] = useState<ConcernSubmission | null>(null);
  const [newNote, setNewNote] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [statusDraft, setStatusDraft] = useState<ConcernStatus>('NEW');
  const [resolutionDraft, setResolutionDraft] = useState<string>('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [assignedStaffInput, setAssignedStaffInput] = useState<string>('');
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [copiedRefId, setCopiedRefId] = useState(false);

  // QR Code & Print Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState<string>(getProductionBaseUrl());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Google Sheets Integration State
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [sheetsConfig, setSheetsConfig] = useState<any>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSyncingConcern, setIsSyncingConcern] = useState(false);

  // Load Concerns
  const loadConcerns = async () => {
    try {
      setIsLoading(true);
      const [listData, statsData] = await Promise.all([
        api.getAdminConcerns({
          status: statusFilter,
          category: categoryFilter,
          search: searchTerm.trim() || undefined
        }),
        api.getAdminConcernStats()
      ]);
      setConcerns(listData);
      setStats(statsData);

      // If a modal is open, refresh its data
      if (selectedConcern) {
        const refreshed = listData.find((c: ConcernSubmission) => c.id === selectedConcern.id);
        if (refreshed) setSelectedConcern(refreshed);
      }
    } catch (err: any) {
      console.error('Failed to load concerns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConcerns();
    loadSheetsConfig();
  }, [statusFilter, categoryFilter]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadConcerns();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate QR Code when QR modal opens or domain changes
  useEffect(() => {
    const targetUrl = getConcernPageUrl(customDomainInput);
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR data URL:', err));

    QRCode.toString(targetUrl, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'H'
    })
      .then((svg) => setQrSvgString(svg))
      .catch((err) => console.error('Failed to generate QR SVG:', err));
  }, [customDomainInput, qrModalOpen]);

  // Open Concern Details
  const handleOpenConcern = (concern: ConcernSubmission) => {
    setSelectedConcern(concern);
    setStatusDraft(concern.status);
    setResolutionDraft(concern.resolutionDetails || '');
    setAssignedStaffInput(concern.assignedStaffName || '');
    setNewNote('');
  };

  // Update Status & Resolution
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConcern) return;

    setIsSavingStatus(true);
    try {
      const updated = await api.updateConcernStatus(
        selectedConcern.id,
        statusDraft,
        resolutionDraft.trim() || undefined
      );
      setSelectedConcern(updated);
      await loadConcerns();
    } catch (err: any) {
      alert(err?.message || 'Failed to update status.');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Assign Staff
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConcern) return;

    setIsSavingAssignment(true);
    try {
      const updated = await api.assignConcern(
        selectedConcern.id,
        assignedStaffInput.trim() ? `staff-${Date.now()}` : '',
        assignedStaffInput.trim()
      );
      setSelectedConcern(updated);
      await loadConcerns();
    } catch (err: any) {
      alert(err?.message || 'Failed to update assignment.');
    } finally {
      setIsSavingAssignment(false);
    }
  };

  // Add Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConcern || !newNote.trim()) return;

    setIsSavingNote(true);
    try {
      await api.addConcernNote(selectedConcern.id, newNote.trim());
      setNewNote('');
      // Reload this concern
      const fresh = await api.getAdminConcernDetail(selectedConcern.id);
      setSelectedConcern(fresh);
      await loadConcerns();
    } catch (err: any) {
      alert(err?.message || 'Failed to post note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRefId(true);
    setTimeout(() => setCopiedRefId(false), 2000);
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'Xing-Fitness-Feedback-QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadQrSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Xing-Fitness-Feedback-QR.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSheetsConfig = async () => {
    try {
      const config = await api.getGoogleSheetsStatus();
      setSheetsConfig(config);
    } catch (err) {
      console.error('Failed to load Google Sheets config:', err);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const res = await api.testGoogleSheetsConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ ok: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleManualSyncConcern = async (concernId: string) => {
    setIsSyncingConcern(true);
    try {
      const updated = await api.syncConcernToSheets(concernId);
      setSelectedConcern(updated);
      await loadConcerns();
      alert('Successfully synced this concern to Google Sheets!');
    } catch (err: any) {
      alert(err?.message || 'Failed to sync to Google Sheets.');
    } finally {
      setIsSyncingConcern(false);
    }
  };

  const handlePrintPlacard = () => {
    window.print();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Equipment or maintenance':
        return Dumbbell;
      case 'Cleanliness and hygiene':
        return Sparkles;
      case 'Trainer or coaching':
        return UserCheck;
      case 'Staff behaviour':
        return Users;
      case 'Membership or billing':
        return CreditCard;
      case 'Group classes':
        return CalendarDays;
      case 'Safety concern':
        return ShieldAlert;
      case 'Suggestion':
        return Lightbulb;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
              Confidential Line
            </span>
            <span className="text-xs text-zinc-500 font-mono">Unlisted Endpoint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display tracking-tight mt-1">
            Member Concern & Feedback System
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Direct management channel submissions from in-club QR codes and private portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              loadSheetsConfig();
              setSheetsModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1A1D24] hover:bg-[#222630] border border-emerald-500/30 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Google Sheets Integration</span>
            <span className="sm:hidden">Sheets</span>
            {sheetsConfig?.isConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
            )}
          </button>

          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#c59f2e] hover:to-amber-600 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>QR Code</span>
          </button>

          <button
            onClick={loadConcerns}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12141A] border border-white/10 relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Total Submissions
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">
            {stats?.total ?? 0}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">All recorded feedback</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#12141A] border border-red-500/20 relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center justify-between">
            <span>New Unreviewed</span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 mt-1 font-display">
            {stats?.newCount ?? 0}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Requires supervisor review</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#12141A] border border-amber-500/20 relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            In Progress
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-display">
            {stats?.inProgressCount ?? 0}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Assigned / Under action</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#12141A] border border-emerald-500/20 relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Resolved & Closed
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-display">
            {(stats?.resolvedCount ?? 0) + (stats?.closedCount ?? 0)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Addressed with audit notes</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#12141A] border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Reference ID (e.g. XF-CON), member name, subject, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-semibold whitespace-nowrap">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#1A1D24] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Categories ({CATEGORIES.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
          <span className="text-xs text-zinc-500 mr-1 font-semibold">Status:</span>
          {['all', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-black shadow-md shadow-[#D4AF37]/10'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {st === 'all' ? 'All Statuses' : st.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Concerns Table / List */}
      <div className="bg-[#12141A] border border-white/10 rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="uppercase tracking-widest font-semibold">Loading Member Submissions...</p>
          </div>
        ) : concerns.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-white">No concerns found matching current filters.</p>
            <p className="text-xs text-zinc-500">
              When members submit feedback via QR code or direct link, it will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {concerns.map((concern) => {
              const statusCfg = STATUS_CONFIG[concern.status] || STATUS_CONFIG.NEW;
              const CategoryIcon = getCategoryIcon(concern.category);
              const formattedDate = new Date(concern.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={concern.id}
                  onClick={() => handleOpenConcern(concern)}
                  className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Category & Reference */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#D4AF37] tracking-wider bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-lg border border-[#D4AF37]/20">
                        {concern.referenceId}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider flex items-center gap-1 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        {statusCfg.label}
                      </span>

                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <CategoryIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{concern.category}</span>
                      </span>

                      {concern.isAnonymous ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-zinc-400 border border-white/10 uppercase">
                          Anonymous
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-300 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3 text-zinc-500" />
                          <span>{concern.name || 'Member (Contact Provided)'}</span>
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <h3 className="text-sm font-bold text-white tracking-wide truncate">
                      {concern.subject}
                    </h3>

                    {/* Description Snippet */}
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {concern.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <span>{formattedDate}</span>
                      </span>
                      {concern.gymLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-600" />
                          <span>{concern.gymLocation}</span>
                        </span>
                      )}
                      {concern.assignedStaffName && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Assigned: {concern.assignedStaffName}</span>
                        </span>
                      )}
                      {concern.googleSheetsSyncStatus === 'SYNCED' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <FileSpreadsheet className="w-3 h-3" />
                          <span>In Google Sheets</span>
                        </span>
                      ) : concern.googleSheetsSyncStatus === 'FAILED' ? (
                        <span className="text-red-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Sheets Failed</span>
                        </span>
                      ) : null}
                      {concern.internalNotes && concern.internalNotes.length > 0 && (
                        <span className="text-[#D4AF37] flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{concern.internalNotes.length} Note{concern.internalNotes.length > 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Quick Action */}
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenConcern(concern);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Review Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DETAIL & MANAGEMENT MODAL / DRAWER                        */}
      {/* ========================================================= */}
      {selectedConcern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12141A] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  {React.createElement(getCategoryIcon(selectedConcern.category), { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#D4AF37]">
                      {selectedConcern.referenceId}
                    </span>
                    <button
                      onClick={() => handleCopyReference(selectedConcern.referenceId)}
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Copy Reference ID"
                    >
                      {copiedRefId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold block">
                    {selectedConcern.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleManualSyncConcern(selectedConcern.id)}
                  disabled={isSyncingConcern}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Push/Update to Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSyncingConcern ? 'Syncing...' : 'Sync to Sheets'}</span>
                </button>

                <button
                  onClick={() => setSelectedConcern(null)}
                  className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Submission Information */}
              <div className="space-y-3 bg-[#1A1D24] p-4 sm:p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Concern Subject
                  </span>
                  <span className="text-xs text-zinc-500">
                    Logged: {new Date(selectedConcern.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedConcern.subject}</h2>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                    Detailed Member Statement
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap bg-black/30 p-3.5 rounded-xl border border-white/5">
                    {selectedConcern.description}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-zinc-400">
                  {selectedConcern.incidentDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Incident Date: <strong className="text-white">{selectedConcern.incidentDate}</strong></span>
                    </div>
                  )}
                  {selectedConcern.gymLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Zone: <strong className="text-white">{selectedConcern.gymLocation}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submitter & Contact Section */}
              <div className="bg-[#1A1D24] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Submitter Details & Privacy
                </span>

                {selectedConcern.isAnonymous ? (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-xs text-zinc-300">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span>Submitted <strong>Anonymously</strong>. No personal contact details provided.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-[10px] text-zinc-500 uppercase block">Name</span>
                        <span className="font-bold text-white">{selectedConcern.name || 'Not provided'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-[10px] text-zinc-500 uppercase block">Contact</span>
                        <span className="font-bold text-white truncate block">{selectedConcern.contactInfo || 'Not provided'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-[10px] text-zinc-500 uppercase block">Preferred Follow-Up</span>
                        <span className="font-bold text-[#D4AF37]">{selectedConcern.preferredContactMethod || 'None specified'}</span>
                      </div>
                    </div>

                    {/* Quick Contact Actions if phone/email provided */}
                    {selectedConcern.contactInfo && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`tel:${selectedConcern.contactInfo.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>Call Member</span>
                        </a>
                        <a
                          href={`https://wa.me/${selectedConcern.contactInfo.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/20"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Message on WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Google Sheets Synchronization Card */}
              <div className="bg-[#1A1D24] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Sheets Synchronization</span>
                  </span>
                  {selectedConcern.googleSheetsSyncStatus === 'SYNCED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Synced to Google Sheets
                    </span>
                  ) : selectedConcern.googleSheetsSyncStatus === 'FAILED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Sync Failed (Pending Retry)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Stored Locally (Not Synced)
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    {selectedConcern.googleSheetsSyncStatus === 'SYNCED' ? (
                      <p className="text-zinc-300">
                        Recorded in spreadsheet tab <strong className="text-white">"Member Concerns"</strong> on{' '}
                        <span className="text-emerald-400 font-semibold">
                          {selectedConcern.googleSheetsSyncedAt ? new Date(selectedConcern.googleSheetsSyncedAt).toLocaleString() : 'Recent'}
                        </span>.
                      </p>
                    ) : selectedConcern.googleSheetsSyncStatus === 'FAILED' ? (
                      <p className="text-red-400">
                        Write error: {selectedConcern.googleSheetsError || 'Google Sheets endpoint unavailable.'}
                      </p>
                    ) : (
                      <p className="text-zinc-400">
                        This submission is saved safely in the local database. Connect your Google Apps Script Webhook to push rows to Google Sheets.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleManualSyncConcern(selectedConcern.id)}
                    disabled={isSyncingConcern}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSyncingConcern ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedConcern.googleSheetsSyncStatus === 'SYNCED' ? 'Re-Sync Row' : 'Sync to Sheets Now'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status & Assignment Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Update Form */}
                <form onSubmit={handleSaveStatus} className="bg-[#1A1D24] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                    Update Status & Resolution
                  </span>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300">Status</label>
                    <select
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value as ConcernStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="NEW">NEW (Unreviewed)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (Investigating)</option>
                      <option value="RESOLVED">RESOLVED (Action Completed)</option>
                      <option value="CLOSED">CLOSED (Archived)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300">Resolution Details (Optional)</label>
                    <textarea
                      rows={2}
                      value={resolutionDraft}
                      onChange={(e) => setResolutionDraft(e.target.value)}
                      placeholder="e.g. Technician serviced cable machine, member contacted and satisfied."
                      className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {selectedConcern.resolvedAt && (
                    <p className="text-[11px] text-emerald-400">
                      Resolved on {new Date(selectedConcern.resolvedAt).toLocaleDateString()} by {selectedConcern.resolvedBy}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingStatus}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingStatus ? 'Updating Status...' : 'Apply Status Change'}
                  </button>
                </form>

                {/* Staff Assignment Form */}
                <form onSubmit={handleSaveAssignment} className="bg-[#1A1D24] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                      Assign Responsible Staff
                    </span>

                    <div className="space-y-1.5 mt-3">
                      <label className="text-xs text-zinc-300">Responsible Person</label>
                      <input
                        type="text"
                        value={assignedStaffInput}
                        onChange={(e) => setAssignedStaffInput(e.target.value)}
                        placeholder="e.g. Coach David, Desk Mgr Ritu, Floor Supv"
                        className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <p className="text-[11px] text-zinc-500">
                        Assigns accountability for follow-up and equipment fixes.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingAssignment}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingAssignment ? 'Saving Assignment...' : 'Save Assignment'}
                  </button>
                </form>
              </div>

              {/* Private Internal Notes Timeline */}
              <div className="bg-[#1A1D24] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Private Management Notes & Audit Trail
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Not visible to members
                  </span>
                </div>

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedConcern.internalNotes && selectedConcern.internalNotes.length > 0 ? (
                    selectedConcern.internalNotes.map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            {note.authorName} ({note.authorRole})
                          </span>
                          <span>{new Date(note.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{note.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 italic p-2">No internal management notes added yet.</p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note or update for staff..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    disabled={isSavingNote || !newNote.trim()}
                    className="py-2 px-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c29e2f] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={() => setSelectedConcern(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* QR CODE & PRINTABLE PLACARD MODAL                         */}
      {/* ========================================================= */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12141A] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black font-black">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase text-white font-display">
                    Member Feedback QR Code
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    High contrast, print-ready QR code for gym floor and reception
                  </p>
                </div>
              </div>

              <button
                onClick={() => setQrModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Domain Configuration Check */}
              <div className="p-4 rounded-2xl bg-[#1A1D24] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="custom-domain-input" className="text-xs font-bold uppercase text-zinc-300">
                    Production Destination Domain
                  </label>
                  <button
                    onClick={() => setCustomDomainInput(getProductionBaseUrl())}
                    className="text-[10px] text-[#D4AF37] hover:underline"
                  >
                    Reset to Official ({getProductionBaseUrl()})
                  </button>
                </div>
                <input
                  id="custom-domain-input"
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  placeholder="https://www.xingfitness.in"
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>
                    Encoded URL: <strong className="text-white font-mono">{getConcernPageUrl(customDomainInput)}</strong>
                  </span>
                </div>
              </div>

              {/* Printable Placard Preview Container */}
              <div
                ref={printAreaRef}
                id="printable-placard"
                className="bg-white text-black p-8 sm:p-10 rounded-2xl text-center space-y-6 shadow-xl border-4 border-[#090A0D]"
              >
                {/* Brand Header */}
                <div className="space-y-1">
                  <div className="inline-block px-3 py-1 bg-black text-[#D4AF37] font-black text-xs uppercase tracking-widest rounded-md mb-1">
                    XING FITNESS
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-display">
                    SHARE YOUR CONCERN
                  </h3>
                  <p className="text-sm font-bold text-zinc-800 uppercase tracking-wide">
                    Scan the QR code to share feedback directly with gym management.
                  </p>
                </div>

                {/* The QR Code Canvas/Image */}
                <div className="flex justify-center p-3">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Xing Fitness Member Feedback QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-black rounded-xl p-2 bg-white"
                    />
                  ) : (
                    <div className="w-56 h-56 bg-zinc-200 animate-pulse rounded-xl" />
                  )}
                </div>

                {/* Placard Footer Instructions */}
                <div className="space-y-1.5 text-xs text-zinc-700 max-w-sm mx-auto leading-relaxed border-t border-zinc-200 pt-4">
                  <p className="font-bold text-black uppercase tracking-wider text-[11px]">
                    Direct • Discreet • Fast Resolution
                  </p>
                  <p>
                    Point your mobile camera to open our unlisted management feedback portal. Anonymous submission supported.
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono pt-1">
                    Brookefield, AECS Layout • xingfitness.in
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <a
                href={getConcernPageUrl(customDomainInput)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Test Link Directly</span>
              </a>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleDownloadQrSvg}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download vector SVG"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>SVG</span>
                </button>
                <button
                  onClick={handleDownloadQrPng}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download raster PNG"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={handlePrintPlacard}
                  className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c29e2f] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#D4AF37]/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4 stroke-[2.5]" />
                  <span>Print Placard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* GOOGLE SHEETS INTEGRATION & SETUP MODAL                   */}
      {/* ========================================================= */}
      {sheetsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12141A] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase text-white font-display">
                    Google Sheets Automatic Integration
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    Target Spreadsheet: <strong>Xing Fitness Member Concerns</strong> (Tab: <em>Member Concerns</em>)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSheetsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Connection Status Card */}
              <div className="p-4 rounded-2xl bg-[#1A1D24] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Integration Status
                  </span>
                  {sheetsConfig?.isConfigured ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Connected to Web App
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Webhook URL Not Configured
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Active Webhook URL</span>
                    <span className="font-mono text-zinc-200 truncate block mt-0.5">
                      {sheetsConfig?.maskedUrl || 'Not configured'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Spreadsheet Tab Name</span>
                    <span className="font-bold text-white block mt-0.5">Member Concerns</span>
                  </div>
                </div>

                {/* Connection Test Action */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isTestingConnection ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testing Connection...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Test Connection Now</span>
                      </>
                    )}
                  </button>

                  {testResult && (
                    <span
                      className={`font-semibold flex items-center gap-1.5 ${
                        testResult.ok ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {testResult.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{testResult.message}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 13 Configured Columns */}
              <div className="p-4 rounded-2xl bg-[#1A1D24] border border-white/10 space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Configured 13 Google Sheet Columns (Asia/Kolkata Display)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  {[
                    '1. Reference ID',
                    '2. Submitted At',
                    '3. Category',
                    '4. Subject',
                    '5. Description',
                    '6. Incident Date',
                    '7. Gym Location',
                    '8. Member Name',
                    '9. Phone',
                    '10. Email',
                    '11. Anonymous',
                    '12. Status',
                    '13. Internal Notes'
                  ].map((col) => (
                    <div key={col} className="p-2 rounded-lg bg-black/30 border border-white/5 text-zinc-300">
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Deployment Guide */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 leading-relaxed">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                  Quick Deployment Guide (Google Apps Script)
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-300">
                  <li>Create a new Google Sheet named: <strong>Xing Fitness Member Concerns</strong>.</li>
                  <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Copy and paste the code from <code className="text-[#D4AF37] bg-black/40 px-1 py-0.5 rounded">google-apps-script/Code.gs</code>.</li>
                  <li>Click <strong>Deploy &gt; New deployment &gt; Web app</strong>.</li>
                  <li>Select <em>Execute as: Me</em> and <em>Who has access: Anyone</em>.</li>
                  <li>Copy the Web App URL and add it to your server environment:
                    <div className="p-2 mt-1 rounded bg-black/60 font-mono text-[11px] text-zinc-300 select-all">
                      GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={() => setSheetsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
