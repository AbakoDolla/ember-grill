import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Menu,
  X,
  Flame,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { href: "/menu", label: t("common.menu") },
    { href: "/about", label: t("common.about") },
    { href: "/contact", label: t("common.contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-8 py-2"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Main bar ── */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-3 sm:px-4 md:px-6 py-2 flex items-center justify-between gap-2">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group relative shrink-0"
            onClick={() => setIsOpen(false)}
          >
            {/* Image */}
            <div className="relative shrink-0">
              <img
                src={logo}
                alt="BrazaFish Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover rounded-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105 border-2 border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/10 to-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Brand name — hidden on very small screens */}
            <div className="hidden xs:flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-base sm:text-lg md:text-xl bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent leading-none">
                  BrazaFish
                </span>
                <span className="font-display font-bold text-xs sm:text-sm md:text-base lg:text-base text-blue-600 leading-none">
                  elora
                </span>
              </div>
              {/* Tagline only on sm+ */}
              <span className="hidden sm:block text-xs text-muted-foreground font-medium tracking-wide uppercase">
                Poisson Braisé Camerounais
              </span>
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse opacity-60" />
            <div
              className="absolute -bottom-1 -right-3 w-1 h-1 bg-red-500 rounded-full animate-pulse opacity-40"
              style={{ animationDelay: "0.5s" }}
            />
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-medium transition-colors duration-300 whitespace-nowrap ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
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

          {/* ── Actions ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            {/* Language switcher — hidden on mobile, shown sm+ */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="glass"
                size="icon"
                className="relative w-9 h-9 sm:w-10 sm:h-10"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* User menu (desktop) */}
            {user ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.user_metadata?.name || user.email}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          {(user.user_metadata?.name ||
                            user.email ||
                            "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.name || "Utilisateur"}
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
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="fire" size="sm">
                  {t("common.orderNow")}
                </Button>
              </Link>
            )}

            {/* Hamburger — mobile & tablet only */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* ── Mobile / Tablet menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden"
            >
              {/* User info banner (if logged in) */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b border-border/40">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                      {(user.user_metadata?.name ||
                        user.email ||
                        "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.user_metadata?.name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 space-y-1">
                {/* Nav links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Logged-in user links */}
                {user && (
                  <>
                    <div className="h-px bg-border/50 my-2" />
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Mon Profil</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Mes Commandes</span>
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Favoris</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </Link>
                  </>
                )}

                <div className="h-px bg-border/50 my-2" />

                {/* Language switcher row */}
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-muted-foreground">Langue</span>
                  <LanguageSwitcher />
                </div>

                {/* Auth CTA or Sign out */}
                <div className="pt-1">
                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="fire" className="w-full">
                        {t("common.orderNow")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
