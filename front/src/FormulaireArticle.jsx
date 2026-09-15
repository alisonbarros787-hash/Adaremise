import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DEPOT_URL = "http://localhost:3000/api/depots";
const CATEGORIE_URL = "http://localhost:3000/api/categories";

function FormulaireArticle() {
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [objets, setObjets] = useState([]);
  const [formulaireObjet, setFormulaireObjet] = useState({
    libelle: "",
    poids_kg: "",
    etat_arrivee: "",
    categorie_id: "",
  });
  const [messageRemplir, setMessageRemplir] = useState("");

  useEffect(() => {
    const recupCategories = async () => {
      try {
        const reponse = await fetch(CATEGORIE_URL);
        setCategories(await reponse.json());
      } catch (error) {
        console.log("AIE, Erreur chargement catégories", error.message);
      }
    };
    recupCategories();
  }, []);

  const formulaireObjetRempli = (event) => {
    setFormulaireObjet({
      ...formulaireObjet,
      [event.target.name]: event.target.value,
    });
  };

  const envoyerObjet = async (event) => {
    event.preventDefault();

    try {
      const reponse = await fetch(`${DEPOT_URL}/${id}/objet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulaireObjet),
      });

      if (!reponse.ok) {
        const err = await reponse.json();
        console.log("Erreur:", err);
        setMessageRemplir("Oups, tous les champs sont obligatoires");
        return;
      }

      const nouvelObjet = await reponse.json();
      setObjets([...objets, nouvelObjet]);

      setFormulaireObjet({
        libelle: "",
        poids_kg: "",
        etat_arrivee: "",
        categorie_id: "",
      });
      setMessageRemplir("");
    } catch (error) {
      console.log("Oups, erreur objet", error.message);
    }
  };

  return (
    <div>

      <h2>Ajouter des objets au dépôt</h2>

      <form onSubmit={envoyerObjet}>
        <input
          type="text"
          name="libelle"
          placeholder="Nom de l'objet"
          value={formulaireObjet.libelle}
          onChange={formulaireObjetRempli}
          required
        />
        <br />

        <input
          type="number"
          step="0.01"
          name="poids_kg"
          placeholder="Poids (kg)"
          value={formulaireObjet.poids_kg}
          onChange={formulaireObjetRempli}
          required
        />
        <br />

        <select
          name="etat_arrivee"
          value={formulaireObjet.etat_arrivee}
          onChange={formulaireObjetRempli}
          required
        >
          <option value="">État à l'arrivée</option>
          <option value="bon_etat">Bon état</option>
          <option value="casse">Cassé</option>
          <option value="a_reparer">À réparer</option>
        </select>
        <br />

        <select
          name="categorie_id"
          value={formulaireObjet.categorie_id}
          onChange={formulaireObjetRempli}
          required
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.libelle}
            </option>
          ))}
        </select>
        <br />

        {messageRemplir && <p className="message-erreur">{messageRemplir}</p>}

        <button type="submit">Ajouter au dépôt</button>
      </form>

      <h3>Articles ajoutés</h3>
      <ul>
        {objets.map((o) => (
          <li key={o.id}>
            {o.libelle} — {o.poids_kg} kg — {o.statut}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FormulaireArticle;