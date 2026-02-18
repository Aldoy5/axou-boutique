# AXOU BOUTIQUE — Beauté, Bijoux & Pyjamas

Boutique en ligne premium proposant des produits de beauté, des bijoux et des pyjamas de qualité supérieure.

## 🌟 Aperçu

AXOU BOUTIQUE est une application web e-commerce moderne conçue pour offrir une expérience d'achat fluide et élégante. Le projet utilise une architecture légère basée sur du JavaScript pur (Vanilla JS) avec une intégration Firebase pour la gestion des données et de l'authentification.

## 🚀 Fonctionnalités

- **Catalogue de Produits** : Navigation intuitive à travers différentes catégories (Beauté, Bijoux, Pyjamas).
- **Détails des Produits** : Pages dédiées avec descriptions détaillées et images.
- **Panier d'Achat** : Gestion dynamique du panier avec persistance locale.
- **Processus de Commande (Checkout)** : Expérience de paiement simplifiée.
- **Espace Administrateur** : Interface de gestion pour les produits et les commandes.
- **Authentification** : Système de connexion sécurisé via Firebase Auth.
- **Base de Données en Temps Réel** : Synchronisation instantanée des données avec Firebase Realtime Database.

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+ Module)
- **Design System** : CSS personnalisé (Vanilla CSS) avec polices Google Fonts (Playfair Display & Inter)
- **Backend as a Service (BaaS)** : [Firebase](https://firebase.google.com/)
  - Authentication
  - Realtime Database
- **Routage** : Système de routage personnalisé côté client.

## 📁 Structure du Projet

```text
axou-boutique/
├── css/                # Feuilles de style (index.css)
├── js/
│   ├── components/     # Composants réutilisables (Navbar, Footer)
│   ├── pages/          # Logique des différentes pages (Home, Catalog, Admin, etc.)
│   ├── app.js          # Point d'entrée principal
│   ├── data.js          # Scripts de données initiaux
│   ├── router.js       # Gestion du routage
│   └── store.js        # Gestion de l'état global
├── index.html          # Structure HTML principale et config Firebase
├── package.json        # Dépendances Node.js
└── README.md           # Documentation du projet
```

## ⚙️ Installation et Configuration

1. **Cloner le dépôt** :
   ```bash
   git clone <url-du-depot>
   cd axou-boutique
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration Firebase** :
   Le projet utilise un fichier de configuration externe pour sécuriser les clés API.
   - Copiez le fichier `js/firebase-config.example.js` vers un nouveau fichier nommé `js/firebase-config.js`.
   - Remplissez `js/firebase-config.js` avec vos propres identifiants Firebase.
   - **Note** : Le fichier `js/firebase-config.js` est ignoré par Git pour éviter de publier vos clés secrètes.

## 💻 Développement

Pour lancer le projet localement, vous pouvez utiliser n'importe quel serveur local (comme Live Server sur VS Code) pour servir le fichier `index.html`.

```bash
# Exemple avec un serveur simple (si installé)
npx serve .
```

---
*Développé avec passion pour AXOU BOUTIQUE.*
