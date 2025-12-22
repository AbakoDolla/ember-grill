# Configuration Supabase pour Ember Grill

## 🚀 Connexion à Supabase

### 1. Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - Name: `ember-grill`
   - Database Password: Choisissez un mot de passe fort
   - Region: Choisissez la région la plus proche

### 2. Configurer les variables d'environnement
Une fois le projet créé, allez dans **Settings > API** et copiez :

- **Project URL**
- **anon/public key**

Modifiez le fichier `.env.local` :
```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
```

### 3. Appliquer le schéma de base de données
Vous avez deux options :

#### Option A : Via Supabase CLI (recommandé)
```bash
# Se connecter à Supabase
npx supabase login

# Lier le projet (remplacez VOTRE_PROJECT_ID par l'ID de votre projet)
npx supabase link --project-ref VOTRE_PROJECT_ID

# Appliquer les migrations
npx supabase db push
```

#### Option B : Via l'interface Supabase
1. Allez dans **SQL Editor** de votre projet Supabase
2. Copiez-collez le contenu du fichier `supabase/migrations/20241217140000_initial_schema.sql`
3. Cliquez sur **Run**

### 4. Déployer les Edge Functions (optionnel)
Si vous voulez utiliser les fonctions Edge :
```bash
# Déployer toutes les fonctions
npx supabase functions deploy
```

### 5. Tester la connexion
Lancez votre application :
```bash
npm run dev
```

L'application devrait maintenant se connecter à votre base Supabase !

## 📋 Tables créées
- `profiles` - Profils utilisateurs
- `menu_items` - Articles du menu
- `customers` - Clients (pour commandes invités)
- `orders` - Commandes
- `order_items` - Articles des commandes
- `payments` - Paiements
- `notifications` - Notifications

## 🔧 Variables d'environnement
Assurez-vous que ces variables sont définies dans `.env.local` :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`