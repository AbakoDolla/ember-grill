# Déploiement Vercel

## Configuration déjà incluse

- `vercel.json` utilise `npm ci`, lance `npm run build` et publie `dist`.
- Toutes les routes React Router sont réécrites vers `index.html`, ce qui évite
  les 404 lors d'un accès direct à `/menu`, `/cart`, `/contact` ou `/admin/login`.
- Les valeurs sensibles ne sont pas stockées dans Git. Consultez `.env.example`
  pour les seules variables client nécessaires.

## Variables Vercel à renseigner

Ajoutez les valeurs suivantes dans **Vercel → Project → Settings → Environment Variables**
pour les environnements souhaités (Preview et Production au minimum) :

| Variable | Usage |
| --- | --- |
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Clé publique / anon Supabase |
| `VITE_PAYPAL_CLIENT_ID` | Identifiant client PayPal, si le paiement PayPal est activé |

Ne définissez jamais de mot de passe, de `SUPABASE_SERVICE_ROLE_KEY`, de clé
Stripe secrète ni de clé privée en `VITE_*`: Vite les expose dans le navigateur.
Ces secrets doivent rester dans les secrets des fonctions Supabase.

## Accès administrateur

L'administration est maintenant authentifiée par Supabase, puis autorisée avec
le champ `profiles.role`. Après avoir créé le compte administrateur dans Supabase,
assurez-vous que son profil porte le rôle `admin` :

```sql
update public.profiles
set role = 'admin'
where email = 'admin@votre-domaine.tld';
```

Les politiques RLS du schéma restreignent alors les actions d'administration à
ces comptes. N'utilisez plus de mot de passe ou de clé secrète dans les variables
Vercel côté client.

## Vérification avant production

```bash
npm ci
npm run build
```

Le build produit doit se terminer sans erreur. Après la création de la PR vers
`main`, vérifiez le déploiement Preview Vercel, puis les pages `/`, `/menu`,
`/contact` et un rafraîchissement direct de `/menu` avant la promotion en production.
