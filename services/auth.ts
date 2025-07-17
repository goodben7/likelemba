import { User } from '@/types';

class AuthService {
  private currentUser: User | null = null;

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    // Simulation d'envoi OTP
    console.log(`Sending OTP to ${phone}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Code OTP envoyé' });
      }, 1000);
    });
  }

  async verifyOTP(phone: string, code: string): Promise<{ success: boolean; user?: User }> {
    // Simulation de vérification OTP
    console.log(`Verifying OTP ${code} for ${phone}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === '1234') {
          const user: User = {
            id: 'user-1',
            name: 'Utilisateur Test',
            phone,
            createdAt: new Date().toISOString(),
          };
          this.currentUser = user;
          resolve({ success: true, user });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }
}

export const authService = new AuthService();