import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WelcomeCelebrationProps {
  show: boolean
  userName?: string
  onComplete: () => void
}

export default function WelcomeCelebration({ show, userName, onComplete }: WelcomeCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  useEffect(() => {
    if (show) {
      // Créer des particules de confetti
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#ff6b35', '#ff8c42', '#ffa600', '#ff4820', '#d62828'][Math.floor(Math.random() * 5)]
      }))
      setParticles(newParticles)

      // Masquer après 3 secondes
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none bg-black/20 backdrop-blur-sm"
      >
        {/* Message de bienvenue */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white mb-2 drop-shadow-lg"
          >
            Bienvenue {userName || 'chez BrazzaFlame'} !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-white/90 drop-shadow-lg"
          >
            Préparez-vous à découvrir des saveurs extraordinaires 🔥
          </motion.p>
        </motion.div>

        {/* Particules de confetti */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              rotate: 0,
              scale: 0
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: 360,
              scale: [0, 1, 0.8, 1, 0]
            }}
            transition={{
              duration: 3,
              ease: "easeOut",
              delay: Math.random() * 0.5
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}40`
            }}
          />
        ))}

        {/* Étoiles scintillantes */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute text-yellow-400 text-2xl"
          >
            ⭐
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}