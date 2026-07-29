import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Heart, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import grillTable from "@/assets/food/asset-461481331362410496.jpg";
import sharedMeal from "@/assets/food/asset-461481331362410499.jpg";

const values = [
  { icon: Flame, title: "Le respect de la braise", text: "Une cuisson lente au charbon qui révèle la texture du poisson et laisse les épices s’exprimer." },
  { icon: ShieldCheck, title: "La qualité sans raccourci", text: "Nous sélectionnons chaque produit avec exigence et préparons chaque commande pour sa date de livraison." },
  { icon: Users, title: "Le plaisir de partager", text: "Nos plats sont pensés pour réunir famille, amis et toute personne curieuse de découvrir le braisé camerounais." },
  { icon: Heart, title: "La générosité en héritage", text: "Des recettes inspirées de la cuisine camerounaise, servies avec le soin que mérite un repas important." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="grid overflow-hidden bg-[#242019] pt-[68px] text-[#f8f1e4] md:grid-cols-2 md:pt-[96px]">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="flex items-center px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:pl-8 lg:pr-16">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5c05e]">Notre histoire</span>
            <h1 className="mt-5 text-balance font-display text-5xl leading-[0.95] sm:text-6xl">Une flamme, une histoire, <em className="text-[#f2a04f]">un lien.</em></h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#e8ddcd]/75">BrazaFish Elora fait voyager la richesse du braisé camerounais jusqu’à votre table, sans jamais en perdre l’âme.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative min-h-[320px] md:min-h-[520px]">
          <img src={grillTable} alt="Poisson braisé servi dans un cadre convivial" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#242019]/35 to-transparent md:bg-gradient-to-t md:from-[#242019]/35" />
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[.8fr_1.2fr] md:py-24 lg:gap-20 lg:px-8">
        <div><span className="section-kicker">Notre démarche</span><h2 className="mt-4 font-display text-4xl leading-[1.03] sm:text-5xl">Ramener l’essentiel dans chaque assiette.</h2></div>
        <div className="max-w-2xl space-y-5 leading-7 text-muted-foreground">
          <p>Le braisé camerounais est plus qu’une recette : c’est une cuisson patiente, des parfums de charbon, de piment et d’herbes, et surtout le plaisir d’un repas partagé.</p>
          <p>Chez BrazaFish Elora, nous avons choisi de préserver cette simplicité. Nous travaillons sur précommande afin de préparer les poissons avec l’attention qu’ils demandent, puis de les livrer au meilleur moment du week-end.</p>
          <p className="font-medium text-foreground">Notre objectif est clair : vous faire retrouver un goût franc, généreux et profondément authentique.</p>
        </div>
      </section>

      <section className="bg-[#eee6da] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><span className="section-kicker">Ce qui nous guide</span><h2 className="mt-4 font-display text-4xl leading-none sm:text-5xl">La tradition, avec une exigence d’aujourd’hui.</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => <motion.article key={value.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-[#d7c9b6] bg-[#f8f1e4] p-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><value.icon className="h-5 w-5" /></span><h3 className="mt-7 font-display text-2xl leading-none">{value.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{value.text}</p></motion.article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:gap-16 lg:px-8">
        <div className="order-2 md:order-1"><span className="section-kicker">À partager</span><h2 className="mt-4 max-w-lg font-display text-4xl leading-[1.03] sm:text-5xl">Un plat qui arrive chez vous, une table qui se remplit.</h2><p className="mt-5 max-w-lg leading-7 text-muted-foreground">Précommandez votre poisson braisé, choisissez votre créneau et préparez-vous à passer un vrai bon moment autour de la table.</p><Link to="/menu" className="mt-7 inline-block"><Button size="lg">Voir la carte <ArrowRight className="h-4 w-4" /></Button></Link></div>
        <div className="order-1 overflow-hidden rounded-[1.75rem] md:order-2"><img src={sharedMeal} alt="Poisson braisé et accompagnements colorés" className="h-[300px] w-full object-cover sm:h-[380px]" /></div>
      </section>

      <Footer />
    </div>
  );
}
