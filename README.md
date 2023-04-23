# PIZZA's

### PREREQUISITES

- **NodeJS**: *18.12.1*
- **Yarn**: *1.22.19*

### STACK

ReactJS, Redux, Redux-Thunk, React-Router, Webpack, Axios, Typescript / JS (ES6), SCSS, Bootstrap v5.2.3, Node (ExpressJS), Mongoose, Mongodb, Docker...

### Notes

-   **Espace admin**

    - My Space (U) - View information about your account
    - Users (CRUD) - Display the list of users
        - An admin can create a new admin user
    - Commands (RUD) - Display the list of commands (Global)
    - Pizza (CRUD) - Display the list of pizzas
    - Parameters (RU) - Display the list of parameters

- **Espace utilisateur**

    - My Space (U) - View information about your account
    - Orders (RUD) - View the list of orders

- **Espace public**
    - Each user needs an account to place an order
    - Display of pizza (Name, price, image...)
        - Add to cart (If there are already 4 (or changeable) orders in progress, set the status of the order to 'waiting' before saving. in 'waiting' before the registration otherwise the status is automatically set to 'in_progress'"). If the status is set to 'waiting', the admin has the possibility to modify it manually from his space.
        - Cancel an order (From the cart)
        - Validate the basket (From the basket)


### Database

You can create a account on mongodb cloud, it's free !
> https://cloud.mongodb.com/

or use docker present in this repo:

```sh
cd docker
docker-compose up -d
```

##### Structures (To create manually pizza in MongoDB from MongoShell or from UI)

```json
{
	"pizza": {
		_id: ObjectId()
		name: String
		price: String
		qty: Int32
		description: String
		img_path: String
		created_at: Date
		updated_at: Date
	}
}
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
yarn start:client
```

#### Dev (server)

```sh
yarn start:server
```

#### Prod (client)

```sh
yarn build:client
```

#### Prod (server)

```sh
yarn build:server
```

### Lint and lint fix

```sh
yarn lint
yarn lint:fix
```
