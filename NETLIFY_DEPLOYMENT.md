# Déploiement Netlify

## Configuration incluse

- `netlify.toml` lance `npm run build` et publie le dossier `dist`.
- La version de Node est fixée à `20.19.0`, compatible avec Vite 7.
- Toutes les routes React Router sont réécrites vers `index.html`. Un accès
  direct à `/menu`, `/cart`, `/contact` ou `/admin/login` ne produira donc pas
  de page 404 sur Netlify.
- Les secrets ne sont pas stockés dans Git. Consultez `.env.example` pour les
  seules variables publiques nécessaires au client.

## Variables Netlify à renseigner

Dans **Netlify → Site configuration → Environment variables**, ajoutez ces
variables pour les contextes **Production** et **Deploy previews** :

| Variable | Usage |
| --- | --- |
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Clé publique / anon Supabase |
| `VITE_PAYPAL_CLIENT_ID` | Identifiant client PayPal, si PayPal est activé |

Ne définissez jamais de mot de passe, de `SUPABASE_SERVICE_ROLE_KEY`, de clé
Stripe secrète ni de clé privée dans une variable `VITE_*`. Vite les expose
alors dans le JavaScript servi au navigateur. Ces secrets doivent rester dans
les secrets des fonctions Supabase.

## Accès administrateur

L'administration utilise Supabase Auth, puis vérifie le rôle `profiles.role`.
Après avoir créé le compte administrateur dans Supabase, attribuez-lui le rôle
`admin` :

```sql
update public.profiles
set role = 'admin'
where email = 'admin@votre-domaine.tld';
```

## Vérification locale

```bash
npm ci
npm run build
```

Après la fusion vers `main`, vérifiez le déploiement Netlify ainsi qu'un
rafraîchissement direct des URLs `/menu`, `/cart` et `/contact`.
