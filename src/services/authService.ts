import { supabase } from '../lib/supabase';

export const authService = {
  async sendVerificationCode(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // We want to allow user creation if it's their first time, so we don't set shouldCreateUser: false
        // unless the requirement is strict about existing users only.
        // Assuming we want to allow sign up as well:
        shouldCreateUser: true,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async verifyCode(email: string, code: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async resendCode(email: string) {
    // Resending is essentially the same as requesting a new OTP
    return this.sendVerificationCode(email);
  },
};
