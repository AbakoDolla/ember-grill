import { motion } from "framer-motion";
import { Flame, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    toast.success("Ajouté au panier", { description: `${item.name} a été ajouté à votre commande.` });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.24) }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_28px_hsl(24_24%_12%/0.06)] transition-shadow duration-300 hover:shadow-[0_16px_36px_hsl(24_24%_12%/0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {item.popular && <span className="rounded-full bg-[#242019] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f8f1e4]">Best-seller</span>}
          {item.new && <span className="rounded-full bg-[#f4c96b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#242019]">Nouveau</span>}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-0.5 rounded-full bg-black/45 px-2 py-1 text-[#f6b24f] backdrop-blur-sm" aria-label={`Intensité pimentée : ${item.spiceLevel} sur 3`}>
          {Array.from({ length: 3 }, (_, spice) => <Flame key={spice} className={`h-3 w-3 ${spice < item.spiceLevel ? "fill-current" : "text-white/30"}`} />)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-[1.05] text-foreground">{item.name}</h3>
          <p className="shrink-0 text-base font-bold text-primary">{new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(item.price)}</p>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-semibold text-muted-foreground">Braisé au charbon</span>
          <Button size="sm" onClick={handleAddToCart} aria-label={`Ajouter ${item.name} au panier`} className="rounded-lg px-3"><Plus className="h-4 w-4" />Ajouter</Button>
        </div>
      </div>
    </motion.article>
  );
}
