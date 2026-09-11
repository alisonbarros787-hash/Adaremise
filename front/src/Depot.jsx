import { useState } from "react";



function Depot() {
  const [formulaire, setFormulaire] = useState({
    personne_id: "",
    date_depot: "",
    type: "",
    libelle: "",
    poids_kg: "",
    etat_arrivee: "",
    categorie_id: "",
  });

  const formulaireRempli = (event) => {
    setFormulaire({
      ...formulaire,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form>
      <input
        type="text"
        name="libelle"
        value={formulaire.libelle}
        onChange={formulaireRempli}
      />
      <br></br>
      <input
        type="number"
        name="poids_kg"
        value={formulaire.poids_kg}
        onChange={formulaireRempli}
      />
      <br></br>
      <select
        name="categorie_id"
        value={formulaire.categorie_id}
        onChange={formulaireRempli}
      >
        <option value="">Choisi une categorie</option>
        <option value="1">Mobilier</option>
         <option value="2">Électroménager</option>
          <option value="3">Vaisselle</option>
           <option value="4">Textile</option>
           <option value="5">Livres</option>
           <option value="6">Jouets</option>
           <option value="7">Outillage</option>
           <option value="8">Décoration</option>
      </select>
      <br></br>
      <input
        type="date"
        name="date_depot"
        value={formulaire.date_depot}
        onChange={formulaireRempli}
      />
    </form>
  );
}

export default Depot;
