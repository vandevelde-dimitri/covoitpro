# Covoit'Pro

Application mobile de covoiturage exclusive pour les centres logistiques Amazon, permettant aux Associates de voyager ensemble de manière efficace et solidaire.

---

## 📱 Présentation

**Covoit'Pro** est une application mobile développée avec **Expo** et **React Native** qui facilite l'organisation du covoiturage entre Associates Amazon. Cette plateforme exclusive crée une communauté professionnelle où les employés peuvent :

- Partager leurs trajets quotidiens vers les centres logistiques
- Communiquer directement avec leurs collègues
- Gérer leurs applications de covoiturage
- Mettre à jour leur profil professionnel
- Recevoir des notifications en temps réel
- Consulter les annonces de covoiturage disponibles

Le système a été pensé pour être **facile d'utilisation**, **sécurisé** et **performant**, garantissant une expérience utilisateur fluide sur les appareils mobiles iOS et Android.

---

## 🏗️ Architecture Logicielle

Ce projet implémente la **Clean Architecture** pour garantir une maintenabilité maximale, une testabilité facile et une séparation claire des responsabilités. Voici comment l'architecture est organisée :

### 📂 Structure des Dossiers

```
src/
├── domain/                    # Couche métier (Business Logic)
│   ├── entities/             # Modèles de données purs (User, Auth, Chat, etc.)
│   ├── repositories/         # Interfaces des repositories
│   └── errors/              # Classes d'erreurs personnalisées
│
├── application/              # Couche logique applicative (Orchestration)
│   └── use-case/            # Cas d'usage métier (Login, Register, etc.)
│       ├── announcement/    # Gestion des annonces
│       ├── auth/           # Authentification
│       ├── chat/           # Messagerie
│       ├── contact/        # Gestion des contacts
│       ├── favorite/       # Favoris
│       ├── floor/          # Gestion des étages/localisations
│       ├── notification/   # Notifications
│       ├── setting/        # Paramètres utilisateur
│       ├── user/           # Gestion de profil
│       └── application/    # Gestion des candidatures
│
├── infrastructure/          # Couche infrastructure (Implémentations externes)
│   ├── supabase.ts         # Client Supabase
│   ├── repositories/       # Implémentations concrètes des repositories
│   └── mappers/            # Mappage domain → API
│
└── presentation/            # Couche présentation (UI)
    ├── components/         # Composants réutilisables
    ├── screens/            # Écrans complets
    ├── hooks/              # Custom hooks (queries, mutations, contexte)
    └── ...
```

### 🎯 Principes de Clean Architecture Appliqués

#### 1. **Séparation des Responsabilités**

- **Domain** : Ne contient que la logique métier pure, indépendante de toute technologie
- **Application** : Orchestre les use cases sans connaître les détails d'implémentation
- **Infrastructure** : Gère les dépendances externes (Supabase, API, base de données)
- **Presentation** : Affiche les données et capte les interactions utilisateur

#### 2. **Inversion de Dépendances**

Les couches supérieures dépendent des abstractions (interfaces) définies dans la couche métier, jamais de concrétions :

```typescript
// Domain - Interface abstraite
export interface IAuthRepository {
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
}

// Application - Use Case utilise l'interface
export class LoginUseCase {
  constructor(private authRepo: IAuthRepository) {}
  async execute(email: string, password: string): Promise<void> {
    // Logique métier
  }
}

// Infrastructure - Implémentation concrète
export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<void> {
    // Implémentation Supabase
  }
}

// Presentation - Injection de dépendances
const useCase = useMemo(() => {
  const authRepo = SupabaseAuthRepository.getInstance();
  return new LoginUseCase(authRepo);
}, []);
```

#### 3. **Use Cases Réutilisables**

Chaque use case encapsule une action métier spécifique :

- **`LoginUseCase`** : Authentifie un utilisateur avec validation d'email et mot de passe
- **`RegisterUseCase`** : Crée un nouveau compte avec critères de sécurité (longueur, majuscule, chiffre, caractère spécial)
- **`GetCurrentUserUseCase`** : Récupère le profil de l'utilisateur connecté
- **`DeleteAccountUseCase`** : Supprime complètement le compte utilisateur

#### 4. **Gestion d'Erreurs Centralisée**

```typescript
// Domain - Classes d'erreurs métier
export class UnauthorizedError extends AppError {}
export class NotFoundError extends AppError {}
export class BusinessError extends AppError {}
```

#### 5. **Mappers pour Transformer les Données**

