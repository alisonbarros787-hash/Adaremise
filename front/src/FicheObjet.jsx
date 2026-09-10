import { useState, useEffect } from 'react';

function FicheObjet({ objetId, onRetour }) {
  const [objet, setObjet] = useState(null);

  useEffect(() => {
    const fetchObjetDetails = async () => {
      try {
        const reponse = await fetch(`http://localhost:3000/api/objets`);
        const data = await reponse.json();
        setObjet(data);
      } catch (error) {
        console.error("Erreur chargement fiche objet :", error);
      }
    };

    if (objetId) fetchObjetDetails();
  }, [objetId]);

  if (!objet) return <div>Chargement de la fiche...</div>;

  return (
    <div className="fiche-container">
      <button className="btn-retour" onClick={onRetour}>← Retour</button>
      <h2>{objet.objet_libelle || objet.libelle}</h2>
      {/* Affichage des champs de la BDD */}
      <p>Poids : {objet.poids_kg} kg</p>
      <p>Statut : {objet.statut}</p>
      <p>Prix : {objet.prix} €</p>
    </div>
  );
}

export default FicheObjet;