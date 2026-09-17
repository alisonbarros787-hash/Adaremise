import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <Link to="/">Accueil</Link>
      <Link to="/objets">Inventaire</Link>
      <Link to="/depots">Nouveau dépôt</Link>
      <Link to="/stats">Statistiques</Link>
    </nav>
  );
}

export default Nav;