# Supabase Setup Guide

## Configuration de Supabase pour Ember Grill

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations du projet :
   - Name: `ember-grill`
   - Database Password: Choisissez un mot de passe fort
   - Region: Sélectionnez la région la plus proche (EU-West pour l'Europe)

### 2. Configuration des variables d'environnement

1. Dans votre projet Supabase, allez dans Settings > API
2. Copiez l'URL du projet et la clé anon public
3. Créez un fichier `.env.local` dans la racine du projet :

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Appliquer les migrations

```bash
# Démarrer Supabase localement (optionnel pour le développement)
npx supabase start

# Appliquer les migrations
npx supabase db push
```

### 4. Configuration de l'authentification (optionnel)

Si vous voulez ajouter l'authentification utilisateur :

1. Dans Supabase Dashboard > Authentication > Settings
2. Configurez les providers souhaités (Email, Google, etc.)
3. Activez l'authentification par email si nécessaire

### 5. Configuration du stockage (optionnel)

Pour stocker les images des plats :

1. Dans Supabase Dashboard > Storage
2. Créez un bucket nommé `food-images`
3. Configurez les politiques RLS pour permettre l'accès public en lecture

## Utilisation dans le code

### Récupérer les éléments du menu

```tsx
import { useMenuItems } from '@/hooks/useMenuItems'

function MenuPage() {
  const { menuItems, loading, error, getMenuItemsByCategory } = useMenuItems()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const fishItems = getMenuItemsByCategory('fish')

  return (
    <div>
      {menuItems.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <span>€{item.price}</span>
        </div>
      ))}
    </div>
  )
}
```

### Créer une commande

```tsx
import { useOrders } from '@/hooks/useOrders'

function CheckoutPage() {
  const { createOrder, loading } = useOrders()

  const handleSubmit = async (formData) => {
    try {
      const result = await createOrder(
        {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        },
        cartItems,
        formData.address,
        formData.instructions
      )

      console.log('Order created:', result.orderId)
    } catch (error) {
      console.error('Order failed:', error)
    }
  }
}
```

## Structure de la base de données

- `menu_items` : Éléments du menu avec prix, catégories, niveaux de piment
- `customers` : Informations clients
- `orders` : Commandes avec statut et adresse de livraison
- `order_items` : Articles dans chaque commande

## Sécurité

La base de données utilise Row Level Security (RLS) pour contrôler l'accès :
- Les éléments du menu sont publics en lecture
- Les clients ne peuvent voir/modifier que leurs propres données
- Les commandes sont privées par client

## Développement local

Pour développer avec Supabase localement :

```bash
# Démarrer Supabase
npx supabase start

# Appliquer les migrations
npx supabase db push

# Voir les logs
npx supabase logs

# Arrêter Supabase
npx supabase stop
```

## Déploiement

1. Poussez votre code vers votre repository
2. Configurez les variables d'environnement dans votre plateforme de déploiement
3. Supabase gère automatiquement la base de données en production