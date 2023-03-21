# PIZZAs

### PREREQUISITES

- **NodeJS**: *18.12.1*
- **Yarn**: *1.22.19*
- Or **NPM**: *8.19.2*

### STACK

ReactJS, Redux, Redux-Thunk, React-Router, Webpack, JS (ES6) - Typescript, NodeJS (ExpressJS), Mongoose, Mongodb, Axios, SCSS, Docker [...]

### Notes

-   **Espace admin**

    -   Mon espace (U) - Afficher les informations relatives au compte connecté
    -   Utilisateurs (CRUD) - Afficher la liste des utilisateurs
        -   Un admin peut créer un nouvel utilisateur admin
    -   Commandes (RUD) - Afficher la liste des commandes (Global)
    -   Pizza (CRUD) - Afficher la liste des pizzas
    -   Paramètres (RU) - Afficher la liste des paramètres

-   **Espace utilisateur**

    -   Mon espace (U) - Afficher les informations relatives au compte connecté
    -   Commandes (RUD) - Afficher la liste des commandes

-   **Espace public**
    -   Chaque utilisateur à besoin d'un compte pour pouvoir passer une commande
    -   Affichage des pizza (Nom, prix, image...)
        -   Ajouter au panier (S'il y a déja 4 (ou modifiable) commandes en cours, passer le status de la commande
            en 'waiting' avant l'enregistrement sinon le status est automatiquement mis en 'in_progress'"). Si le status est à 'waiting', l'admin à la possibilité de le modifier manuellement depuis son espace.
        -   Annule une commande (Depuis le panier)
        -   Valider le panier (Depuis le panier)


### Database

You can create a account on mongodb cloud, it's free !
> https://cloud.mongodb.com/

or use docker present in this repo:

```sh
cd docker
docker-compose up -d
```

### Setup

*Don't forget to rename .env.example to .env and update content*

- Create collections (**orders**,**pizzas**,**settings**,**users**)
- Add doc in **settings** collection with **key**: order_capacity_by_hour **value**: 6
- Update **MONGODB_URI / MONGODB_NAME** vars in .env file (<[rootDir]>/server/.env)
- Create root user with admin rôle manually in your users collection - See User model (<[rootDir]>/server/models/User.ts)
- Or you can also use UI interface (a button was added for the test)

#### Dev (client)

```sh
yarn start:client (or npm run start:client)
```

#### Dev (server)

```sh
yarn start:server (or npm run start:server)
```

#### Prod (client)

```sh
yarn build:client (or npm run build:client)
```

#### Prod (server)

```sh
yarn build:server (or npm run build:server)
```

### Lint and lint fix

```sh
yarn lint (or npm run lint)
yarn lint:fix (or npm run lint:fix)
```