Les mappers convertissent les données API Supabase en modèles de domaine :

```
Infrastructure/mappers/ → Convertit API Supabase → Entities Domain
```

### ✅ Avantages de cette Architecture

| Avantage                       | Description                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Testabilité**                | Les use cases peuvent être testés indépendamment grâce aux interfaces                                      |
| **Maintenabilité**             | Chaque couche a une responsabilité unique et claire                                                        |
| **Évolutivité**                | Ajouter une nouvelle source de données ne requiert que d'ajouter une nouvelle implémentation du repository |
| **Indépendance Technologique** | La logique métier ne dépend pas de Supabase ou d'une autre technologie                                     |
| **Réutilisabilité**            | Les use cases peuvent être appelés depuis n'importe quel contexte (hooks React, tests, etc.)               |
| **Cohésion**                   | Les entités métier sont au cœur de l'architecture, tout tourne autour d'elles                              |

---

## 🛠️ Stack Technique

### Frontend

- **Expo** v54.0.33 - Framework React Native avec tooling optimisé
- **React Native** v0.81.5 - Framework pour développement mobile cross-platform
- **React** v19.1.0 - Bibliothèque UI
- **TypeScript** v5.9.2 - Typage statique pour JavaScript

### Routing & Navigation

- **Expo Router** v6.0.23 - Routage basé fichiers (comme Next.js)
- **React Navigation** v7.1.8 - Stack de navigation native

### State Management & Data Fetching

- **TanStack React Query** v5.90.20 - Gestion du cache serveur et synchronisation
- **Async Storage** v2.2.0 - Stockage persistant côté client

### Backend & Authentication

- **Supabase** v2.95.3 - Backend as a Service (PostgreSQL + Auth)

### Formulaires

- **React Hook Form** v7.71.1 - Gestion légère des formulaires
- **Yup** v1.7.1 - Validation de schémas

### UI & Animations

- **Expo Linear Gradient** - Dégradés d'arrière-plan
- **Expo Blur** - Effets de flou
- **Shopify React Native Skia** v2.2.12 - Graphiques et animations 2D haute performance
- **React Native Reanimated** v4.1.1 - Animations fluides et performantes
- **React Native Gesture Handler** v2.28.0 - Gestion avancée des gestes tactiles
- **React Native SVG** - Support des images vectorielles

### Caméra & Stockage

- **Expo Image Picker** - Sélection d'images depuis galerie/caméra
- **Expo Image Manipulator** - Compression et transformation d'images
- **Expo Image** - Chargement optimisé d'images

### Autres Utilitaires

- **Expo Haptics** - Retours haptiques (vibrations)
- **Expo Linking** - Gestion des deep links
- **Expo Symbols** - Icônes système natives
- **Community Datetimepicker** - Sélecteur de date/heure
- **Netinfo** - Information sur la connectivité réseau

---

## ⭐ Fonctionnalités

### 🔐 Authentification

- **Connexion** : Authentification sécurisée avec email et mot de passe
- **Inscription** : Création de compte avec validation stricte des mots de passe (min 8 caractères, majuscule, chiffre, caractère spécial)
- **Récupération de Mot de Passe** : Réinitialisation par email avec lien de confirmation
- **Réinitialisation de Mot de Passe** : Changement sécurisé du mot de passe via lien temporaire
- **Gestion de Session** : Persistence et refresh automatique de la session utilisateur

### 👤 Profil Utilisateur

- **Consultation de Profil** : Affichage du profil personnel avec historique complétude
- **Modification de Profil** : Mise à jour des informations personnelles (nom, email, localisation, étage, etc.)
- **Gestion d'Avatar** : Upload, changement et suppression de photo de profil
- **Profil Public** : Consultation du profil d'autres Associates (informations limitées)
- **Suppression de Compte** : Suppression complète et irréversible du compte utilisateur

### 💬 Messagerie

- **Conversations** : Liste des conversations actives avec autres Associates
- **Chat en Temps Réel** : Envoi et réception de messages instantanés
- **Historique** : Accès à tout l'historique de conversation

### 📢 Annonces & Offres

- **Consultation d'Annonces** : Affichage des offres de covoiturage disponibles
- **Création d'Annonces** : Publication d'une nouvelle offre de trajet
- **Favoris** : Marquer et gérer les annonces favorites
- **Détails Annonce** : Consultation complète (horaires, lieux, participants)

### 📋 Candidatures

