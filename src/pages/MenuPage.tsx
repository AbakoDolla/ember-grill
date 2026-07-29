import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, menuItems } from "@/data/menu";
import MenuCard from "@/components/MenuCard";
import Footer from "@/components/Footer";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => menuItems.filter((item) => {
    const search = searchQuery.trim().toLocaleLowerCase("fr");
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = !search || item.name.toLocaleLowerCase("fr").includes(search) || item.description.toLocaleLowerCase("fr").includes(search);
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-[#eee6da] pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 md:pb-14 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl">
            <span className="section-kicker">La carte BrazaFish</span>
            <h1 className="mt-4 text-balance font-display text-5xl leading-[0.95] sm:text-6xl">Du charbon, du temps et de vraies saveurs.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Choisissez votre poisson braisé préféré. Chaque commande est préparée spécialement pour votre date de livraison.</p>
          </motion.div>

          <div className="mt-8 flex max-w-3xl gap-3 rounded-2xl border border-[#cfc0ac] bg-[#f8f1e4] p-4 text-sm leading-6 text-[#514334]">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><CalendarDays className="h-4 w-4" /></span>
            <p><strong className="font-bold text-foreground">Une cuisine préparée sur commande.</strong><br />Réservez au minimum 7 jours à l’avance. Les livraisons sont assurées le vendredi, samedi et dimanche.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 md:py-12 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Filtrer la carte</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  size="sm"
                  variant={activeCategory === category.id ? "default" : "glass"}
                  onClick={() => setActiveCategory(category.id)}
                  className="shrink-0 rounded-full px-4"
                >
                  <span aria-hidden="true">{category.icon}</span>{category.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Rechercher un poisson, une saveur…" className="h-11 rounded-xl border-border bg-card pl-10 pr-10" aria-label="Rechercher dans le menu" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Effacer la recherche" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button>}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filteredItems.length}</span> {filteredItems.length > 1 ? "plats à découvrir" : "plat à découvrir"}</p>
          {(activeCategory !== "all" || searchQuery) && <button type="button" onClick={clearFilters} className="text-sm font-bold text-primary hover:underline">Réinitialiser</button>}
        </div>

        {filteredItems.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item, index) => <MenuCard key={item.id} item={item} index={index} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <p className="font-display text-3xl">Aucun plat ne correspond à votre recherche.</p>
            <p className="mt-2 text-sm text-muted-foreground">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
            <Button variant="outline" className="mt-5" onClick={clearFilters}>Voir tout le menu</Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
