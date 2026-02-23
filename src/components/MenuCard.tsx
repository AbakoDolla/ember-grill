import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@/data/menu';
import { useCart } from '@/contexts/CartContext';
import { Plus, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  const { t } = useTranslation();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} ${t('cart.addedToCart')}`, {
      description: t('cart.readyWhenYouAre'),
    });
  };

  const spiceLevels = Array(3)
    .fill(0)
    .map((_, i) => i < item.spiceLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card variant="fire" className="group overflow-hidden h-full">
        {/* Image Container */}
        <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />
          
          {/* Actual Image */}
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Decorative food icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl xs:text-5xl sm:text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
              {item.category === 'fish' ? '🐟' : item.category === 'beef' ? '🥩' : item.category === 'braise' ? '🍗' : '🍚'}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 xs:top-3 left-2 xs:left-3 z-20 flex gap-1 xs:gap-2">
            {item.popular && (
              <span className="px-1.5 xs:px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-fire">
                {t('common.popular')}
              </span>
            )}
            {item.new && (
              <span className="px-1.5 xs:px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-lg shadow-gold">
                {t('common.new')}
              </span>
            )}
          </div>

          {/* Spice Level */}
          <div className="absolute top-2 xs:top-3 right-2 xs:right-3 z-20 flex gap-0.5">
            {spiceLevels.map((active, i) => (
              <Flame
                key={i}
                className={`w-3 h-3 xs:w-4 xs:h-4 ${
                  active ? 'text-primary' : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        <CardContent className="p-3 xs:p-4 sm:p-5">
          <h3 className="font-display font-bold text-base xs:text-lg sm:text-xl text-foreground mb-2 group-hover:text-fire transition-colors duration-300">
            {item.name}
          </h3>
          
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3 xs:mb-4">
            {item.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-lg xs:text-xl sm:text-2xl text-primary">
              €{item.price.toFixed(2)}
            </span>
            
            <Button
              variant="fire"
              size="sm"
              onClick={handleAddToCart}
              className="group/btn px-2 xs:px-3"
            >
              <Plus className="w-3 h-3 xs:w-4 xs:h-4" />
              <span className="hidden xs:inline ml-1">{t('common.addToCart')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
