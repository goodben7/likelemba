# Tontine RDC - Application Mobile

Application mobile pour la gestion des tontines (épargne rotative) en République Démocratique du Congo.

## 🚀 Fonctionnalités

- **Authentification sécurisée** : Connexion par téléphone + code OTP
- **Gestion des groupes** : Création et administration de groupes de tontine
- **Suivi des paiements** : Monitoring des cotisations et statuts de paiement
- **Mobile Money** : Intégration avec Airtel Money, M-Pesa, Orange Money
- **Notifications** : Rappels automatiques et informations importantes
- **Interface multilingue** : Support Français (extensible)
- **Design responsive** : Optimisé pour mobile Android

## 🛠️ Technologies

- **Framework** : React Native avec Expo
- **Navigation** : Expo Router
- **Styling** : StyleSheet natif
- **Icons** : Lucide React Native
- **Testing** : Jest + React Native Testing Library
- **TypeScript** : Support complet

## 📱 Architecture

```
app/
├── (tabs)/           # Navigation par onglets
│   ├── index.tsx     # Tableau de bord
│   ├── groups.tsx    # Gestion des groupes
│   ├── payments.tsx  # Paiements
│   └── profile.tsx   # Profil utilisateur
├── index.tsx         # Écran de connexion
└── _layout.tsx       # Layout racine

components/
├── ui/               # Composants UI réutilisables
│   ├── AccessibleInput.tsx
│   ├── AccessibleButton.tsx
│   └── ErrorBoundary.tsx
├── DashboardCard.tsx
├── GroupCard.tsx
└── PaymentCard.tsx

hooks/
├── useAuthForm.ts    # Logique d'authentification
├── useI18n.ts        # Internationalisation
└── useFrameworkReady.ts

services/
├── auth.ts           # Service d'authentification
└── tontine.ts        # Service de gestion des tontines

utils/
└── validation.ts     # Utilitaires de validation

constants/
└── strings.ts        # Chaînes de caractères i18n
```

## 🔧 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd tontine-rdc

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

## 🔒 Sécurité

### Validation des entrées
- Sanitisation automatique des inputs utilisateur
- Validation stricte des formats (téléphone, OTP)
- Protection contre les injections XSS

### Authentification
- Codes OTP à usage unique
- Expiration automatique des codes
- Limitation des tentatives

### Données sensibles
- Pas de stockage local des mots de passe
- Chiffrement des communications
- Validation côté client et serveur

## ♿ Accessibilité

- **Labels descriptifs** : Tous les éléments interactifs ont des labels
- **Annonces vocales** : Erreurs et changements d'état annoncés
- **Taille des cibles** : Minimum 48px pour les boutons
- **Contraste** : Respect des ratios WCAG 2.1
- **Navigation clavier** : Support complet

## 🌍 Internationalisation

Le système i18n est prêt pour l'extension :

```typescript
// Ajouter une nouvelle langue
export const STRINGS = {
  fr: { /* français */ },
  ln: { /* lingala */ },
  // Autres langues...
};
```

## 📊 Performance

### Optimisations implémentées
- **React.memo** : Composants mémorisés
- **useCallback** : Fonctions optimisées
- **Lazy loading** : Chargement différé des composants
- **Error boundaries** : Gestion gracieuse des erreurs

### Métriques cibles
- **First Load** : < 3s
- **Navigation** : < 200ms
- **Memory usage** : < 100MB

## 🚀 Déploiement

### Build de production
```bash
# Build web
npm run build:web

# Build Android (nécessite Expo CLI)
expo build:android
```

### Variables d'environnement
```env
EXPO_PUBLIC_API_URL=https://api.tontine-rdc.com
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changes (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

### Standards de code
- **TypeScript** : Typage strict obligatoire
- **ESLint** : Respect des règles configurées
- **Tests** : Couverture minimum 80%
- **Accessibilité** : Conformité WCAG 2.1

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Email** : support@tontine-rdc.com
- **Issues** : GitHub Issues
- **Documentation** : [Wiki du projet]

---

**Tontine RDC** - Votre partenaire pour l'épargne collective 🏪
