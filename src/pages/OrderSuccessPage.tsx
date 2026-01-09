import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart();
      setLoading(false);
    } else {
      // No session ID means they shouldn't be here
      navigate('/');
    }
  }, [searchParams, navigate, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="fire" className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-3xl md:text-4xl font-bold mb-4"
            >
              Commande confirmée ! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg mb-8"
            >
              Votre paiement a été traité avec succès. Nous préparons déjà votre commande avec amour ! 🔥
            </motion.p>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background/50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold mb-2">Que se passe-t-il maintenant ?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Vous recevrez un email de confirmation</li>
                    <li>👨‍🍳 Votre commande est en cours de préparation</li>
                    <li>🚗 Livraison prévue à l'heure demandée</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate('/orders')}
              >
                Voir ma commande
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/menu')}
              >
                Retour au menu
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}