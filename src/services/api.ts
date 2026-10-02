/**
 * Client-Side API Service for Xing Fitness Platform
 */

const TOKEN_KEY = 'xing_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'A network or server error occurred.');
  }

  return data.data;
}

export const api = {
  // Public
  getPublicPlans: () => request<any[]>('/api/public/plans'),
  getPublicOffers: () => request<any[]>('/api/public/offers'),
  submitLead: (leadData: any) =>
    request<any>('/api/public/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    }),

  // Auth
  register: (data: any) =>
    request<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  login: (data: { email: string; password: string }) =>
    request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getMe: () => request<any>('/api/auth/me'),
  forgotPassword: (email: string) =>
    request<{ message: string; devResetToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    }),

  // Member
  getMemberProfile: () => request<any>('/api/member/profile'),
  updateMemberProfile: (data: any) =>
    request<any>('/api/member/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getMembership: () => request<any>('/api/member/membership'),
  requestRenewal: (planId?: string) =>
    request<any>('/api/member/membership/renew', {
      method: 'POST',
      body: JSON.stringify({ planId })
    }),
  getAttendance: () => request<any>('/api/member/attendance'),
  checkIn: () =>
    request<any>('/api/member/attendance/check-in', {
      method: 'POST'
    }),
  getProgress: () => request<any[]>('/api/member/progress'),
  addProgress: (data: any) =>
    request<any>('/api/member/progress', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getWorkouts: () => request<any>('/api/member/workouts'),
  getBookings: () => request<any>('/api/member/bookings'),
  getNotifications: () => request<any>('/api/member/notifications'),
  markNotificationRead: (id: string) =>
    request<any>(`/api/member/notifications/${id}/read`, {
      method: 'POST'
    }),
  markAllNotificationsRead: () =>
    request<any>('/api/member/notifications/read-all', {
      method: 'POST'
    }),

  // Bookings
  getAvailableClasses: () => request<any[]>('/api/bookings/classes'),
  bookClass: (data: { classId: string; classDate: string; notes?: string }) =>
    request<any>('/api/bookings/class', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  cancelClassBooking: (bookingId: string) =>
    request<any>(`/api/bookings/class/${bookingId}/cancel`, {
      method: 'POST'
    }),
  getAvailableTrainers: () => request<any[]>('/api/bookings/trainers'),
  bookTrainer: (data: { trainerId: string; bookingDate: string; timeSlot: string; notes?: string }) =>
    request<any>('/api/bookings/trainer', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  cancelTrainerBooking: (bookingId: string) =>
    request<any>(`/api/bookings/trainer/${bookingId}/cancel`, {
      method: 'POST'
    }),

  // Admin
  getAdminDashboard: () => request<any>('/api/admin/dashboard'),
  getAdminMembers: (params?: { search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/api/admin/members${qs}`);
  },
  getAdminMemberDetail: (id: string) => request<any>(`/api/admin/members/${id}`),
  createMember: (data: any) =>
    request<any>('/api/admin/members', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateMember: (id: string, data: any) =>
    request<any>(`/api/admin/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  toggleMemberStatus: (id: string, active: boolean) =>
    request<any>(`/api/admin/members/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    }),
  getAdminLeads: (params?: { status?: string; source?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.source) query.append('source', params.source);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/api/admin/leads${qs}`);
  },
  updateLeadStatus: (id: string, status: string, notes?: string) =>
    request<any>(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    }),
  getAdminTrials: () => request<any[]>('/api/admin/trials'),
  getAdminBookings: () => request<any>('/api/admin/bookings'),
  updateClassBookingStatus: (id: string, status: string) =>
    request<any>(`/api/admin/bookings/class/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  updateTrainerBookingStatus: (id: string, status: string) =>
    request<any>(`/api/admin/bookings/trainer/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  getAdminPlans: () => request<any[]>('/api/admin/plans'),
  saveAdminPlan: (data: any) =>
    request<any>('/api/admin/plans', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  deleteAdminPlan: (id: string) =>
    request<any>(`/api/admin/plans/${id}`, {
      method: 'DELETE'
    }),
  getAdminTrainers: () => request<any[]>('/api/admin/trainers'),
  saveAdminTrainer: (data: any) =>
    request<any>('/api/admin/trainers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getAdminClasses: () => request<any[]>('/api/admin/classes'),
  saveAdminClass: (data: any) =>
    request<any>('/api/admin/classes', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getAdminOffers: () => request<any[]>('/api/admin/offers'),
  saveAdminOffer: (data: any) =>
    request<any>('/api/admin/offers', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
