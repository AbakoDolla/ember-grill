import React, { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getInitialSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Créer le profil si c'est un nouvel utilisateur
        if (event === 'SIGNED_UP' && session?.user) {
          await createProfile(session.user)
        }

        // Notification de bienvenue pour les nouvelles connexions
        if (event === 'SIGNED_IN' && session?.user) {
          // Vérifier si c'est la première connexion récente (moins de 5 minutes)
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

  const createProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.name || '',
            last_name: '',
            role: 'customer'
          }
        ])

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error creating profile:', error)
      }
    } catch (error) {
      console.error('Error in createProfile:', error)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Une erreur inattendue s\'est produite' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Une erreur inattendue s\'est produite' }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    showWelcome,
    setShowWelcome,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}