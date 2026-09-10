import { useState, useEffect } from 'react';
import FicheObjet from './FicheObjet.jsx';

const API_URL = "http://localhost:3000/api/objets";

function ListeObjet() {
  const [objet, setObjet] = useState([]);
  const [objetSelectionne, setObjetSelectionne] = useState(null);

  useEffect(() => {
    const recupObjets = async () => {
      try {
        const reponse = await fetch(API_URL);
        const result = await reponse.json();
        setObjet(result);
      } catch (error) {
        console.log("❌ Aie, Aie erreur", error.message);
      }
    };
    recupObjets();
  }, []);

  // Vue détaillée avec retour
  if (objetSelectionne) {
    return (
      <div className="section objets-section">
        <button 
          className="btn-retour" 
          onClick={() => setObjetSelectionne(null)}
        >
          ← Retour à l'inventaire
        </button>
        <FicheObjet objet={objetSelectionne} />
      </div>
    );
  }

  // Vue grille avec les 3 informations
  return (
    <div className="section objets-section">
      <h2>Inventaire</h2>
      <div className="card-grid">
        {objet.map((o) => (
          <div 
            className="card objet-card" 
            key={o.id || `${o.objet_libelle}--${o.categorie_libelle}`}
            onClick={() => setObjetSelectionne(o)}
          >
            <p className="card-title">{o.objet_libelle || o.libelle}</p>
            <span className="badge">{o.categorie_libelle}</span>
            <div className="objet-benevole">
              👤 {o.benevole_nom ? o.benevole_nom : (o.prenom ? `${o.prenom} ${o.nom}` : "Bénévole non assigné")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeObjet;