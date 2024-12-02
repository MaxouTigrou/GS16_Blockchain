# Projet Blockchain Logs - Gestion des Logs sur Ethereum avec Truffle, Ganache et React

Ce projet permet de démontrer l'utilisation des **smart contracts** et de la **blockchain** pour gérer des logs de manière immuable et décentralisée. Il utilise **Truffle** pour le déploiement des contrats et **React** pour l'interface utilisateur.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Node.js](https://nodejs.org/en/) (version 14.x ou plus)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)
- [Ganache](https://www.trufflesuite.com/ganache) (pour un réseau blockchain local)
- [MetaMask](https://metamask.io/) (extension de navigateur pour la gestion de portefeuille Ethereum)

## Étapes d'installation

### 1. Cloner le projet

Cloner ce projet sur votre machine locale avec la commande suivante :

```bash
git clone https://github.com/MaxouTigrou/GS16_Blockchain.git
cd GS16_Blockchain
```
### 2. Cloner le projet

Utilisez cette commande pour compile le smartcontract et le migrer sur le réseau blockchain associé à ganache

```bash
truffle compile
truffle migrate --network development
```

### 3. Lancer l'application frontend
```bash
cd frontend
npm start
```

