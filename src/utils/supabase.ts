import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug flag - enable for development
const DEBUG = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';

// Mock client for server-side rendering when env vars are missing
const createMockClient = () => {
  if (DEBUG) {
    console.warn('[Supabase] Using mock client for SSR. This is expected during build.');
  }
  
  // Return a minimal mock that won't break during SSR
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    // Add other methods as needed
  };
};

// Create storage handler that's safe for SSR
const createStorage = () => {
  // Only use localStorage in the browser
  if (typeof window !== 'undefined') {
    return {
      getItem: (key: string) => {
        const value = window.localStorage.getItem(key);
        if (DEBUG) {
          console.log(`[Supabase] Getting key ${key}: ${value ? 'Found' : 'Not found'}`);
        }
        return value;
      },
      setItem: (key: string, value: string) => {
        if (DEBUG) {
          console.log(`[Supabase] Setting key ${key}`);
        }
        window.localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (DEBUG) {
          console.log(`[Supabase] Removing key ${key}`);
        }
        window.localStorage.removeItem(key);
      },
    };
  }
  
  // Provide no-op storage for SSR
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

// Create and export the Supabase client
export const supabase = ((!supabaseUrl || !supabaseAnonKey) && typeof window === 'undefined')
  ? createMockClient()
  : createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: createStorage(),
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
    
    // Only attempt to get session in the browser
    if (typeof window === 'undefined') {
      return { session: null, user: null, error: null };
    }
    
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