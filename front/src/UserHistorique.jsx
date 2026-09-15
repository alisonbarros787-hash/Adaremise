import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// hooks nécessaires  :
// useParams() pour lire l'id du dépôt depuis l'URL
// useNavigate() pour que le bouton × renvoie vers /depots

// Un hook React ne peut être appelé qu'au premier niveau du corps du composant, jamais à l'intérieur d'une fonction, d'une condition, ou d'un autre hook comme useEffect.

function UserBack() {
  const { id } = useParams();

  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    // fetch des données du depot avec id, stocké dans un state

    const detailUser = async () => {
      try {
        const detailUser = await fetch(
          `http://localhost:3000/api/depots/${id}`,
        );
        const data = await detailUser.json();
        setHistorique(data);
      } catch (err) {
        console.error("❌ Erreur chargement historique utilisateur", err);
      }
    };
    detailUser();
  }, [id]);

  console.log("HISTORIQUE ENTIER:", historique);
  console.log("LE PREMIER 0:", historique[0]);
  console.log("HISTORIQUE LIBELLE:", historique.libelle);
  console.log("TEST SI BON:", historique[0] && historique[0].libelle);

  // La 1ère ligne du tableau = les infos du dépôt + la donatrice
  const depot = historique[0];
  if(!depot) return <p>Chargement</p>
  // const nomObjet = historique.objet || historique.libelle || historique.objet_libelle || "Objet sans nom";
  const nomObjet = depot.objet_libelle || "Objet s/ nom";
  // const dateDepot = historique.date_depot ? new Date(historique.date_depot).toLocaleDateString("fr-FR") : "N/C";
  const dateDepot = depot.date_depot
    ? new Date(depot.date_depot).toLocaleDateString("fr-FR")
    : "N/C";
  // const statut = historique.statut || historique.statut_objet || "N/C";
  const statut = depot.statut || "N/C";
  // const categorie = historique.categorie || historique.categorie_libelle || " ";
  const categorie = depot.categorie_libelle || " ";
  // const poids = historique.poids ?? historique.poids_kg ?? 0;
  const poids = depot.poids_kg ?? 0;

  return (
    <div className="card">
      <Link to="/depots" className="btn-back">
        ← Retour
      </Link>

      {/* 1. Titre direct au lieu d'une ligne "Objet :" */}
      <h2>{nomObjet}</h2>

      {/* 2. Grille d'informations directement visibles */}
      <div className="card-grid">
        <div>
          <small>Catégorie</small>
          <p>
            <strong>{categorie}</strong>
          </p>
        </div>

        <div>
          <small>Statut</small>
          <p>
            <strong>{statut}</strong>
          </p>
        </div>

        <div>
          <small>Poids</small>
          <p>
            <strong>{poids} kg</strong>
          </p>
        </div>

        <div>
          <small>Date de dépôt</small>
          <p>
            <strong>{dateDepot}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserBack;
