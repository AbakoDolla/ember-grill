import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Cookie, Mail, ArrowRight } from 'lucide-react';

const privacySections = [
  {
    title: 'Collecte des Informations',
    icon: '📊',
    content: [
      {
        subtitle: 'Informations que nous collectons',
        text: 'Nous collectons les informations que vous nous fournissez directement lors de votre inscription, de vos commandes ou de vos communications avec nous. Cela inclut votre nom, email, adresse de livraison, numéro de téléphone et préférences alimentaires.'
      },
      {
        subtitle: 'Informations collectées automatiquement',
        text: 'Notre site web peut collecter automatiquement certaines informations techniques comme votre adresse IP, type de navigateur, et données d\'utilisation pour améliorer nos services.'
      }
    ]
  },
  {
    title: 'Utilisation des Données',
    icon: '🎯',
    content: [
      {
        subtitle: 'Traitement des commandes',
        text: 'Vos informations sont utilisées pour traiter vos commandes, coordonner les livraisons et vous fournir des mises à jour sur le statut de votre commande.'
      },
      {
        subtitle: 'Amélioration des services',
        text: 'Nous analysons les données d\'utilisation pour améliorer notre site web, optimiser notre menu et personnaliser votre expérience.'
      },
      {
        subtitle: 'Communication',
        text: 'Nous utilisons vos coordonnées pour vous envoyer des confirmations de commande, des mises à jour de livraison et des communications relatives au service client.'
      }
    ]
  },
  {
    title: 'Protection des Données',
    icon: '🔒',
    content: [
      {
        subtitle: 'Mesures de sécurité',
        text: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l\'accès non autorisé, la modification, la divulgation ou la destruction.'
      },
      {
        subtitle: 'Cryptage',
        text: 'Toutes les transactions sensibles sont cryptées using SSL/TLS. Les données de paiement sont traitées via des passerelles sécurisées conformes aux standards PCI-DSS.'
      },
      {
        subtitle: 'Accès limité',
        text: 'Seul le personnel autorisé a accès à vos informations personnelles, et uniquement dans la mesure nécessaire pour fournir nos services.'
      }
    ]
  },
  {
    title: 'Cookies et Suivi',
    icon: '🍪',
    content: [
      {
        subtitle: 'Cookies essentiels',
        text: 'Notre site utilise des cookies essentiels pour fonctionner correctement, notamment pour maintenir votre session et gérer votre panier.'
      },
      {
        subtitle: 'Cookies analytiques',
        text: 'Nous utilisons des cookies analytiques pour comprendre comment notre site est utilisé et améliorer nos services. Vous pouvez désactiver ces cookies dans les paramètres de votre navigateur.'
      },
      {
        subtitle: 'Cookies tiers',
        text: 'Certains services tiers (comme PayPal ou Google Analytics) peuvent placer des cookies sur votre navigateur pour fournir leurs fonctionnalités.'
      }
    ]
  },
  {
    title: 'Vos Droits',
    icon: '⚖️',
    content: [
      {
        subtitle: 'Accès et modification',
        text: 'Vous avez le droit d\'accéder à vos informations personnelles et de demander leur correction ou mise à jour à tout moment via votre espace client.'
      },
      {
        subtitle: 'Suppression',
        text: 'Vous pouvez demander la suppression de votre compte et de vos données personnelles, sous réserve des obligations légales de conservation.'
      },
      {
        subtitle: 'Portabilité',
        text: 'Vous avez le droit de demander une copie de vos données personnelles dans un format structuré et lisible.'
      }
    ]
  },
  {
    title: 'Partage des Données',
    icon: '🤝',
    content: [
      {
        subtitle: 'Prestataires de services',
        text: 'Nous partageons vos informations uniquement avec les prestataires nécessaires à la fourniture de nos services (livraison, paiement, etc.) sous contrat de confidentialité.'
      },
      {
        subtitle: 'Obligations légales',
        text: 'Nous pouvons divulguer vos informations si requis par la loi, dans le cadre d\'une procédure légale ou pour protéger nos droits et notre sécurité.'
      },
      {
        subtitle: 'Pas de vente commerciale',
        text: 'Nous ne vendons, ne louons ni ne partageons vos informations personnelles à des fins marketing avec des tiers sans votre consentement explicite.'
      }
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Politique de <span className="text-fire">Confidentialité</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Votre confiance est notre priorité. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl">{section.icon}</span>
                  <h3 className="font-display font-bold text-2xl">{section.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-2 border-primary/20 pl-6">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        {section.title === 'Protection des Données' && itemIndex === 0 && <Lock className="w-4 h-4" />}
                        {section.title === 'Cookies et Suivi' && itemIndex === 0 && <Cookie className="w-4 h-4" />}
                        {section.title === 'Vos Droits' && itemIndex === 0 && <Eye className="w-4 h-4" />}
                        {item.subtitle}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <Card variant="fire" className="p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Des questions sur vos données ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Notre équipe protection des données est à votre disposition pour répondre à toutes vos questions concernant cette politique de confidentialité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="mailto:privacy@brazaflame.be">
                  <Mail className="w-5 h-5 mr-2" />
                  privacy@brazaflame.be
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">
                  Contacter le support
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Last Updated */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Cette politique peut être mise à jour pour refléter les changements dans nos pratiques ou pour des raisons opérationnelles et légales.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
