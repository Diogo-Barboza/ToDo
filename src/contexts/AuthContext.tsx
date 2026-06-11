import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../services/storage/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
  }

  const signUpWithEmail = async (email: string, password: string) => {
    setError(null)
    const { error: err } = await supabase.auth.signUp({ email, password })
    if (err) setError(err.message)
  }

  const signInWithGoogle = async () => {
    setError(null)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + import.meta.env.BASE_URL,
      },
    })
    if (err) setError(err.message)
  }

  const signOut = async () => {
    setError(null)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
