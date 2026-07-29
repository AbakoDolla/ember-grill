import { Link } from "react-router-dom";
import { Facebook, Flame, Instagram, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Le menu", href: "/menu" },
  { label: "Notre histoire", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const help = [
  { label: "Suivre ma commande", href: "/orders" },
  { label: "Questions fréquentes", href: "/faq" },
  { label: "Confidentialité", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-[#242019] text-[#f8f1e4]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="BrazaFish Elora" className="h-12 w-12 rounded-full border border-white/15 object-cover" />
            <span><span className="block font-display text-2xl leading-none">BrazaFish</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.17em] text-[#f5c05e]">Elora · Braise camerounaise</span></span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#e8ddcd]/70">Le goût généreux du poisson braisé camerounais, préparé avec soin et livré en Belgique pour vos moments à partager.</p>
          <div className="mt-6 flex items-center gap-3">
            <a href="https://instagram.com/brazzaflame" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#f8f1e4] transition-colors hover:border-[#f5c05e] hover:text-[#f5c05e]"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com/brazzaflame" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#f8f1e4] transition-colors hover:border-[#f5c05e] hover:text-[#f5c05e]"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5c05e]">Explorer</h2>
          <ul className="mt-5 space-y-3">
            {navigation.map((item) => <li key={item.href}><Link to={item.href} className="text-sm text-[#e8ddcd]/75 transition-colors hover:text-white">{item.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5c05e]">Besoin d’aide ?</h2>
          <ul className="mt-5 space-y-3">
            {help.map((item) => <li key={item.href}><Link to={item.href} className="text-sm text-[#e8ddcd]/75 transition-colors hover:text-white">{item.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5c05e]">Nous joindre</h2>
          <ul className="mt-5 space-y-3 text-sm text-[#e8ddcd]/75">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e76e35]" />Bruxelles, Belgique</li>
            <li><a href="tel:+32212345678" className="flex gap-2.5 transition-colors hover:text-white"><Phone className="h-4 w-4 shrink-0 text-[#e76e35]" />+32 2 123 4567</a></li>
            <li><a href="mailto:hello@brazzaflame.be" className="flex gap-2.5 transition-colors hover:text-white"><Mail className="h-4 w-4 shrink-0 text-[#e76e35]" />hello@brazzaflame.be</a></li>
          </ul>
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-[#e8ddcd]/75"><span className="font-bold text-[#f5c05e]">Précommande :</span> au minimum 7 jours avant la livraison.</div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-[#e8ddcd]/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} BrazaFish Elora. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">Préparé avec passion <Flame className="h-3.5 w-3.5 text-[#e76e35]" /> en Belgique</p>
        </div>
      </div>
    </footer>
  );
}
