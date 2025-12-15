import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flame, Instagram, Facebook, Twitter, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Fire glow effect at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      {/* Floating WhatsApp & Call Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <motion.a
          href="tel:+32212345678"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg fire-glow"
        >
          <Phone className="w-6 h-6 text-primary-foreground" />
        </motion.a>
        <motion.a
          href="https://wa.me/32212345678"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-fresh flex items-center justify-center shadow-lg"
        >
          <MessageCircle className="w-6 h-6 text-fresh-foreground" />
        </motion.a>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-fire">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                BRAZZA<span className="text-fire">FLAME</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-foreground mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {[
                { label: t('common.menu'), href: '/menu' },
                { label: t('common.about'), href: '/about' },
                { label: t('footer.locations'), href: '#' },
                { label: t('footer.catering'), href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-foreground mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {[
                { label: t('footer.contactUs'), href: '/contact' },
                { label: t('footer.faq'), href: '#' },
                { label: t('footer.trackOrder'), href: '#' },
                { label: t('footer.privacy'), href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display font-bold text-foreground mb-4">{t('common.contact')}</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>Brussels, Belgium</li>
              <li>+32 2 123 4567</li>
              <li>hello@brazzaflame.be</li>
              <li className="pt-2">
                <span className="text-fresh font-medium">{t('footer.openDaily')}</span>
                <br />
                11:00 AM - 11:00 PM
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 BRAZZAFLAME. {t('footer.rights')}
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            {t('footer.madeWith')} <Flame className="w-4 h-4 text-primary" /> {t('footer.inBelgium')}
          </p>
        </div>
      </div>
    </footer>
  );
}
