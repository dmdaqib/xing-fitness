import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CreditCard, Check, AlertTriangle, ShieldCheck, Sparkles, Clock, RefreshCw } from 'lucide-react';


export const MemberMembershipPage: React.FC = () => {
  const [membership, setMembership] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [selectedRenewalPlan, setSelectedRenewalPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalMessage, setRenewalMessage] = useState<string | null>(null);
  const [renewalSuccess, setRenewalSuccess] = useState(false);

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setIsLoading(true);
      const [memData, plansData] = await Promise.all([
        api.getMembership(),
        api.getPublicPlans().catch(() => [])
      ]);
      setMembership(memData);
      setAvailablePlans(plansData);
      if (plansData.length > 0) {
        setSelectedRenewalPlan(memData?.planId || plansData[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewal = async () => {
    setIsRenewing(true);
    setRenewalMessage(null);
    try {
      const res = await api.requestRenewal(selectedRenewalPlan);
      setRenewalSuccess(true);
      setRenewalMessage(res.message);
      // Reload membership to reflect renewalRequested = true
      const freshMem = await api.getMembership();
      setMembership(freshMem);
    } catch (err: any) {
      setRenewalSuccess(false);
      setRenewalMessage(err?.message || 'Failed to submit renewal request.');
    } finally {
      setIsRenewing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">Loading Membership...</p>
      </div>
    );
  }

  const status = membership?.status || 'PENDING';
  const isExpiring = status === 'EXPIRING_SOON';
  const isExpired = status === 'EXPIRED';

  // Find plan details from public plans
  const currentPlanDetails = availablePlans.find((p) => p.id === membership?.planId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase text-white font-display">
          My Membership
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Review your current Xing Fitness membership, enrolled benefits, and renewal privileges.
        </p>
      </div>

      {/* EXPIRING / EXPIRED ALERTS */}
      {isExpiring && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-amber-300">
                MEMBERSHIP EXPIRING SOON
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Your plan expires in {membership.daysRemaining} days. Lock in your renewal to avoid disruption.
              </p>
            </div>
          </div>
          <a
            href="#renewal-section"
            className="px-6 py-3 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all"
          >
            RENEW MEMBERSHIP
          </a>
        </div>
      )}

      {isExpired && (
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-red-300">
                MEMBERSHIP EXPIRED
              </h3>
              <p className="text-xs text-red-200/80 mt-0.5">
                Your membership access has lapsed. Reactivate your membership to continue full gym access.
              </p>
            </div>
          </div>
          <a
            href="#renewal-section"
            className="px-6 py-3 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-wider hover:bg-red-400 transition-all"
          >
            RENEW NOW
          </a>
        </div>
      )}

      {/* Main Membership Card */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-[#D4AF37]">
                Official Xing Credential
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : status === 'EXPIRING_SOON'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {status.replace('_', ' ')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
              {membership?.planName || 'General Membership'}
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Brookefield Main Facility • Matrix Performance Floor & Group Studio
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <Clock className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">
                Time Remaining
              </span>
              <span className="text-2xl font-black text-white">
                {membership?.daysRemaining !== undefined ? `${membership.daysRemaining} Days` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Dates & Billing Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 text-xs">
          <div>
            <span className="text-[#A1A1AA] block uppercase tracking-wider text-[10px]">Start Date</span>
            <span className="font-bold text-white text-sm mt-0.5 block">{membership?.startDate || '—'}</span>
          </div>
          <div>
            <span className="text-[#A1A1AA] block uppercase tracking-wider text-[10px]">Expiry Date</span>
            <span className="font-bold text-white text-sm mt-0.5 block">{membership?.endDate || '—'}</span>
          </div>
          <div>
            <span className="text-[#A1A1AA] block uppercase tracking-wider text-[10px]">Payment Verification</span>
            <span className="font-bold text-[#D4AF37] text-sm mt-0.5 block">
              {membership?.paymentStatus === 'PAID_OFFLINE_VERIFIED'
                ? 'Verified at Desk'
                : 'Pending Verification'}
            </span>
          </div>
          <div>
            <span className="text-[#A1A1AA] block uppercase tracking-wider text-[10px]">Renewal Status</span>
            <span className="font-bold text-white text-sm mt-0.5 block">
              {membership?.renewalRequested ? (
                <span className="text-amber-400">Request Under Review</span>
              ) : (
                'Eligible for Renewal'
              )}
            </span>
          </div>
        </div>

        {/* Plan Benefits */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            Enrolled Plan Benefits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(currentPlanDetails?.benefits || [
              'Full access to main training floor and black Matrix machines',
              'Sprint turf and sled track conditioning zone',
              'Complimentary InBody biometric body composition scan',
              'Digital locker access and private shower suites',
              'Zumba, Yoga and functional group studio classes',
              'Complimentary Wi-Fi and secure on-site vehicle parking'
            ]).map((benefit: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RENEWAL WORKFLOW SECTION */}
      <div id="renewal-section" className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-white font-display">
              Membership Renewal Workflow
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Select your desired membership tier. Submitting this request alerts our concierge desk to lock in preferential member rates.
            </p>
          </div>
        </div>

        {renewalMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              renewalSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {renewalSuccess ? (
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <div>
              <p className="font-bold">{renewalSuccess ? 'Request Dispatched' : 'Request Notice'}</p>
              <p className="mt-0.5 text-white/80">{renewalMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          {availablePlans.map((plan) => {
            const isSelected = selectedRenewalPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedRenewalPlan(plan.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-[#D4AF37]">
                      {plan.durationMonths} Month Tier
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black uppercase text-white">{plan.name}</h4>
                  <div className="text-xs text-[#A1A1AA] mt-2">
                    {plan.priceDisplay || '[MEMBERSHIP PRICE]'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/60">
                  {plan.benefits?.length || 4} Enrolled Privileges
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[#A1A1AA]">
            <p className="font-semibold text-white">Direct Concierge Processing</p>
            <p>
              In accordance with Xing Fitness policy, no automatic online charges will be levied. Our front desk team will contact you to complete verification and renewal on-site.
            </p>
          </div>

          <button
            onClick={handleRenewal}
            disabled={isRenewing || membership?.renewalRequested}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 flex-shrink-0"
          >
            {isRenewing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            <span>
              {membership?.renewalRequested
                ? 'Renewal Enquiry Pending'
                : 'Submit Renewal Request'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
