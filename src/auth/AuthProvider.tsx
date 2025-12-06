import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '@/lib/supabase';
import { AuthSession as SessionType, UserProfile } from '@/types/auth';
import { SubscriptionState } from '@/types/subscription';
import * as SecureStore from 'expo-secure-store';
import Purchases from 'react-native-purchases';

type OAuthProvider = 'google' | 'facebook';

type AuthContextValue = {
  session?: SessionType;
  profile?: UserProfile;
  subscription: SubscriptionState;
  setSubscription: (s: SubscriptionState) => void;
  signInWithEmailMagicLink: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionType | undefined>();
  const [profile, setProfile] = useState<UserProfile | undefined>();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isSubscribed: false,
    trialActive: false,
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, current) => {
      if (current) {
        const next = {
          accessToken: current.access_token ?? '',
          refreshToken: current.refresh_token ?? undefined,
          userId: current.user?.id ?? '',
          email: current.user?.email ?? undefined,
        };
        setSession(next);
        (async () => {
          try {
            if (next.accessToken)
              await SecureStore.setItemAsync('sb_access_token', next.accessToken);
            if (next.refreshToken)
              await SecureStore.setItemAsync('sb_refresh_token', next.refreshToken);
          } catch {}
        })();
        setProfile({
          id: current.user?.id ?? '',
          name: current.user?.user_metadata?.name,
          email: current.user?.email ?? undefined,
          avatarUrl: current.user?.user_metadata?.avatar_url,
        });
      } else {
        setSession(undefined);
        setProfile(undefined);
        (async () => {
          try {
            await SecureStore.deleteItemAsync('sb_access_token');
            await SecureStore.deleteItemAsync('sb_refresh_token');
          } catch {}
        })();
      }
    });
    (async () => {
      const { data: current } = await supabase.auth.getSession();
      const s = current?.session;
      if (s) {
        const next = {
          accessToken: s.access_token ?? '',
          refreshToken: s.refresh_token ?? undefined,
          userId: s.user?.id ?? '',
          email: s.user?.email ?? undefined,
        };
        setSession(next);
        (async () => {
          try {
            if (next.accessToken)
              await SecureStore.setItemAsync('sb_access_token', next.accessToken);
            if (next.refreshToken)
              await SecureStore.setItemAsync('sb_refresh_token', next.refreshToken);
          } catch {}
        })();
        setProfile({
          id: s.user?.id ?? '',
          name: s.user?.user_metadata?.name,
          email: s.user?.email ?? undefined,
          avatarUrl: s.user?.user_metadata?.avatar_url,
        });
      }
      setInitialized(true);
    })();
    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sync = async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        const hasActive = Object.keys(info.entitlements.active).length > 0;
        setSubscription({ isSubscribed: hasActive, trialActive: false });
      } catch {}
    };
    sync();
    const listener = (info: Awaited<ReturnType<typeof Purchases.getCustomerInfo>>) => {
      const hasActive = Object.keys(info.entitlements.active).length > 0;
      setSubscription({ isSubscribed: hasActive, trialActive: false });
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [initialized]);

  const signInWithEmailMagicLink = async (email: string) => {
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    await supabase.auth.verifyOtp({ type: 'email', email, token });
  };

  const signInWithOAuth = async (provider: OAuthProvider) => {
    const redirectUrl = AuthSession.makeRedirectUri();
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: redirectUrl } });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription({ isSubscribed: false, trialActive: false });
    try {
      await SecureStore.deleteItemAsync('sb_access_token');
      await SecureStore.deleteItemAsync('sb_refresh_token');
    } catch {}
  };

  const value = useMemo(
    () => ({
      session,
      profile,
      subscription,
      setSubscription,
      signInWithEmailMagicLink,
      verifyEmailOtp,
      signInWithOAuth,
      signOut,
      initialized,
    }),
    [session, profile, subscription, initialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
