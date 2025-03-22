"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useSession } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '../lib/supabase';
import { User } from '@clerk/nextjs/dist/types/server';
import { Session } from '@clerk/nextjs/dist/types/server';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  supabase: any; // Typed Supabase client
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  
  const isLoading = !isUserLoaded || !isSessionLoaded;

  useEffect(() => {
    if (!session) return;
    
    // Create a Supabase client that uses Clerk authentication
    const client = createClerkSupabaseClient(async () => {
      return session ? await session.getToken({ template: 'supabase' }) : null;
    });
    
    setSupabaseClient(client);
  }, [session]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      supabase: supabaseClient 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 