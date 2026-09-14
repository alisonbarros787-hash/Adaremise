import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'
https://github.com/alisonbarros787-hash/Adaremise/pull/18/conflict?name=front%252Fsrc%252FListeObjet.jsx&ancestor_oid=5ed5470f66d2580625e9a065f1ba7773186a1cde&base_oid=bd6f0ca7ff633b86c90f72613b18a3c7301e5a8c&head_oid=463d869c1bbac3958ad7ffe6699da43e15142b57<<<<<<< FiltreStat
import FilterCategorie from './Filters.jsx'
import FilterStatus from './FiltreStatus.jsx'; // import du composant enfant


const API_URL = "http://localhost:3000/api/objets"


function ListeObjets() {
    const [objet, setobjet] = useState([]);


    // Nouvel état : stocke la catégorie actuellement choisie dans le filtre
    // "all" = aucun filtre actif, on affiche tous les objets
    const [selecteCategorie, setSelecteCategorie] = useState("all");


const [selectStatus, setSelectStatus] = useState("all")

    useEffect(() => {
        const recupObjets = async () => {
            try {
                const reponse = await fetch(API_URL)
                const result = await reponse.json()
                setobjet(result)
            } catch (error) {
                console.log("❌ Aie, Aie erreur", error.message)
            }
        }
        recupObjets()
    }, [])

    // Calcule la liste des catégories disponibles à partir des objets reçus
    // useMemo évite de refaire ce calcul à chaque re-render, seulement quand "objet" change
    const categories = useMemo(() => {
        const dory = new Set(objet.map((o) => o.categorie_libelle)) // Set = élimine les doublons
        return ["all", ...dory] // on transforme le Set en tableau, avec "all" en première position
    }, [objet])


    // Calcule la liste d'objets à afficher, filtrée selon la catégorie sélectionnée
        const stat = useMemo(() => {
        const objetStat = new Set(objet.map((o) => o.statut))
        return ["all", ...objetStat]
    }, [objet])


        const objetsFiltres = useMemo(() => {
        return objet
            .filter((o) => selecteCategorie === "all" || o.categorie_libelle === selecteCategorie)
            .filter((o) => selectStatus === "all" || o.statut === selectStatus)
    }, [selecteCategorie, selectStatus, objet])
    return (
        <div>
            <h2>Inventaire des objets</h2>

            {/* Composant enfant distinct : il reçoit juste les catégories
                et une fonction pour signaler un changement de sélection */}
            <FilterCategorie
                categories={categories}
                selecteCategorie={selecteCategorie}
                onCategorieChange={setSelecteCategorie}
            />
             {/*👉 ICI,  <FilterStatus ... /> */}
             <FilterStatus
              statusFilter={stat}
              selectStatus={selectStatus}
              onChangeStatus={setSelectStatus}
              />


            <div className="card-grid">
                {/* On affiche objetsFiltres (résultat filtré) au lieu de objet (liste brute) */}
                {objetsFiltres.map(o => (
                    <div key={o.objet_id} className="card">
                        <p><Link to={`/objets/${o.objet_id}`}>{o.objet_libelle}</Link></p>
                        <p>{o.categorie_libelle}</p>
                        <p>{o.statut_objet}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default ListeObjets;

