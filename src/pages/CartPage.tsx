import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, total } = useCart();

  const deliveryFee = total > 50 ? 0 : 4.99;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
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
      <div className="max-w-6xl mx-auto px-4 md:px-8">
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

              <Button variant="hero" className="w-full" size="lg">
                {t('cart.checkout')}
                <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-muted-foreground text-sm text-center mt-4">
                Secure checkout powered by Stripe
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