- **Mes Candidatures** : Historique de ses candidatures à des trajets
- **Suivi de Candidature** : État actuel de chaque candidature (en attente, acceptée, refusée)
- **Gestion** : Acceptation ou refus de candidatures reçues

### 📍 Gestion de Localisation

- **Étages/Centres** : Sélection de son étage de travail Amazon
- **Localisations** : Gestion des lieux de départ et arrivée préférés

### 🔔 Notifications

- **Notifications en Temps Réel** : Alertes pour nouveaux messages, candidatures, mises à jour
- **Historique** : Consultation des notifications précédentes
- **Paramètres** : Contrôle des préférences de notification

### ⚙️ Paramètres Utilisateur

- **Préférences** : Paramètres d'application (thème, notifications, confidentialité)
- **Sécurité** : Changement de mot de passe et sécurité du compte
- **Confidentialité** : Gestion des données personnelles et de la visibilité du profil

### 📱 Gestion des Contacts

- **Carnet de Contacts** : Liste des Associates avec lesquels on a interagi
- **Historique** : Accès rapide aux conversations et profiles

### 🎯 Onboarding

- **Bienvenue** : Écran d'introduction à l'application
- **Inscription Multi-étapes** : Processus complet de création de compte
- **Configuration Initiale** : Setup du profil après première connexion

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 18 LTS
- **npm** ou **yarn** en tant que gestionnaire de paquets
- **Expo CLI** (installé automatiquement via npm)
- Un appareil Android/iOS ou un émulateur

### Étapes d'Installation

#### 1. Cloner le Dépôt

```bash
git clone <votre-url-repo>
cd covoitpro
```

#### 2. Installer les Dépendances

```bash
npm install
```

#### 3. Configuration de l'Environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Application URLs
EXPO_PUBLIC_API_URL=https://api.example.com
```

> ⚠️ **Note** : Les variables d'environnement préfixées par `EXPO_PUBLIC_` sont exposées au client. N'y mettez pas de données sensibles comme les clés d'API secrètes.

#### 4. Démarrer l'Application

**Mode Développement (Expo)**

```bash
npx expo start
```

Puis :

- Appuyez sur **`a`** pour lancer sur Android
- Appuyez sur **`i`** pour lancer sur iOS
- Appuyez sur **`w`** pour lancer sur le web

**Build Android**

```bash
npx expo run:android
```

**Build iOS** (macOS uniquement)

```bash
npx expo run:ios
```

**Mode Web**

```bash
npx expo start --web
```

### Fichiers de Configuration

| Fichier         | Description                                            |
| --------------- | ------------------------------------------------------ |
| `app.json`      | Configuration Expo (permissions, icônes, splashscreen) |
| `expo-env.d.ts` | Typage TypeScript des variables d'environnement        |
| `tsconfig.json` | Configuration TypeScript                               |
| `package.json`  | Dépendances et scripts npm                             |

---

## 📚 Documentation Additionnelle

### Architecture Deep Dive

Pour une compréhension plus approfondie de l'architecture Clean Architecture, consultez les patterns d'implémentation dans les dossiers :

- `src/domain/` - Entités et interfaces métier
- `src/application/use-case/` - Orchestration des cas d'usage
- `src/infrastructure/` - Implémentations concrètes

### Hooks Personnalisés

L'application utilise des hooks personnalisés pour simplifier l'utilisation des use cases :

```typescript
// Queries (lecture)
useCurrentUser();
useGetConversations();
useUserApplications();
useFloors();

// Mutations (écriture)
useLogin();
useRegister();
useForgotPassword();
useUpdateUser();
useDeleteAccount();
```

### Authentification

Le contexte d'authentification (`authContext`) gère :

- La session utilisateur globale
- Le refresh de session automatique
- Le logout et la purge du cache

```typescript
const { session, loading, profileCompleted, logout } = useAuth();
```

---

## 🤝 Contribution

Pour contribuer au projet :

1. Créez une branche feature (`git checkout -b feature/ma-feature`)
2. Respectez l'architecture Clean Architecture existante
3. Écrivez les use cases dans `src/application/use-case/`
4. Implémentez les interfaces du domaine dans `src/infrastructure/`
5. Créez les composants dans `src/presentation/`
6. Committez vos changements (`git commit -m 'feat: ajout de ma-feature'`)
7. Poussez votre branche (`git push origin feature/ma-feature`)
8. Ouvrez une Pull Request

---

## 📄 Licence

Propriétaire - Tous droits réservés ©2024
