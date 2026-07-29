import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Flame,
  Heart,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const navLinks = [
    { href: "/", label: t("common.home") },
    { href: "/menu", label: t("common.menu") },
    { href: "/about", label: t("common.about") },
    { href: "/contact", label: t("common.contact") },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const isCurrent = (href: string) =>
    href === "/" ? location.pathname === "/" || location.pathname === "/home" : location.pathname === href;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="hidden border-b border-foreground/10 bg-[#242019] text-[#f7f0e3] md:block">
        <div className="mx-auto flex h-7 max-w-7xl items-center justify-center gap-2 px-6 text-[10px] font-bold uppercase tracking-[0.16em]">
          <Flame className="h-3 w-3 text-[#e56a32]" aria-hidden="true" />
          Précommande requise · Livraison vendredi, samedi et dimanche
        </div>
      </div>

      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="relative block h-10 w-10 overflow-hidden rounded-full border border-foreground/10 bg-card sm:h-11 sm:w-11">
            <img src={logo} alt="BrazaFish Elora" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </span>
          <span className="hidden leading-none xs:block">
            <span className="block font-display text-xl tracking-tight text-foreground sm:text-2xl">BrazaFish</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-primary">Elora · Braise camerounaise</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative py-2 text-sm font-bold transition-colors ${
                isCurrent(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {isCurrent(link.href) && <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden xl:block">
            <LanguageSwitcher />
          </div>

          <Link to="/cart" aria-label={`${t("common.cart")}${cartCount ? `, ${cartCount} articles` : ""}`}>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0" aria-label="Ouvrir le menu du compte">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || user.email} />
                      <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                        {(user.user_metadata?.name || user.email || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <p className="truncate text-sm font-bold">{user.user_metadata?.name || "Mon compte"}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/dashboard"><User className="mr-2 h-4 w-4" />Mon profil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/orders"><Package className="mr-2 h-4 w-4" />Mes commandes</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/favorites"><Heart className="mr-2 h-4 w-4" />Mes favoris</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/settings"><Settings className="mr-2 h-4 w-4" />Paramètres</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/menu" className="hidden lg:block">
              <Button size="sm" className="rounded-lg px-4">{t("common.orderNow")}</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-border bg-card px-4 py-4 shadow-xl lg:hidden"
          >
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/70 p-3">
                <Avatar className="h-9 w-9"><AvatarImage src={user.user_metadata?.avatar_url} /><AvatarFallback className="bg-primary text-primary-foreground">{(user.user_metadata?.name || user.email || "U")[0].toUpperCase()}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="truncate text-sm font-bold">{user.user_metadata?.name || "Mon compte"}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
              </div>
            )}

            <nav className="space-y-1" aria-label="Navigation mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold ${
                    isCurrent(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}<ChevronRight className="h-4 w-4" />
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">Mes commandes<ChevronRight className="h-4 w-4" /></Link>
                  <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">Paramètres<ChevronRight className="h-4 w-4" /></Link>
                </>
              )}
            </nav>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <LanguageSwitcher />
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-destructive"><LogOut className="h-4 w-4" />Déconnexion</Button>
              ) : (
                <Link to="/menu" onClick={() => setIsOpen(false)}><Button size="sm">{t("common.orderNow")}</Button></Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
