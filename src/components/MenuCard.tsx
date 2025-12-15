import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/data/menu';
import { useCart } from '@/contexts/CartContext';
import { Plus, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`, {
      description: 'Ready when you are!',
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
        <div className="relative h-48 md:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />
          
          {/* Placeholder gradient for image */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/10" />
          
          {/* Decorative food icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">
              {item.category === 'fish' ? '🐟' : item.category === 'beef' ? '🥩' : item.category === 'braise' ? '🍗' : '🍚'}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            {item.popular && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-fire">
                Popular
              </span>
            )}
            {item.new && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-lg shadow-gold">
                New
              </span>
            )}
          </div>

          {/* Spice Level */}
          <div className="absolute top-3 right-3 z-20 flex gap-0.5">
            {spiceLevels.map((active, i) => (
              <Flame
                key={i}
                className={`w-4 h-4 ${
                  active ? 'text-primary' : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        <CardContent className="p-4 md:p-5">
          <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-2 group-hover:text-fire transition-colors duration-300">
            {item.name}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {item.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xl md:text-2xl text-primary">
              €{item.price.toFixed(2)}
            </span>
            
            <Button
              variant="fire"
              size="sm"
              onClick={handleAddToCart}
              className="group/btn"
            >
              <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
