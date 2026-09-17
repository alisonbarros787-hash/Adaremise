import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/personnes/";
const DEPOT_URL = "http://localhost:3000/api/depots";
const CATEGORIE_URL = "http://localhost:3000/api/categories";

function Depot() {
  // ** ================================================ POUR FAIRE LE DEPOT (Formulaire 1)==============

  const [personnes, setPersonnes] = useState([]);
  const [formulaire, setFormulaire] = useState({
    personne_id: "",
    date_depot: "",
    type: "",
  });
  const [depotId, setDepotId] = useState(null);

  // ** ================================================== POUR AJOUTER UN OBJET (Formulaire 2)==============

  const [categories, setCategories] = useState([]);
  const [objets, setObjets] = useState([]);
  const [formulaireObjet, setFormulaireObjet] = useState({
    libelle: "",
    poids_kg: "",
    etat_arrivee: "",
    categorie_id: "",
  });

  // =================================================== POUR UN MESSAGE D ERREUR =====================
  const [messageRemplir, setMessageRemplir] = useState("");


// ** =================================LES DONNES POUR LES SELECT ===== ============ 
  useEffect(() => {
    const recupDonnees = async () => {
      try {
        // DONNEES POUR LE SELECT DE BENEVOLES 
        const repPersonnes = await fetch(API_URL);
        setPersonnes(await repPersonnes.json());
        // DONNES POUR LE SELECT DE CATEGORIES
        const repCategories = await fetch(CATEGORIE_URL);
        setCategories(await repCategories.json());
      } catch (error) {
        console.log("AIE, Erreur chargement", error.message);
      }
    };
    recupDonnees();
  }, []);


// ** =====================================================================LES EVENT HANDLERS (GESTIONER LES EVENTS)=============================================
// Le spread copie les propriétés d'un objet dans un nouvel objet et les infos reste intactes si tu les as pas touché
const formulaireRempli = (event) => {
    setFormulaire({
      ...formulaire,
      [event.target.name]: event.target.value,
    });
  };

  // Le spread copie les propriétés d'un objet dans un nouvel objet et les infos reste intactes si tu les as pas touché
  const formulaireObjetRempli = (event) => {
    setFormulaireObjet({
      ...formulaireObjet,
      [event.target.name]: event.target.value,
      // On récupère le nom du champ qui a été modifié et on lui donne la nouvelle valeur
    });
  };


  // ** =====================

  const envoyerFormulaire = async (event) => {

    // si un form est envoye le navigateur recharge toute la page... on dit ne fais pas ça
    event.preventDefault();

    try {
      // la petition. On veut envoyer le formulaire au backend avec fetch en format JSON
      const reponse = await fetch(DEPOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulaire),
        // ca passe d'objet a JSON
      });

      if (!reponse.ok) {
        setMessageRemplir("Oups, tous les champs sont obligatoires");
        return;
      }
      // ============================ POUR AJOUTER LE NOUVEAU DEPOT AVEC SON ID==========================
      const nouveauDepot = await reponse.json();
      setDepotId(nouveauDepot.id);
      // Pour avoir le depot qu'on a cree que cest ici quon obtien l'ID
      setMessageRemplir("");
    } catch (error) {
      console.log("Oups, erreur formulaire", error.message);
    }
  };



  // ** ===========================POUR CREER UN LOBJET AVEC NOTRE ID
  const envoyerObjet = async (event) => {
    // le navigateur ne recharge pas la page quand on envoie le formulaire
    event.preventDefault();

    try {
      // On récupère les données JSON envoyées par le backend
        const reponse = await fetch(`${DEPOT_URL}/${depotId}/objet`, {
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

      // =================================== POUR AJOUTER LOBJET A LA LISTE==========================
      const nouvelObjet = await reponse.json();
      // On récupère les données JSON envoyées par le backend dans la réponse
      setObjets([...objets, nouvelObjet]);
      // Spread pour copier tous les objets présents et ajoute le nouvel objet à la fin

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


  // *** [[[[[[[[[[[[[[[[[[    LES     RENDERS               ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
  return (

  // Cest le conditionels avec loperateur &&
    <div>
      {!depotId && (
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

          <select
            name="type"
            value={formulaire.type}
            onChange={formulaireRempli}
          >
            <option value="">Choisir un type</option>
            <option value="boutique">Boutique</option>
            <option value="domicile">Domicile</option>
          </select>
          <br />

          {messageRemplir && <p className="message-erreur">{messageRemplir}</p>}

          <button type="submit">Créer le dépôt</button>
        </form>
      )}

      {depotId && (
        <>
          <h2>Depot</h2>

          <h3>Ajouter un article</h3>
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
              <option value="hors_service">Cassé</option>
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

            {messageRemplir && (
              <p className="message-erreur">{messageRemplir}</p>
            )}
            <button type="submit">Ajouter l'article</button>
          </form>
          <ul>
            {objets.map((o) => (
              <li key={o.id}>
                {o.libelle} — {o.poids_kg} kg — {o.statut}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Depot;
