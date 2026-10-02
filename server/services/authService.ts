import { db } from '../db/store.ts';
import { hashPassword, verifyPassword, generateRandomToken, createSessionToken } from '../auth/crypto.ts';
import type { User, MemberProfile, AuthSession } from '../types.ts';


export const authService = {
  async register(input: {
    name: string;
    phone: string;
    email: string;
    password: string;
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    fitnessGoal?: string;
    emergencyContact?: string;
  }): Promise<AuthSession> {
    const cleanEmail = input.email.trim().toLowerCase();
    const cleanPhone = input.phone.replace(/[^0-9]/g, '');
    const cleanName = input.name.trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Name must be at least 2 characters.');
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }
    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (!input.password || input.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const currentDb = db.get();

    // Check email uniqueness
    const existing = currentDb.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const { hash, salt } = hashPassword(input.password);
    const nowIso = new Date().toISOString();

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      passwordHash: hash,
      salt: salt,
      role: 'MEMBER',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const newMemberProfile: MemberProfile = {
      id: `mem-${Date.now()}`,
      userId: newUser.id,
      membershipNumber: `XING-${Math.floor(1000 + Math.random() * 9000)}`,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      fitnessGoal: input.fitnessGoal || 'General Fitness',
      emergencyContact: input.emergencyContact,
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Welcome Notification
    currentDb.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      type: 'announcement',
      title: 'Welcome to Xing Fitness!',
      message: `Welcome, ${cleanName}. Your membership account has been established with Member ID ${newMemberProfile.membershipNumber}.`,
      read: false,
      link: '/member/dashboard',
      createdAt: nowIso
    });

    currentDb.users.push(newUser);
    currentDb.members.push(newMemberProfile);
    db.save(currentDb);

    // 7-day token expiry
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = createSessionToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email,
      exp
    });

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newMemberProfile.name,
        memberId: newMemberProfile.id
      }
    };
  },

  async login(input: { email: string; password: string }): Promise<AuthSession> {
    const cleanEmail = input.email.trim().toLowerCase();
    if (!cleanEmail || !input.password) {
      throw new Error('Please provide both email and password.');
    }

    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = verifyPassword(input.password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const member = currentDb.members.find((m) => m.userId === user.id);

    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = createSessionToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      exp
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: member?.name || (user.role === 'ADMIN' ? 'Gym Administrator' : 'Staff Concierge'),
        memberId: member?.id
      }
    };
  },

  async forgotPassword(email: string): Promise<{ message: string; devResetToken?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Do not reveal email existence for security
      return { message: 'If an account exists with this email, a password reset link has been dispatched.' };
    }

    const token = generateRandomToken(24);
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    db.save(currentDb);

    return {
      message: 'If an account exists with this email, a password reset link has been dispatched.',
      devResetToken: token // Useful for local testing
    };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (!token) throw new Error('Reset token is required.');
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.resetToken === token);

    if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry).getTime() < Date.now()) {
      throw new Error('The password reset link is invalid or has expired.');
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.updatedAt = new Date().toISOString();

    db.save(currentDb);
    return { success: true, message: 'Password has been successfully reset. You can now login.' };
  },

  async getMe(userId: string): Promise<AuthSession['user'] | null> {
    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.id === userId);
    if (!user) return null;

    const member = currentDb.members.find((m) => m.userId === user.id);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: member?.name || (user.role === 'ADMIN' ? 'Gym Administrator' : 'Staff Concierge'),
      memberId: member?.id
    };
  }
};
