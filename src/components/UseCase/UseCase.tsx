import "./UseCase.scss";

const UseCase = () => {
	return (
		<div className="container" id="use-case">
			<div className="row">
				<h4>Admin</h4>
				<ul className="list-group">
					<li className="list-group-item">L'admin peut voir la liste des pizzas</li>
					<li className="list-group-item">L'admin peut modifier une pizza</li>
					<li className="list-group-item">L'admin peut supprimer une pizza</li>
					<li className="list-group-item">L'admin peut voir la liste de tous les utilisateurs ainsi que les autres administrateurs</li>
					<li className="list-group-item">L'admin peut créer un nouvel utilisateur</li>
					<li className="list-group-item">L'admin peut supprimer un utilisateur</li>
					<li className="list-group-item">L'admin peut modifier un utilisateur (Rôle)</li>
					<li className="list-group-item">L'admin peut voir la liste de toutes les commandes</li>
					<li className="list-group-item">L'admin peut supprimer une commande</li>
					<li className="list-group-item">L'admin peut modifier le status d'une commande</li>
					<li className="list-group-item">L'admin peut modifier certains paramètres</li>
					<li className="list-group-item">L'admin peut modifier ses informations depuis sont tableau de bord</li>
				</ul>
			</div>
			<br />
			<div>
				<h4>Utilisateur</h4>
				<ul className="list-group">
					<li className="list-group-item">L'utilisateur peut voir la liste de ces commandes</li>
					<li className="list-group-item">L'utilisateur peut s'inscrire</li>
					<li className="list-group-item">L'utilisateur peut se connecter</li>
					<li className="list-group-item">L'utilisateur peut modifier ses informations depuis sont tableau de bord</li>
					<li className="list-group-item">L'utilisateur peut ajouter une commande à son panier</li>
					<li className="list-group-item">L'utilisateur peut retirer une commande de son panier</li>
					<li className="list-group-item">L'utilisateur peut valider son panier</li>
				</ul>
			</div>
		</div>
	);
};

export default UseCase;
