import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { HelpCircle, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const faqCategories = [
  {
    title: 'Commandes & Livraison',
    icon: '📦',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'C\'est simple ! Parcourez notre menu, ajoutez vos plats préférés au panier, puis finalisez votre commande en choisissant votre date et heure de livraison.'
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Nous livrons du vendredi au dimanche. Les commandes doivent être passées au minimum 7 jours à l\'avance pour garantir la fraîcheur de nos produits.'
      },
      {
        q: 'Quelles sont les zones de livraison ?',
        a: 'Nous livrons actuellement dans toute la région de Bruxelles. Pour les livraisons en dehors de cette zone, veuillez nous contacter directement.'
      },
      {
        q: 'Puis-je suivre ma commande ?',
        a: 'Oui ! Une fois votre commande confirmée, vous pouvez suivre son statut en temps réel dans votre espace client.'
      }
    ]
  },
  {
    title: 'Paiement',
    icon: '💳',
    questions: [
      {
        q: 'Quels sont les modes de paiement acceptés ?',
        a: 'Nous acceptons les paiements par carte bancaire et PayPal pour une sécurité maximale de vos transactions.'
      },
      {
        q: 'Le paiement est-il sécurisé ?',
        a: 'Absolument ! Tous nos paiements sont traités via des passerelles sécurisées et cryptées conformes aux standards PCI-DSS.'
      },
      {
        q: 'Puis-je payer à la livraison ?',
        a: 'Pour garantir la fraîcheur et éviter le gaspillage, nous exigeons un paiement immédiat lors de la validation de la commande.'
      }
    ]
  },
  {
    title: 'Produits & Qualité',
    icon: '🔥',
    questions: [
      {
        q: 'Quelle est la provenance de vos ingrédients ?',
        a: 'Nous travaillons exclusivement avec des fournisseurs locaux et sélectionnons les meilleurs ingrédients pour garantir une qualité exceptionnelle.'
      },
      {
        q: 'Vos plats sont-ils halal ?',
        a: 'Oui, tous nos produits et notre préparation respectent les normes halal.'
      },
      {
        q: 'Puis-je personnaliser ma commande ?',
        a: 'Bien sûr ! Vous pouvez ajouter des instructions spéciales lors de la commande pour adapter les plats à vos préférences.'
      }
    ]
  },
  {
    title: 'Service Client',
    icon: '🤝',
    questions: [
      {
        q: 'Comment contacter le service client ?',
        a: 'Vous pouvez nous joindre par téléphone au +32 2 123 4567, par email à hello@brazaflame.be, ou via notre formulaire de contact.'
      },
      {
        q: 'Quels sont vos horaires d\'ouverture ?',
        a: 'Notre service client est disponible du lundi au dimanche de 11h00 à 23h00 pour répondre à toutes vos questions.'
      },
      {
        q: 'Que faire en cas de problème avec ma commande ?',
        a: 'Contactez-nous immédiatement et nous interviendrons pour résoudre la situation dans les plus brefs délais.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Questions <span className="text-fire">Fréquentes</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vous avez des questions ? Nous avons les réponses. Explorez notre FAQ pour trouver rapidement l'information dont vous avez besoin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <button
                  onClick={() => setOpenCategory(openCategory === categoryIndex ? null : categoryIndex)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{category.icon}</span>
                    <h3 className="font-display font-bold text-xl">{category.title}</h3>
                  </div>
                  <HelpCircle className={`w-6 h-6 transition-transform ${openCategory === categoryIndex ? 'rotate-180' : ''}`} />
                </button>

                {openCategory === categoryIndex && (
                  <div className="px-6 pb-6 space-y-4">
                    {category.questions.map((item, questionIndex) => (
                      <div key={questionIndex} className="border-l-2 border-border/50 pl-4">
                        <button
                          onClick={() => setOpenQuestion(openQuestion === `${categoryIndex}-${questionIndex}` ? null : `${categoryIndex}-${questionIndex}`)}
                          className="w-full text-left py-3 hover:text-primary transition-colors"
                        >
                          <h4 className="font-semibold text-foreground">{item.q}</h4>
                        </button>
                        {openQuestion === `${categoryIndex}-${questionIndex}` && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-2 text-muted-foreground"
                          >
                            {item.a}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <Card variant="fire" className="p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Pas trouvé votre réponse ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question supplémentaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Nous contacter
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+32212345678">
                  <Phone className="w-5 h-5 mr-2" />
                  +32 2 123 4567
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
