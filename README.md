# AgriCam - Interface Utilisateur (Frontend)

Bienvenue sur le dépôt frontend d'**AgriCam**, un projet de fin d'études conçu pour moderniser et optimiser la chaîne de valeur agricole au Cameroun (mise en relation producteurs / éleveurs et acheteurs).

Ce dépôt contient le code source de l'interface utilisateur. Il gère la navigation, l'affichage des tableaux de bord et l'expérience visuelle globale de la plateforme, et communique avec les microservices du dépôt backend via des appels API REST.

## Stack technique

- **React 18** + **Vite 5**
- **React Router** pour la navigation
- **Recharts** pour les graphiques des tableaux de bord
- **Lucide React** pour les icônes
- **ESLint** pour le linting

## Prérequis

- Node.js (version 18 ou supérieure recommandée)
- npm

## Installation

```bash
npm install
```

## Configuration

Le frontend communique avec les différents microservices backend (auth, utilisateur, produit, message, signalement, avis, certification, paiement, commande, notification), chacun exposé sur son propre port.

1. Copier le fichier d'exemple vers un fichier `.env` :

   ```bash
   cp .env.example .env
   ```

2. Adapter les URLs des services dans `.env` selon votre environnement (local ou déployé). Aucune modification du code source n'est nécessaire : il suffit de changer ces URLs.

## Lancer le projet en développement

```bash
npm run dev
```

L'application est servie par défaut sur `http://localhost:3000`.

## Scripts disponibles

| Commande          | Description                                      |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Démarre le serveur de développement Vite          |
| `npm run build`   | Génère la version de production                   |
| `npm run preview` | Prévisualise la version de production en local     |
| `npm run lint`    | Vérifie le code avec ESLint                        |

## Structure du projet

```
src/
├── components/   # Pages et composants React (dashboards, catalogue, profils, etc.)
├── hooks/        # Hooks React personnalisés
└── services/api/ # Clients API pour chaque microservice backend
```

## Dépôt lié

Le backend (microservices Spring Boot) se trouve dans le dépôt : [projetfinann-e](https://github.com/borelleG/projetfinann-e)

## Équipe

Projet réalisé dans le cadre du travail de fin d'études Licence informatique UDs 2026
