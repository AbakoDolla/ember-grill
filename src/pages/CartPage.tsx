import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import Footer from '@/components/Footer';
import DeliveryDatePicker from '@/components/DeliveryDatePicker';
import PayPalPayment from '@/components/PayPalPaymentSimple';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, CreditCard, User, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import supabase from '@/lib/supabase';

// Lazy load Stripe to prevent blocking
let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};


export default function CartPage() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, processPayment } = useOrders();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const deliveryFee = total > 50 ? 0 : 4.99;
  const grandTotal = total + deliveryFee;

const handleCheckout = async () => {
  // Validation
  if (!selectedDate || !selectedTime) {
    toast.error('Veuillez sélectionner une date et une heure de livraison');
    return;
  }

  if (!user && (!customerInfo.email || !customerInfo.firstName || 
      !customerInfo.lastName || !customerInfo.phone || !customerInfo.address)) {
    toast.error('Veuillez remplir toutes les informations de livraison');
    return;
  }

  setIsProcessing(true);
  
  try {
    // Prepare customer info
    const orderCustomer = user ? {
      email: user.email || '',
      firstName: (user as any).firstName || customerInfo.firstName,
      lastName: (user as any).lastName || customerInfo.lastName,
      phone: (user as any).phone || customerInfo.phone
    } : customerInfo;

    // Prepare order data
    const orderData = {
      user_id: user?.id || null,
      total_amount: grandTotal,
      delivery_fee: deliveryFee,
      status: 'pending',
      payment_status: 'pending',
      delivery_address: user?.address || customerInfo.address,
      requested_delivery_date: selectedDate.toISOString().split('T')[0],
      estimated_delivery_time: `${selectedDate.toISOString().split('T')[0]} ${selectedTime}`,
      special_instructions: specialInstructions,
      payment_method: 'card',
    };

    // Send everything to Edge Function - let it create the order
    const { data: sessionData, error: sessionError } = await supabase.functions
      .invoke('create-checkout-session', {
        body: {
          items: items,
          orderData: orderData,
          customerEmail: orderCustomer.email,
          successUrl: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }
      });

    if (sessionError) throw sessionError;

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error("Stripe n'a pas pu se charger");
    }

    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId: sessionData.sessionId
    });

    if (redirectError) throw redirectError;

  } catch (error) {
    console.error('Checkout error:', error);
    toast.error('Erreur lors du traitement: ' + (error as any).message);
    setIsProcessing(false);
  }
};

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24"
          >
            <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t('cart.empty')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('cart.emptyDescription')}
            </p>
            <Link to="/menu">
              <Button variant="hero" size="lg">
                {t('cart.browseMenu')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          {t('cart.title')} <span className="text-fire">{t('common.cart')}</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="glass" className="p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-lg">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Delivery Date Picker */}
            <DeliveryDatePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
            />
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="fire" className="p-6 sticky top-28">
              <h2 className="font-display font-bold text-xl mb-6">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.subtotal')}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.deliveryFee')}</span>
                  <span>{deliveryFee === 0 ? t('cart.freeDelivery') : `€${deliveryFee.toFixed(2)}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-fresh text-sm">
                    {t('cart.addForFreeDelivery', { amount: (50 - total).toFixed(2) })}
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-display font-bold text-xl">
                    <span>{t('cart.total')}</span>
                    <span className="text-primary">€{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Informations client */}
              {!user && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informations de livraison
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+33 6 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse de livraison</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions spéciales (optionnel)</Label>
                    <Input
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Sonnette cassée, etc."
                    />
                  </div>
                </div>
              )}

              {/* Méthode de paiement */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Méthode de paiement
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="h-12"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payement Stripe
                  </Button>
                </div>
              </div>

              {/* Cart Payment Button */}
              {paymentMethod === 'card' && (
                <Button
                  variant="hero"
                  className="w-full"
                  size="lg"
                  disabled={!selectedDate || !selectedTime || isProcessing}
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isProcessing ? 'Traitement...' : 'Confirmer la commande et payer'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}

              <p className="text-muted-foreground text-sm text-center mt-4">
                {paymentMethod === 'paypal' ? 'Paiement sécurisé via PayPal' : 'Paiement sécurisé •'} Livraison {selectedDate ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' }) : 'le week-end'}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
