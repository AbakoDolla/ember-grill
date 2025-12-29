import { useState } from 'react';
import { createMockPayPalOrder, captureMockPayPalOrder, PayPalOrderRequest, PayPalOrderResponse, PayPalCaptureResponse } from '@/lib/paypal';

// Contexte de paiement PayPal
export interface PayPalContextType {
  createOrder: (data: PayPalOrderRequest) => Promise<PayPalOrderResponse>;
  captureOrder: (orderID: string) => Promise<PayPalCaptureResponse>;
  isProcessing: boolean;
  error: string | null;
}

export const usePayPal = (): PayPalContextType => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (data: PayPalOrderRequest): Promise<PayPalOrderResponse> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // En développement, utilisez le mock
      if (import.meta.env.DEV) {
        return await createMockPayPalOrder(data);
      }
      
      // En production, appelez votre API backend
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande PayPal');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const captureOrder = async (orderID: string): Promise<PayPalCaptureResponse> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // En développement, utilisez le mock
      if (import.meta.env.DEV) {
        return await captureMockPayPalOrder(orderID);
      }
      
      // En production, appelez votre API backend
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la validation du paiement PayPal');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createOrder,
    captureOrder,
    isProcessing,
    error,
  };
};
