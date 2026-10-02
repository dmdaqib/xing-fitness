import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Users,
  CreditCard,
  AlertTriangle,
  Target,
  Gift,
  CalendarCheck,
  UserCheck,
  ArrowRight
} from 'lucide-react';


export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const [dashStats, leads] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminLeads()
      ]);
      setStats(dashStats);
      setRecentLeads(leads.slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-red-500 rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Compiling Real-Time Facility Metrics...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Members',
      value: stats?.totalMembers || 0,
      subtext: `${stats?.activeMembers || 0} currently active on floor`,
      icon: Users,
      color: 'text-white',
      link: '/admin/members'
    },
    {
      title: 'Active Memberships',
      value: stats?.activeMemberships || 0,
      subtext: 'In good standing',
      icon: CreditCard,
      color: 'text-emerald-400',
      link: '/admin/members'
    },
    {
      title: 'Expiring Memberships',
      value: stats?.expiringMemberships || 0,
      subtext: 'Require concierge renewal outreach',
      icon: AlertTriangle,
      color: 'text-amber-400',
      link: '/admin/members'
    },
    {
      title: 'Expired Memberships',
      value: stats?.expiredMemberships || 0,
      subtext: 'Turnstile access suspended',
      icon: AlertTriangle,
      color: 'text-red-400',
      link: '/admin/members'
    },
    {
      title: 'New Enquiries',
      value: stats?.newLeads || 0,
      subtext: 'Pending staff response',
      icon: Target,
      color: 'text-[#D4AF37]',
      link: '/admin/leads'
    },
    {
      title: 'Free Trial Requests',
      value: stats?.freeTrialRequests || 0,
      subtext: 'Prospect visit requests',
      icon: Gift,
      color: 'text-[#D4AF37]',
      link: '/admin/trials'
    },
    {
      title: 'Active Class Bookings',
      value: stats?.upcomingClassBookings || 0,
      subtext: 'Studio reservations',
      icon: CalendarCheck,
      color: 'text-blue-400',
      link: '/admin/bookings'
    },
    {
      title: 'Pending PT Requests',
      value: stats?.pendingTrainerRequests || 0,
      subtext: '1-on-1 coaching requests',
      icon: UserCheck,
      color: 'text-purple-400',
      link: '/admin/bookings'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-white font-display">
            Facility Operations Dashboard
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Real-time management metrics from the Xing Fitness Brookefield database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/members"
            className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Manage Members
          </Link>
          <Link
            to="/admin/leads"
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all"
          >
            Review Enquiries
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-[#12141A] border border-white/10 rounded-3xl p-5 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-bold text-[#A1A1AA] tracking-wider">
                    {card.title}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/50 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className={`text-3xl font-black ${card.color} font-display`}>
                  {card.value}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A1A1AA]">
                <span>{card.subtext}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Leads & Enquiries Pipeline Preview */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black uppercase text-white font-display">
              Recent Inbound Enquiries & Leads
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Live prospective member submissions from the website and front desk.
            </p>
          </div>

          <Link
            to="/admin/leads"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>View All ({stats?.newLeads || 0} New)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A1A1AA]">
            No inbound leads registered in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A1A1AA] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Prospect</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Interest / Type</th>
                  <th className="pb-3 font-semibold">Received</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[#A1A1AA] text-[11px]">{lead.phone}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/80 font-semibold">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3.5 text-white/80">{lead.type}</td>
                    <td className="py-3.5 text-[#A1A1AA]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          lead.status === 'NEW'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : lead.status === 'CONTACTED'
                            ? 'bg-blue-500/10 text-blue-400'
                            : lead.status === 'JOINED'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/admin/leads"
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] font-bold text-[11px] transition-colors"
                      >
                        Follow Up
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catalog Quick Management Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-[#D4AF37]">Dynamic Plans</span>
            <CreditCard className="w-4 h-4 text-white/40" />
          </div>
          <div className="text-2xl font-black text-white font-display">4 Active Tiers</div>
          <p className="text-xs text-[#A1A1AA] mt-1 mb-4">
            Custom durations and perks configurable by Admin.
          </p>
          <Link
            to="/admin/plans"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>Manage Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-purple-400">Coaching Staff</span>
            <UserCheck className="w-4 h-4 text-white/40" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {stats?.totalTrainers || 3} Coaches
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 mb-4">
            Roster credentials, specialties, and slot availabilities.
          </p>
          <Link
            to="/admin/trainers"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>Manage Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-blue-400">Class Timetable</span>
            <CalendarCheck className="w-4 h-4 text-white/40" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {stats?.totalClasses || 4} Studio Classes
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 mb-4">
            Zumba, Yoga, and HIIT capacities and schedules.
          </p>
          <Link
            to="/admin/classes"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>Manage Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
