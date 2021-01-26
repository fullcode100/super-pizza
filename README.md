# Super Pizza

## STACK

ReactJS, Redux, Redux-Thunk, React-Router, Typescript, NodeJS (ExpressJS), Mongoose, Axios, SCSS, [...]

## LIVE DEMO

> https://spizz.herokuapp.com/

## Identifications

### Admin

-   Admin:
    -   Identifiant: admin@sp.com
    -   Mot de passe: root

### Utilisateur

-   User:
    -   Identifiant: user@mail.com
    -   Mot de passe: root

## Base de données

> https://cloud.mongodb.com/

DATABASE_SCREEN: https://drive.google.com/file/d/1X8Vnb_ZMiI2OATm6C-sYE-q-nwmDmPz9/view?usp=sharing

## Quelques notes

-   Espace admin

    -   Mon espace (U) - Afficher les informations relatives au compte connecté
    -   Utilisateurs (CRUD) - Afficher la liste des utilisateurs
        -   Un admin peut créer un nouvel utilisateur admin
    -   Commandes (RUD) - Afficher la liste des commandes (Global)
    -   Pizza (CRUD) - Afficher la liste des pizzas
    -   Paramètres (RU) - Afficher la liste des paramètres

-   Espace utilisateur

    -   Mon espace (U) - Afficher les informations relatives au compte connecté
    -   Commandes (RUD) - Afficher la liste des commandes

-   Espace public
    -   Chaque utilisateur à besoin d'un compte pour pouvoir passer une commande
    -   Affichage des pizza (Nom, prix, image...)
        -   Ajouter au panier (S'il y a déja 4 (ou modifiable) commandes en cours, passer le status de la commande
            en 'waiting' avant l'enregistrement sinon le status est automatiquement mis en 'in_progress'"). Si le status est à 'waiting', l'admin à la possibilité de le modifier manuellement depuis son espace.
        -   Annule une commande (Depuis le panier)
        -   Valider le panier (Depuis le panier)

## Project setup

#### Dev (client)

```
yarn dev:client (or npm run)
```

#### Dev (server)

```
yarn dev:server (or npm run)
```

Don't forget to connect your mongo database before to start !!!

#### Prod (client)

```
yarn build:client (or npm run)
```

#### Prod (server)

```
yarn build:server (or npm run)
```

Don't forget to connect your mongo database before to start !!!

### Lints and fixes files

```
yarn lint (or npm run)
yarn lint:fix (or npm run)
```
