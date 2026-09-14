import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/personnes";
const DEPOT_URL = "http://localhost:3000/api/depots";

function Depot() {
  const navigate = useNavigate();

  const [personnes, setPersonnes] = useState([]);
  const [formulaire, setFormulaire] = useState({
    personne_id: "",
    date_depot: "",
    type: "",
  });

  useEffect(() => {
    const recupPersonnes = async () => {
      try {
        const reponse = await fetch(API_URL);
        const result = await reponse.json();
        setPersonnes(result);
      } catch (error) {
        console.log("❌ Erreur chargement personnes", error.message);
      }
    };
    recupPersonnes();
  }, []);

  const formulaireRempli = (event) => {
    setFormulaire({
      ...formulaire,
      [event.target.name]: event.target.value,
    });
  };

  const envoyerFormulaire = async (event) => {
    event.preventDefault();

    console.log("Test");
    
    try {
      const reponse = await fetch(DEPOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulaire),
      });

      if (!reponse.ok) {
        const err = await reponse.json();
        console.log("Erreur:", err);
        return;
      }

      const nouveauDepot = await reponse.json();
      navigate(`/depots/${nouveauDepot.id}`);
    } catch (error) {
      console.log("Oups, erreur formulaire", error.message);
    }
  };

  return (
    <div>

      <form onSubmit={envoyerFormulaire}>
        <select
          name="personne_id"
          value={formulaire.personne_id}
          onChange={formulaireRempli}
        >
          <option value="">Choisir une donatrice</option>
          {personnes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom} {p.prenom}
            </option>
          ))}
        </select>
        <br />

        <input
          type="date"
          name="date_depot"
          value={formulaire.date_depot}
          onChange={formulaireRempli}
          />
        <br />

        <select name="type" value={formulaire.type} onChange={formulaireRempli}>
          <option value="">Choisir un type</option>
          <option value="boutique">Boutique</option>
          <option value="domicile">Domicile</option>
        </select>
        <br />

        <button type="submit">Créer le dépôt</button>
      </form>
    </div>
  );
}

export default Depot;