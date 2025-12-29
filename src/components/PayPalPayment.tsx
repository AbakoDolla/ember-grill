import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

export default function PayPalPayment({
  amount,
  onSuccess,
  onError,
  onCancel,
  disabled = false
}: PayPalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'EUR',
    intent: 'capture',
    'disable-funding': 'credit,card'
  };

  const handleCreateOrder = async () => {
    setIsProcessing(true);
    try {
      // En développement, utilisez le mock
      if (import.meta.env.DEV) {
        const order = await createMockPayPalOrder({
          amount: amount.toFixed(2),
          currency: 'EUR'
        });
        return order.id;
      }
      
      // En production, appelez votre API backend
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          currency: 'EUR'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande PayPal');
      }

      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Erreur lors de la création de la commande PayPal');
      onError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      // En développement, utilisez le mock
      if (import.meta.env.DEV) {
        const orderData = await captureMockPayPalOrder(data.orderID);
        toast.success('Paiement PayPal traité avec succès !');
        onSuccess(orderData);
        return;
      }
      
      // En production, appelez votre API backend
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la validation du paiement PayPal');
      }

      const orderData = await response.json();
      toast.success('Paiement PayPal traité avec succès !');
      onSuccess(orderData);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      toast.error('Erreur lors du traitement du paiement PayPal');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error('PayPal payment error:', error);
    setIsProcessing(false);
    toast.error('Une erreur est survenue avec PayPal');
    onError(error);
  };

  const handleCancel = () => {
    setIsProcessing(false);
    toast.info('Paiement PayPal annulé');
    onCancel();
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
    <PayPalScriptProvider options={paypalOptions}>
      <Card variant="glass" className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-display font-bold text-lg mb-2">Paiement PayPal</h3>
            <p className="text-muted-foreground text-sm">
              Paiement sécurisé via PayPal
            </p>
          </div>

          {isProcessing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Traitement du paiement...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay'
                }}
                disabled={disabled || isProcessing}
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onError={handleError}
                onCancel={handleCancel}
              />

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  En cliquant sur le bouton PayPal, vous serez redirigé vers la page de paiement sécurisée de PayPal.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </PayPalScriptProvider>
  );
}
