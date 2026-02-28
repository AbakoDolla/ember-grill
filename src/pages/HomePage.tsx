import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Clock, Truck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import FireParticles from "@/components/FireParticles";
import Food3D from "@/components/Food3D";
import MenuCard from "@/components/MenuCard";
import Footer from "@/components/Footer";
import { menuItems } from "@/data/menu";

export default function HomePage() {
  const { t } = useTranslation();
  const popularItems = menuItems.filter((item) => item.popular).slice(0, 4);

  const features = [
    {
      icon: Flame,
      title: t("features.charcoal.title"),
      description: t("features.charcoal.description"),
    },
    {
      icon: Clock,
      title: t("features.delivery.title"),
      description: t("features.delivery.description"),
    },
    {
      icon: Truck,
      title: t("features.belgium.title"),
      description: t("features.belgium.description"),
    },
    {
      icon: Star,
      title: t("features.quality.title"),
      description: t("features.quality.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(18_100%_60%/0.1),transparent_70%)]" />
        <FireParticles />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Flame className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {t("hero.badge")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6"
              >
                BRAZZA
                <br />
                <span className="text-fire">{t("hero.title2")}</span>
                <br />
                {t("hero.title3")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-lg xs:max-w-xl sm:max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8"
              >
                {t("hero.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center lg:justify-start"
              >
                <Link to="/auth">
                  <Button variant="default" size="xl">
                    {t("common.viewMenu")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl">
                  {t("hero.howItWorks")}
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center lg:justify-start gap-4 xs:gap-6 sm:gap-8 md:gap-12 mt-8 xs:mt-10 sm:mt-12"
              >
                {[
                  { value: "10K+", label: t("hero.stats.customers") },
                  { value: "4.9", label: t("hero.stats.rating") },
                  { value: "30min", label: t("hero.stats.delivery") },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="font-display text-xl xs:text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* 3D Food Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]"
            >
              {/* Glow behind 3D */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(18_100%_60%/0.2),transparent_60%)]" />
              <Suspense
                fallback={
                  <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg animate-pulse" />
                }
              >
                <Food3D />
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("features.title")}{" "}
              <span className="text-fire">BRAZZAFLAME</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 xs:p-6 text-center hover:border-primary/30 hover:shadow-fire transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                {t("favorites.title")}{" "}
                <span className="text-fire">
                  {t("favorites.titleHighlight")}
                </span>
              </h2>
              <p className="text-muted-foreground">{t("favorites.subtitle")}</p>
            </div>
            <Link to="/menu">
              <Button variant="outline" className="group">
                {t("favorites.viewAll")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/5 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(18_100%_60%/0.2),transparent_70%)]" />

            <div className="relative z-10">
              <Flame className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t("cta.title")}{" "}
                <span className="text-fire">{t("cta.titleHighlight")}</span>?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                {t("cta.description")}
              </p>
              <Link to="/auth">
                <Button variant="default" size="xl">
                  {t("common.orderNow")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
