import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Standard Supabase client (unauthenticated)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a Supabase client that uses Clerk authentication for client components
export const createClerkSupabaseClient = (getToken: () => Promise<string | null>) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await getToken();
        
        // Insert the Clerk Supabase token into the headers
        const headers = new Headers(options?.headers);
        if (clerkToken) {
          headers.set('Authorization', `Bearer ${clerkToken}`);
        }
        
        // Now call the default fetch
        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });
}; 