# 🚗 Covoit'Pro

> **La solution moderne d'optimisation des trajets domicile-travail pour les zones logistiques**

[![Expo](https://img.shields.io/badge/Expo-54.0.33-000?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![React Query](https://img.shields.io/badge/React%20Query-5.x-FF4154?style=flat-square)](https://tanstack.com/query)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)](#)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://react.dev)

---

## 🎯 À Propos du Projet

**Covoit'Pro** est une application mobile native (iOS & Android) conçue pour optimiser les trajets domicile-travail dans les zones logistiques. Elle connecte les collègues d'une même entreprise pour favoriser le covoiturage, réduire les émissions de carbone et créer une communauté professionnelle plus engagée.

### Pitch Executive

Une plateforme collaborative qui transforme les déplacements quotidiens en opportunités de partage, tout en répondant aux besoins croissants des entreprises en matière de mobilité durable et efficacité opérationnelle.

---

## 🏗️ Architecture Principles

### Clean Architecture pour la Pérennité

Nous avons adopté une **architecture hexagonale (Clean Architecture)** organisée en couches distinctes et découplées :

```
Domain Layer (Métier)
    ↓
Use Cases Layer (Logique applicative)
    ↓
Infrastructure Layer (Données & Services)
    ↓
Presentation Layer (UI & Interactions)
```

#### 🎯 Principes Clés

| Principe                   | Bénéfice                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| **Separation of Concerns** | Chaque couche a une responsabilité unique et clairement définie    |
| **Testabilité Maximale**   | Les entités métier et cas d'usage sont indépendants du framework   |
| **Évolutivité**            | Ajout facile de nouvelles fonctionnalités sans affecter l'existant |
| **Maintenabilité**         | Code lisible, autodocumenté et adhérant aux principes SOLID        |
| **Framework-Agnostic**     | Logique métier indépendante de React Native ou Expo                |

#### 🔄 Flux Décisionnel

1. **Request** → Arrivée dans la Presentation Layer
2. **Use Case** → Orchestration de la logique applicative
3. **Domain Entities** → Vérification des règles métier
4. **Infrastructure** → Interrogation de la base de données
5. **Response** → Retour formaté au client

---

## 🚀 Stack Technologique

### Frontend Mobile

- **Expo 54** - Framework React Native moderne et streamlined
- **React Native 0.81** - Framework mobile cross-platform
- **Expo Router 6** - Navigation déclarative (similaire à Next.js App Router)
- **React Hook Form** - Gestion efficace des formulaires

### Backend & Infrastructure

- **Supabase** - PostgreSQL managé + Authentication + Real-time
- **React Query (TanStack)** - Gestion d'état serveur et mise en cache
- **TypeScript** - Type-safety et développement plus sûr

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Expo Vector Icons** - Iconographie professionnelle
- **Skia (React Native Skia)** - Rendus graphiques haute performance

### Dev Tools & Infrastructure

- **Async Storage** - Persévérance locale des données
- **Image Picker & Manipulator** - Gestion optimisée des images
- **Haptics** - Retours haptiques pour meilleure UX
- **NetInfo** - Gestion de la connectivité réseau

---

## 📋 Fonctionnalités Clés

### ✅ Actuelles

#### 🚗 Gestion des Trajets

- ✨ Création de trajets avec horaires flexibles
- 📍 Sélection géographique par centre logistique
- 🔍 Recherche intelligente des trajets correspondants
- 📅 Gestion des trajets récurrents (quotidien, hebdomadaire)
- 💬 Communication en temps réel avec les participants

#### 👤 Profil & Compte

- 🔐 Authentification sécurisée via Supabase (Email, Magic Link)
- 📸 Gestion optimisée de l'avatar utilisateur
- ✏️ Édition du profil professionnel
- ⭐ Système de notation et d'évaluations (collègues)
- 🌐 Préférences multilingues

#### 📱 Messagerie & Communication

- 💬 Chat en direct entre utilisateurs
- 🔔 Notifications en temps réel
- ✅ Statuts de lecture des messages
- 📲 Push notifications natives

#### ❤️ Favoris & Recommandations

- 🌟 Sauvegarde des trajets et utilisateurs favoris
- 🎯 Recommandations personnalisées

---

## 📁 Structure du Projet

```
covoitpro/
│
├── 📂 app/                          # UI Layer (Expo Router)
│   ├── (auth)/                      # Authentication flows
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── onboarding.tsx
│   │
│   ├── (tabs)/                      # Main app tabs
│   │   ├── home/                    # Accueil & annonces
│   │   ├── messaging/               # Chat et conversations
│   │   ├── account/                 # Profil utilisateur
│   │   └── formAnnouncement.tsx     # Création de trajet
│   │
│   └── user/[id].tsx                # Profil public d'un utilisateur
│
├── 📂 src/                          # Domain & Business Logic (Clean Architecture)
│   │
│   ├── 📂 domain/                   # 🎯 Couche Métier (ENTITÉS)
│   │   ├── entities/                # Modèles de données métier
│   │   │   ├── announcement/
│   │   │   ├── user/
│   │   │   ├── chat/
│   │   │   ├── contact/
│   │   │   └── ...
│   │   │
│   │   ├── repositories/            # Interfaces des repositories
│   │   │   ├── AnnouncementRepository.ts
│   │   │   ├── UserRepository.ts
│   │   │   └── ChatRepository.ts
│   │   │
│   │   └── errors/                  # Exceptions métier
│   │       └── AppError.ts
│   │
│   ├── 📂 application/              # 🔄 Couche Use Cases (ORCHESTRATION)
│   │   ├── use-case/                # Cas d'usage métier
│   │   │   ├── announcement/        # Créer, chercher, modifier un trajet
│   │   │   ├── auth/                # S'authentifier, créer compte
│   │   │   ├── chat/                # Envoyer message, gérer conversation
│   │   │   ├── user/                # Éditer profil, récupérer infos
│   │   │   └── ...
│   │   │
│   │   └── application/             # Services d'application
│   │       └── di.ts               # Injection de dépendances
│   │
│   ├── 📂 infrastructure/           # 🔌 Couche Données (PERSISTENCE)
│   │   ├── supabase.ts              # Initialisation Supabase
│   │   ├── repositories/            # Implémentation concrète
│   │   │   ├── AnnouncementRepositoryImpl.ts
│   │   │   ├── UserRepositoryImpl.ts
│   │   │   └── ChatRepositoryImpl.ts
│   │   │
│   │   ├── mappers/                 # DTO ↔ Entités
│   │   │   ├── AnnouncementMapper.ts
│   │   │   └── UserMapper.ts
│   │   │
│   │   └── services/                # Appels externes
│   │       └── NotificationService.ts
│   │
│   └── 📂 presentation/             # 🎨 Couche Présentation (UI)
│       ├── components/              # Composants réutilisables
│       │   ├── buttons/
│       │   ├── cards/
│       │   ├── modals/
│       │   └── ...
│       │
│       ├── hooks/                   # React Hooks personnalisés
│       │   ├── useAuth.ts
│       │   ├── useAnnouncements.ts
│       │   └── useChat.ts
│       │
│       └── screens/                 # Screens full-page
│           └── (mappées via app/)
│
├── 📂 utils/                        # Utilitaires génériques
│   ├── announcementUtils.ts
│   ├── authError.ts
│   ├── logger.ts
│   ├── permission.ts
│   └── ...
│
├── 📂 constants/                    # Constantes applicatives
│   └── Colors.ts
│
├── 📂 assets/                       # Ressources statiques
│   ├── fonts/
│   └── images/
│
├── 📂 plugins/                      # Expo Plugins
│   └── withTransparentNavBar.js
│
├── 📂 android/                      # Configuration Android native
├── 📂 ios/                          # Configuration iOS native
│
├── app.json                         # Configuration Expo
├── eas.json                         # Configuration EAS Build
├── tsconfig.json                    # Configuration TypeScript
├── package.json                     # Dépendances
└── README.md                        # Ce fichier

```

### 🎓 Explication de l'Architecture

**Pourquoi cette structure ?**

- **`domain/`** : Contient la logique métier pure, sans dépendances externes. C'est le cœur de l'application.
- **`application/`** : Orchestre les cas d'usage métier, coordonne les repositories et services.
- **`infrastructure/`** : Implémente les détails techniques (API Supabase, stockage local, etc.)
- **`presentation/`** : Couche UI, complètement découplée de la logique métier.

**Avantages clés :**

- ✅ Testabilité : Chaque couche peut être testée indépendamment
- ✅ Maintenabilité : Changement facile de Supabase vers autre provider
- ✅ Évolutivité : Ajout de nouvelles features sans code legacy
- ✅ Onboarding : Nouveaux développeurs comprennent rapidement la structure

---

## ⚙️ Installation & Configuration

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ou **yarn**
- **Expo CLI** : `npm install -g expo-cli`
- **Compte Supabase** : [supabase.com](https://supabase.com)

### 🔧 Setup Initial

```bash
# 1. Cloner le repository
git clone https://github.com/yourusername/covoitpro.git
cd covoitpro

# 2. Installer les dépendances
npm install
# ou
yarn install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplissez les variables Supabase :
# SUPABASE_URL=votre_url_supabase
# SUPABASE_ANON_KEY=votre_clé_anon
```

### 🚀 Lancer l'Application

```bash
# Mode développement (tous les plateformes)
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 📱 Build pour Production

```bash
# Configuration EAS
eas build --platform ios --auto-submit
eas build --platform android
```

---

## 🧪 Testing & Quality

### Tests Unitaires

```bash
npm run test
```

### Linting & Code Quality

```bash
npm run lint
```

### Build Local

```bash
npm run build
```

---

## 🔗 Architecture des Cas d'Usage

### Exemple : Créer un Trajet

```
UI (FormAnnouncement.tsx)
    ↓
UseCase (CreateAnnouncementUseCase)
    ↓
Domain Entity (Announcement)
    ↓
Repository Interface (AnnouncementRepository)
    ↓
Infrastructure (AnnouncementRepositoryImpl → Supabase)
    ↓
Response (UI updated via React Query)
```

Chaque couche est indépendante et testable unitairement.

---

## 📚 Ressources & Documentation

### Frameworks & Libraries

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com)

### Architecture

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>)

---

## 🗺️ Roadmap Future

### Phase 2 : Backend Robustifié (Q3 2026)

- 🚀 Migration vers **NestJS** pour une API REST/GraphQL robuste
- 🔐 Implémentation de role-based access control (RBAC)
- 📊 Analytics et dashboard administrateur
- 🔄 Système de scoring avancé pour les covoitureurs

### Phase 3 : Expansion & Intégrations (Q4 2026)

- 🗺️ Intégration Google Maps API avancée
- 🤖 Recommendations ML-powered
- 🌍 Support multilingue complet
- 🔔 Push notifications optimisées

### Phase 4 : Écosystème (2027)

- 🌐 Application Web (Next.js 14)
- 🤝 API publique pour partenaires
- 📈 Marketplace pour services complémentaires
- 🎖️ Système de gamification avancé

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des améliorations :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Merci de respecter les conventions de code et d'ajouter des tests pour toute nouvelle fonctionnalité.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Support & Contact

- 📧 Email : support@covoitpro.com
- 🐛 Issues : [GitHub Issues](https://github.com/yourusername/covoitpro/issues)
- 💬 Discussions : [GitHub Discussions](https://github.com/yourusername/covoitpro/discussions)

---

## 🏆 Crédits

Développé avec ❤️ par l'équipe de développement Covoit'Pro.

**Stack choisi pour sa :**

- Performance et fiabilité éprouvées
- Communauté active et bien documentée
- Scalabilité et pérennité garanties
- Adhérence aux meilleures pratiques du développement moderne

---
