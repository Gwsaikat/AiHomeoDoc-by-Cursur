import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Debug flag - enable for development
const DEBUG = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Enhanced localStorage with logging
const enhancedStorage = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      const value = window.localStorage.getItem(key);
      if (DEBUG) {
        console.log(`[Supabase] Getting key ${key}: ${value ? 'Found' : 'Not found'}`);
      }
      return value;
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      if (DEBUG) {
        console.log(`[Supabase] Setting key ${key}`);
      }
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      if (DEBUG) {
        console.log(`[Supabase] Removing key ${key}`);
      }
      window.localStorage.removeItem(key);
    }
  },
};

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: enhancedStorage,
    debug: DEBUG,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});

// Helper method to double-check session state
export const getSessionOrRedirect = async () => {
  try {
    if (DEBUG) console.log('[Supabase] Checking session...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      if (DEBUG) console.error('[Supabase] Session error:', error.message);
      return { session: null, user: null, error };
    }
    
    if (!data.session) {
      if (DEBUG) console.log('[Supabase] No session found');
      return { session: null, user: null, error: null };
    }
    
    if (DEBUG) console.log('[Supabase] Session found for user:', data.session.user.id);
    return { 
      session: data.session, 
      user: data.session.user,
      error: null 
    };
  } catch (err) {
    if (DEBUG) console.error('[Supabase] Unexpected error checking session:', err);
    return { session: null, user: null, error: err };
  }
}; 