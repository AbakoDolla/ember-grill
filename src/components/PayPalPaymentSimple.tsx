import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import { createMockPayPalOrder, captureMockPayPalOrder } from '@/lib/paypal';

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function PayPalPayment({
  amount,
  onSuccess,
  onError,
  onCancel,
  disabled = false
}: PayPalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simuler la création de commande PayPal
      toast.info('Création de la commande PayPal...');
      const order = await createMockPayPalOrder({
        amount: amount.toFixed(2),
        currency: 'EUR'
      });

      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simuler la validation du paiement
      toast.info('Validation du paiement...');
      const orderData = await captureMockPayPalOrder(order.id);

      toast.success('Paiement PayPal traité avec succès !');
      onSuccess(orderData);
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error('Une erreur est survenue avec PayPal');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (disabled) {
    return (
      <Card variant="glass" className="p-6 opacity-50">
        <div className="text-center text-muted-foreground">
          <CreditCard className="w-12 h-12 mx-auto mb-4" />
          <p>Veuillez remplir toutes les informations avant de payer</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display font-bold text-lg mb-2">Paiement PayPal</h3>
          <p className="text-muted-foreground text-sm">
            Simulation de paiement PayPal (mode développement)
          </p>
        </div>

        {isProcessing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Traitement du paiement...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="default"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              onClick={handlePayment}
              disabled={disabled || isProcessing}
            >
              <div className="w-4 h-4 mr-2 bg-white rounded-sm" />
              Payer avec PayPal - €{amount.toFixed(2)}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                En développement, ceci simule un paiement PayPal.
              </p>
              <p className="text-xs text-muted-foreground">
                En production, le vrai bouton PayPal apparaîtra.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
