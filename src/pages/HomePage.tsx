import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  Flame,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/MenuCard";
import Footer from "@/components/Footer";
import { menuItems } from "@/data/menu";
import heroFish from "@/assets/food/asset-461481331362410497.jpg";
import tableFish from "@/assets/food/asset-461482020239118342.jpg";

const steps = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Choisissez votre date",
    description: "Réservez au moins 7 jours à l’avance pour nous laisser le temps de tout préparer avec soin.",
  },
  {
    number: "02",
    icon: Flame,
    title: "Nous braisons lentement",
    description: "Votre poisson est assaisonné, grillé au charbon et préparé pour le créneau que vous avez choisi.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Savourez le week-end",
    description: "Votre commande est livrée fraîchement préparée le vendredi, samedi ou dimanche.",
  },
];

export default function HomePage() {
  const signatureItems = menuItems.filter((item) => item.popular).slice(0, 3);

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative isolate overflow-hidden bg-[#242019] pb-14 pt-28 text-[#f8f1e4] sm:pb-20 md:pt-36 lg:pb-24">
        <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_82%_14%,rgba(218,99,48,.26),transparent_20%),radial-gradient(circle_at_12%_100%,rgba(213,169,82,.13),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,hsl(var(--background)),transparent)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f8f1e4]/20 bg-[#f8f1e4]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5c05e]">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e76e35] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#e76e35]" /></span>
              La braise camerounaise à Bruxelles
            </div>

            <h1 className="max-w-2xl text-balance font-display text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              La braise du Cameroun, <em className="text-[#f2a04f]">préparée</em> pour votre table.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-[#e8ddcd]/75 sm:text-lg">
              Des poissons soigneusement sélectionnés, des épices qui ont du caractère et une cuisson lente au charbon. Une vraie expérience de braisé, livrée en Belgique.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/menu"><Button variant="hero" size="xl" className="w-full bg-[#e05d2a] hover:bg-[#c84e20] sm:w-auto">Choisir mon poisson <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href="#commander"><Button variant="heroOutline" size="xl" className="w-full border-[#f8f1e4]/30 text-[#f8f1e4] hover:border-[#f8f1e4]/60 hover:bg-[#f8f1e4]/10 sm:w-auto">Comment ça marche <ArrowDownRight className="h-4 w-4" /></Button></a>
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-3 border-t border-[#f8f1e4]/15 pt-5 text-xs text-[#e8ddcd]/70 sm:text-sm">
              <div className="border-r border-[#f8f1e4]/15 pr-3"><strong className="block font-display text-2xl text-[#f8f1e4]">7 jours</strong>de précommande</div>
              <div className="border-r border-[#f8f1e4]/15 px-3"><strong className="block font-display text-2xl text-[#f8f1e4]">3 jours</strong>de livraison</div>
              <div className="pl-3"><strong className="block font-display text-2xl text-[#f8f1e4]">100%</strong>à la braise</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
            className="relative order-1 mx-auto w-full max-w-xl md:order-2"
          >
            <div className="absolute -inset-4 -rotate-3 rounded-[2rem] border border-[#f8f1e4]/10" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.65rem] border border-[#f8f1e4]/15 shadow-2xl shadow-black/30 sm:aspect-[6/5]">
              <img src={heroFish} alt="Poissons braisés camerounais servis avec leurs accompagnements" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between rounded-xl border border-white/20 bg-black/30 p-3.5 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-5 sm:p-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5c05e]">Signature BrazaFish</p><p className="mt-1 font-display text-xl leading-none text-white sm:text-2xl">Le goût du braisé authentique</p></div>
                <Flame className="h-7 w-7 shrink-0 text-[#ef7a3d]" />
              </div>
            </div>
            <div className="absolute -right-2 top-8 hidden rounded-full bg-[#f8f1e4] px-4 py-2 text-xs font-bold text-[#242019] shadow-xl sm:block">Épicé juste comme il faut</div>
          </motion.div>
        </div>
      </section>

      <section id="commander" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <span className="section-kicker">Commander simplement</span>
            <h2 className="mt-4 max-w-md text-balance font-display text-4xl leading-[1.02] sm:text-5xl">Trois étapes. Rien de plus.</h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">Parce qu’un poisson braisé d’exception ne s’improvise pas : nous avons pensé un parcours clair pour vous garantir fraîcheur et sérénité.</p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#e9e0d1] px-3 py-2 text-xs font-bold text-[#514334]"><Clock3 className="h-4 w-4 text-primary" /> Commandes livrées du vendredi au dimanche</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative rounded-2xl border border-border bg-card p-5 shadow-[0_12px_30px_hsl(24_24%_12%/0.05)]"
              >
                <span className="absolute right-5 top-4 font-display text-3xl text-foreground/10">{step.number}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><step.icon className="h-5 w-5" /></span>
                <h3 className="mt-8 font-display text-2xl leading-none">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#eee6da] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="section-kicker">À la carte</span><h2 className="mt-4 text-balance font-display text-4xl leading-none sm:text-5xl">Nos incontournables</h2></div>
            <Link to="/menu" className="group inline-flex items-center gap-2 text-sm font-bold text-primary">Découvrir tout le menu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {signatureItems.map((item, index) => <MenuCard key={item.id} item={item} index={index} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:gap-16 lg:px-8">
        <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] bg-[#242019] md:min-h-full">
          <img src={tableFish} alt="Poisson braisé servi sur une table" className="absolute inset-0 h-full w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#242019]/85 via-[#242019]/10 to-transparent" />
          <div className="absolute bottom-0 p-7 text-[#f8f1e4] sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5c05e]">Une cuisine qui rassemble</p><p className="mt-3 max-w-sm font-display text-3xl leading-none sm:text-4xl">Des saveurs franches, des souvenirs qui restent.</p></div>
        </div>
        <div className="flex flex-col justify-center py-2 md:py-8">
          <span className="section-kicker">Notre promesse</span>
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.02] sm:text-5xl">Ce qui fait la différence, c’est le temps que l’on y met.</h2>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">De la marinade à la livraison, chaque étape est pensée pour respecter l’âme du braisé camerounais et vous offrir un plat généreux, prêt à partager.</p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              [ShieldCheck, "Sélection exigeante", "Des poissons choisis pour leur fraîcheur et leur chair."],
              [Flame, "Braise maîtrisée", "Une cuisson lente au charbon pour un goût fumé unique."],
              [MapPin, "Partout en Belgique", "Une livraison organisée sur les créneaux du week-end."],
              [Sparkles, "Préparé pour vous", "Votre commande est cuisinée pour la date réservée."],
            ].map(([Icon, title, description]) => {
              const FeatureIcon = Icon as typeof ShieldCheck;
              return <li key={title as string} className="flex gap-3"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><FeatureIcon className="h-4 w-4" /></span><span><strong className="block text-sm">{title as string}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description as string}</span></span></li>;
            })}
          </ul>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-primary px-6 py-12 text-primary-foreground sm:px-10 sm:py-14 lg:px-16">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border-[48px] border-white/10" />
          <div className="relative flex max-w-3xl flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div><span className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Votre prochain repas vous attend</span><h2 className="mt-3 text-balance font-display text-4xl leading-none sm:text-5xl">Prêt à retrouver le vrai goût de la braise ?</h2><p className="mt-4 max-w-xl leading-7 text-white/75">Réservez aujourd’hui, choisissez votre créneau de week-end et laissez-nous faire le reste.</p></div>
            <Link to="/menu" className="shrink-0"><Button variant="secondary" size="lg" className="bg-[#f8f1e4] text-[#242019] hover:bg-white">Je précommande <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
