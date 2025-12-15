import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Flame, Users, Award, Heart, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Flame,
    title: 'Authentic Fire',
    description: 'Every dish is grilled over real charcoal, capturing the essence of traditional African cooking.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We support local suppliers and bring the African diaspora together through food.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only the finest ingredients make it to your plate. No compromises, ever.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each recipe has been passed down through generations and prepared with care.',
  },
];

const team = [
  { name: 'Amara Diallo', role: 'Founder & Head Chef', emoji: '👨‍🍳' },
  { name: 'Kofi Mensah', role: 'Grill Master', emoji: '🔥' },
  { name: 'Fatima Ndiaye', role: 'Operations', emoji: '📋' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero */}
      <section className="px-4 md:px-8 mb-16 md:mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The Story Behind
              <br />
              <span className="text-fire">BraiseRoyale</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Born from a passion for authentic African flavors and a dream to share them with Belgium. This is our journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 md:px-8 mb-16 md:mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/5 flex items-center justify-center">
                <span className="text-8xl">🔥</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                From Dakar Streets to Brussels Tables
              </h2>
              <p className="text-muted-foreground">
                BraiseRoyale began in 2019 when our founder, Amara Diallo, missed the smoky, fire-kissed flavors of his grandmother's cooking in Senegal. What started as weekend barbecues for friends quickly became the most sought-after African grill in Brussels.
              </p>
              <p className="text-muted-foreground">
                Today, we serve thousands of customers across Belgium, bringing the authentic taste of West and Central African grilling to your doorstep. Every piece of fish is hand-selected, every cut of beef is premium, and every braise is slow-cooked with love.
              </p>
              <p className="text-muted-foreground">
                Our mission is simple: to make world-class African cuisine accessible to everyone, delivered fast and fresh, without compromising on tradition or taste.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 md:px-8 mb-16 md:mb-24 bg-card py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-fire">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background/50 rounded-2xl p-6 text-center border border-border/50 hover:border-primary/30 hover:shadow-fire transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 md:px-8 mb-16 md:mb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="text-fire">Team</span>
            </h2>
            <p className="text-muted-foreground">
              The passionate people behind every delicious dish
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl">
                  {member.emoji}
                </div>
                <h3 className="font-display font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the <span className="text-fire">Difference</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of satisfied customers who've discovered the best African grill in Belgium.
            </p>
            <Link to="/menu">
              <Button variant="hero" size="xl">
                Explore Our Menu
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
