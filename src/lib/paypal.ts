// API endpoints pour PayPal (à implémenter dans votre backend)

export interface PayPalOrderRequest {
  amount: string;
  currency: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

// Pour le développement, vous pouvez utiliser ces fonctions mockées
export const createMockPayPalOrder = async (data: PayPalOrderRequest): Promise<PayPalOrderResponse> => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: 'CREATED',
    links: [
      {
        href: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/' + Math.random().toString(36).substr(2, 9),
        rel: 'self',
        method: 'GET'
      }
    ]
  };
};

export const captureMockPayPalOrder = async (orderID: string): Promise<PayPalCaptureResponse> => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: orderID,
    status: 'COMPLETED',
    purchase_units: [
      {
        payments: {
          captures: [
            {
              id: `CAPTURE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              status: 'COMPLETED',
              amount: {
                currency_code: 'EUR',
                value: '0.00'
              }
            }
          ]
        }
      }
    ]
  };
};
