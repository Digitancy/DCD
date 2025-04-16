# CompDigi - Diagnostic de Compétences Digitales

## Fiche Projet

### Description
CompDigi est une application web permettant aux entreprises d'évaluer leurs compétences digitales à travers différents univers (Transformation Digitale, Agilité, Innovation, etc.). L'application guide les utilisateurs à travers un diagnostic personnalisé et fournit des résultats détaillés avec une interface moderne et intuitive.

### Technologies Utilisées
- **Frontend**
  - Next.js 14 (App Router) - Framework React pour le rendu côté serveur et client
  - TypeScript - Typage statique pour une meilleure maintenabilité
  - Tailwind CSS - Framework CSS utilitaire pour un design responsive
  - Zustand - Gestion d'état légère et performante
  - Framer Motion - Bibliothèque d'animations React
  - Lucide Icons - Pack d'icônes modernes et personnalisables

- **Performance & SEO**
  - Optimisation des images avec next/image
  - Métadonnées dynamiques pour le SEO
  - Hydration progressive
  - Code splitting automatique

- **Développement**
  - ESLint - Linting du code
  - Prettier - Formatage du code
  - Husky - Hooks Git pour la qualité du code
  - Jest & React Testing Library - Tests unitaires et d'intégration

- **Déploiement**
  - Vercel - Plateforme de déploiement optimisée pour Next.js
  - CI/CD automatisé
  - Environnements de développement, staging et production

### Architecture de la Base de Données

#### Base de Données (Firebase Firestore)
- **Collections**
  - `admins` : Gestion des administrateurs
    - Authentification sécurisée
    - Informations de profil (id, email, nom)
    - Horodatage (création, mise à jour)
  - `results` : Stockage des diagnostics
    - Score global
    - Réponses détaillées (JSON)
    - Informations sur l'entreprise
    - Liaison avec l'utilisateur
  - `users` : Profils utilisateurs
    - Informations de base (id, email, nom)
    - Relation avec les résultats
    - Horodatage (création, mise à jour)
- **Sécurité**
  - Règles Firestore configurées
  - Contrôle d'accès par collection
  - Authentification Firebase

## Fonctionnalités Implémentées

### Interface Utilisateur
- [x] Design responsive et moderne
- [x] Barre de navigation fixe avec logo Digitancy
- [x] Animations fluides et transitions
- [x] Effets visuels (blur, gradients, ombres)
- [x] Composants UI réutilisables
- [x] Indicateurs de progression
- [x] Interface adaptative mobile/desktop

### Diagnostic
- [x] Formulaire de diagnostic en plusieurs étapes
- [x] 6 univers d'évaluation :
  - Transformation Digitale
  - Agilité
  - Innovation
  - Expérience Client
  - Technologie
  - Data
- [x] 4 profils d'évaluation :
  - Leaders
  - Managers
  - Équipes Spécialisées
  - Collaborateurs
- [x] Gestion des réponses utilisateur
- [x] Système de progression par étapes
- [x] Sauvegarde de l'état du diagnostic

### Résultats
- [x] Affichage des résultats par univers
- [x] Indicateurs de niveau (Débutant à Expert)
- [x] Visualisation du progrès
- [x] Interface de résultats claire et intuitive

## Améliorations Planifiées

### Fonctionnalités
- [ ] Système de sauvegarde des diagnostics
- [ ] Export PDF personnalisé
- [ ] Comparaison entre plusieurs diagnostics
- [ ] Système de recommandations basé sur les résultats
- [ ] Historique des diagnostics

### Visualisation des Résultats
- [ ] Graphiques radar par univers
- [ ] Visualisations comparatives
- [ ] Tableau de bord personnalisé
- [ ] Benchmarks par secteur
- [ ] Plans d'action personnalisés

 [] Graphiques radar par univers
  - Représentation visuelle des scores pour chaque univers (Transformation Digitale, Agilité, Innovation, etc.)
  - Comparaison des niveaux actuels vs objectifs
  - Identification rapide des forces et axes d'amélioration
  - Visualisation par profil (Leaders, Managers, Équipes spécialisées, Collaborateurs)

- [ ] Visualisations comparatives
  - Analyse comparative entre différents départements
  - Évolution des scores dans le temps
  - Comparaison avec les moyennes du secteur
  - Visualisation des écarts entre profils

- [ ] Tableau de bord personnalisé
  - Vue d'ensemble interactive des résultats
  - Filtres dynamiques par univers et profils
  - Indicateurs clés de performance (KPIs)
  - Export des données et rapports personnalisés
  - Suivi des objectifs et des progrès


- [ ] Plans d'action personnalisés
  - Recommandations prioritaires par univers
  - Parcours de formation adaptés aux profils
  - Objectifs SMART et jalons clés
  - Suivi de la mise en œuvre des actions
  - Mesure de l'impact des actions entreprises

### Expérience Utilisateur
- [ ] Mode sombre/clair
- [ ] Filtres de résultats avancés
- [ ] Système de partage des résultats
- [ ] Notifications de progression
- [ ] Commentaires et annotations

### Performance
- [ ] Optimisation des images et assets
- [ ] Mise en cache des résultats
- [ ] Amélioration des temps de chargement
- [ ] Tests de performance
- [ ] Optimisation mobile

## Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Construction pour la production
npm run build

# Démarrage en production
npm start
```

## Structure du Projet

```
app/
├── components/     # Composants réutilisables
├── data/          # Données statiques (questions, etc.)
├── diagnostic/    # Pages du diagnostic
├── store/         # État global (Zustand)
└── styles/        # Styles globaux
```

## Contribution
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
