# BRAZZAFLAME - Grillade Africaine Premium

🍖 **Découvrez les saveurs enflammées de l'Afrique avec BRAZZAFLAME**

Un site web moderne pour commander des grillades africaines authentiques livrées chaudes partout en Belgique.

## 🔥 Fonctionnalités

- **🍣 Poisson grillé** : Tilapia, maquereau, catfish fumé
- **🥩 Viande premium** : Bœuf, poulet et porc braisés
- **🌶️ Niveaux de piment** : De doux à très épicé
- **🚚 Livraison rapide** : 30-45 minutes partout en Belgique
- **🌍 Multilingue** : Support français, néerlandais et anglais
- **📱 Responsive** : Optimisé pour mobile et desktop

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **UI/UX** : Tailwind CSS + Shadcn/ui + Framer Motion
- **Base de données** : Supabase (PostgreSQL)
- **Internationalisation** : React i18next
- **Icônes** : Lucide React

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/AbakoDolla/ember-grill.git
cd ember-grill

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:8080`

### Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier l'URL et la clé API dans `.env.local`
3. Appliquer les migrations :
   ```bash
   npx supabase db push
   ```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants Shadcn/ui
│   ├── Footer.tsx      # Pied de page
│   ├── Navbar.tsx      # Barre de navigation
│   └── ...
├── pages/              # Pages de l'application
├── hooks/              # Hooks personnalisés
├── contexts/           # Contextes React
├── i18n/               # Configuration i18n
├── lib/                # Utilitaires
└── types/              # Types TypeScript

supabase/
└── migrations/         # Migrations de base de données
```

## 🌐 Internationalisation

Le site supporte 3 langues :
- 🇫🇷 Français (par défaut)
- 🇳🇱 Néerlandais
- 🇬🇧 Anglais

Les traductions sont gérées dans `src/i18n/locales/`.

## 🎨 Personnalisation

### Couleurs
Le thème utilise CSS custom properties dans `tailwind.config.ts` :
- `primary` : Orange/rouge pour le thème "fire"
- `secondary` : Accent pour les éléments secondaires
- `accent` : Pour les badges et éléments spéciaux

### Images
Les images des plats sont stockées dans `src/assets/food/`.

## 📦 Scripts disponibles

```bash
npm run dev          # Démarrage développement
npm run build        # Build de production
npm run preview      # Prévisualisation build
npm run lint         # Vérification ESLint
```

## 🚀 Déploiement

Le projet est configuré pour le déploiement sur :
- Vercel
- Netlify
- Railway
- Ou tout autre plateforme supportant React

### Variables d'environnement pour la production

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📄 Licence

Ce projet est privé et appartient à BRAZZAFLAME.

## 📞 Contact

Pour toute question ou suggestion :
- Email : contact@brazzaflame.be
- Site web : [brazzaflame.be](https://brazzaflame.be)

---

🍖 **BRAZZAFLAME** - Où l'Afrique rencontre la Belgique 🔥

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📊 Métriques et performances

- **Lighthouse Score** : 95+ sur mobile et desktop
- **Core Web Vitals** : Optimisé pour les meilleures performances
- **SEO** : Meta tags optimisés pour les moteurs de recherche
- **Accessibilité** : Conformité WCAG 2.1

## 🔒 Sécurité

- Authentification sécurisée via Supabase
- Chiffrement des données sensibles
- Protection CSRF et XSS
- Politiques de sécurité strictes

## 📈 Roadmap

- [ ] Application mobile React Native
- [ ] Système de fidélité client
- [ ] Intégration paiements Stripe
- [ ] Notifications push
- [ ] Mode sombre/clair
- [ ] Support commandes groupées

---

🍖 **BRAZZAFLAME** - Où l'Afrique rencontre la Belgique 🔥

*Développé avec ❤️ pour les amateurs de grillades africaines*
