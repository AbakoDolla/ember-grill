import React, { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// ------------------------
// Typage de la table profiles
// ------------------------
type Profile = Database['public']['Tables']['profiles']['Insert']

// Typage du contexte d'authentification
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  showWelcome: boolean
  setShowWelcome: (show: boolean) => void
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

// ------------------------
// Création du contexte
// ------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

// ------------------------
// Props du provider
// ------------------------
interface AuthProviderProps {
  children: React.ReactNode
}

// ------------------------
// AuthProvider complet
// ------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) console.error('Error getting session:', error)
      else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }
    getInitialSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Création du profil pour les nouveaux inscrits
        if (event === 'SIGNED_UP' as any) {
          await createProfile(session!.user)
        }

        // Notification de bienvenue pour les nouvelles connexions
        if (event === 'SIGNED_IN' as any) {
          const lastSignIn = localStorage.getItem('lastWelcomeShown')
          const now = Date.now()
          if (!lastSignIn || now - parseInt(lastSignIn) > 5 * 60 * 1000) {
            setShowWelcome(true)
            localStorage.setItem('lastWelcomeShown', now.toString())
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ------------------------
  // Fonction pour créer un profil
  // ------------------------
  const createProfile = async (user: User) => {
    try {
      const newProfile: Profile = {
        id: user.id,
        email: user.email!,
        first_name: user.user_metadata?.name || '',
        last_name: '',
        role: 'customer'
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile] as any)

      if (error && error.code !== '23505') console.error('Error creating profile:', error)
      else if (!error) console.log('Profile created successfully:', data)
    } catch (err) {
      console.error('Unexpected error in createProfile:', err)
    }
  }

  // ------------------------
  // Fonction d'inscription
  // ------------------------
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'Une erreur inattendue s\'est produite' }
    }
  }

  // ------------------------
  // Fonction de connexion
  // ------------------------
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return {}
    } catch {
      return { error: 'Une erreur inattendue s\'est produite' }
    }
  }

  // ------------------------
  // Fonction de déconnexion
  // ------------------------
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  // ------------------------
  // Valeurs du contexte
  // ------------------------
  const value: AuthContextType = {
    user,
    session,
    loading,
    showWelcome,
    setShowWelcome,
    signUp,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
