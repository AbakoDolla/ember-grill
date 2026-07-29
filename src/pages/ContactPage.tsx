import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const contactInfo = [
  { icon: Phone, label: "Téléphone", value: "+32 2 123 4567", href: "tel:+32212345678" },
  { icon: Mail, label: "E-mail", value: "hello@brazzaflame.be", href: "mailto:hello@brazzaflame.be" },
  { icon: MapPin, label: "Zone de livraison", value: "Bruxelles et Belgique", href: undefined },
  { icon: Clock3, label: "Livraisons", value: "Vendredi, samedi et dimanche", href: undefined },
];

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSending(true);
    window.setTimeout(() => {
      setIsSending(false);
      form.reset();
      toast.success("Message envoyé", { description: "Notre équipe vous répondra dès que possible." });
    }, 450);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-[#eee6da] pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 pb-11 sm:px-6 md:pb-14 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="section-kicker">Nous contacter</span>
            <h1 className="mt-4 font-display text-5xl leading-[.95] sm:text-6xl">Parlons de votre prochaine table.</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Une question sur une commande, une livraison ou un événement ? Écrivez-nous, nous serons heureux de vous aider.</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_.9fr] md:py-16 lg:gap-16 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-3xl">Envoyez-nous un message</h2>
            <p className="mt-2 text-sm text-muted-foreground">Les champs marqués d’un * sont obligatoires.</p>
            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold">Prénom *<Input required name="firstName" autoComplete="given-name" placeholder="Votre prénom" className="mt-2 h-11 rounded-xl bg-background" /></label>
                <label className="block text-sm font-bold">Nom *<Input required name="lastName" autoComplete="family-name" placeholder="Votre nom" className="mt-2 h-11 rounded-xl bg-background" /></label>
              </div>
              <label className="block text-sm font-bold">E-mail *<Input required type="email" name="email" autoComplete="email" placeholder="vous@exemple.com" className="mt-2 h-11 rounded-xl bg-background" /></label>
              <label className="block text-sm font-bold">Sujet *<Input required name="subject" placeholder="Comment pouvons-nous vous aider ?" className="mt-2 h-11 rounded-xl bg-background" /></label>
              <label className="block text-sm font-bold">Votre message *<Textarea required name="message" placeholder="Écrivez votre message ici…" rows={6} className="mt-2 resize-none rounded-xl bg-background" /></label>
              <Button type="submit" size="lg" className="w-full" disabled={isSending}>{isSending ? "Envoi en cours…" : "Envoyer le message"}<Send className="h-4 w-4" /></Button>
            </form>
          </Card>
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }} className="space-y-5">
          <div className="rounded-2xl bg-[#242019] p-6 text-[#f8f1e4] sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#f5c05e]">Un repas à organiser ?</p><h2 className="mt-3 font-display text-3xl leading-none">Nous vous aidons à préparer le moment parfait.</h2><p className="mt-4 text-sm leading-6 text-[#e8ddcd]/75">Pour les demandes particulières ou les commandes de groupe, contactez-nous le plus tôt possible.</p></div>
          <Card className="divide-y divide-border overflow-hidden">
            {contactInfo.map((item) => {
              const content = <><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><item.icon className="h-5 w-5" /></span><span><span className="block text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">{item.label}</span><span className="mt-1 block text-sm font-semibold text-foreground">{item.value}</span></span></>;
              return item.href ? <a key={item.label} href={item.href} className="flex gap-3 p-5 transition-colors hover:bg-muted/50">{content}</a> : <div key={item.label} className="flex gap-3 p-5">{content}</div>;
            })}
          </Card>
        </motion.aside>
      </section>

      <Footer />
    </div>
  );
}
