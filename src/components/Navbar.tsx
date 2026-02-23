import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, Flame, User, LogOut, Settings } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import logo from '@/assets/logo.jpg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { href: '/menu', label: t('common.menu') },
    { href: '/about', label: t('common.about') },
    { href: '/contact', label: t('common.contact') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-8 py-2"
    >
      <div className="max-w-7xl mx-auto">
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-2 sm:px-3 md:px-4 py-1 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-4 md:gap-6 group relative">
            {/* Logo avec effets visuels */}
            <div className="relative">
              <img 
                src={logo} 
                alt="BrazaFish Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-cover rounded-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105 border-2 border-white/20"
              />
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/10 to-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Nom de la marque */}
            <div className="flex flex-col hidden xs:block">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="font-display font-black text-sm sm:text-base md:text-lg lg:text-xl bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent leading-none">
                  BrazaFish
                </span>
                <span className="font-display font-bold text-xs sm:text-sm md:text-base lg:text-base text-blue-600 leading-none">
                  elora
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase hidden sm:block">
                Poisson Braisé Camerounais
              </span>
            </div>
            
            {/* Particules décoratives - cachées sur mobile */}
            <div className="hidden sm:block absolute -top-2 -right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse opacity-60"></div>
            <div className="hidden sm:block absolute -bottom-1 -right-4 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse opacity-40" style={{animationDelay: '0.5s'}}></div>
            <div className="hidden sm:block absolute top-1 -left-3 w-1 h-1 bg-yellow-500 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-medium transition-colors duration-300 ${
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <LanguageSwitcher />
            
            <Link to="/cart">
              <Button variant="glass" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* User Menu or Auth Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.name || 'Utilisateur'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Mes Commandes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center">
                      <Flame className="mr-2 h-4 w-4" />
                      <span>Favoris</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="fire" size="sm" className="hidden xs:flex px-2 sm:px-4">
                  {t('common.orderNow')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="xs:hidden h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="xs:hidden mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-3 sm:p-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      location.pathname === link.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="fire" className="mt-2 w-full">
                    {t('common.orderNow')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
