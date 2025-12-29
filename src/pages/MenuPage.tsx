import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { menuItems, categories, MenuItem } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import Footer from '@/components/Footer';
import { AlertTriangle, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MenuPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-8 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our <span className="text-fire">{t('common.menu')}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('menu.description')}
            </p>
          </motion.div>

          {/* Delivery Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    📅 Système de Commande à l'Avance
                  </h3>
                  <div className="text-amber-700 dark:text-amber-300 space-y-1">
                    <p>• <strong>Commande 7 jours minimum à l'avance</strong> pour garantir la fraîcheur</p>
                    <p>• <strong>Livraison uniquement le vendredi, samedi et dimanche</strong></p>
                    <p>• <strong>Paiement immédiat</strong> après validation de la commande</p>
                    <p>• Sélectionnez votre date et heure de livraison lors du checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-border rounded-xl"
              />
            </div>
            <Button variant="glass" size="lg" className="gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              {t('menu.filters')}
            </Button>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'fire' : 'glass'}
                size="lg"
                onClick={() => setActiveCategory(category.id)}
                className="whitespace-nowrap gap-2 shrink-0"
              >
                <span>{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="px-4 sm:px-6 md:px-8 mb-12 sm:mb-16">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, i) => (
                <MenuCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">{t('menu.noDishes')}</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4"
              >
                {t('menu.clearFilters')}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
