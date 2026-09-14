import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom";

// hooks nécessaires  :
// useParams() pour lire l'id du dépôt depuis l'URL
// useNavigate() pour que le bouton × renvoie vers /depots
 
// Un hook React ne peut être appelé qu'au premier niveau du corps du composant, jamais à l'intérieur d'une fonction, d'une condition, ou d'un autre hook comme useEffect. 

function UserBack() {
    const { id } = useParams()

    const [ historique , setHistorique ] = useState ([])

    useEffect(() => {
       
        // fetch des données du depot avec id, stocké dans un state

        const detailUser = async () => {
            try {
                const detailUser = await fetch(`http://localhost:3000/api/depots/${id}`)
                const data = await detailUser.json()
                setHistorique(data)
            }catch (err){
                console.error("❌ Erreur chargement historique utilisateur", err)
            }
        }
        detailUser()
    }, [id])

   const nomObjet = historique.objet || historique.libelle || historique.objet_libelle || "Objet sans nom";
    const dateDepot = historique.date_depot ? new Date(historique.date_depot).toLocaleDateString("fr-FR") : "N/C";
    const statut = historique.statut || historique.statut_objet || "N/C";
    const categorie = historique.categorie || historique.categorie_libelle || "Général";
    const poids = historique.poids ?? historique.poids_kg ?? 0;

    return (
        <div className="card">
            <Link to="/depots" className="btn-back">← Retour</Link>
            
            {/* 1. Titre direct au lieu d'une ligne "Objet :" */}
            <h2>{nomObjet}</h2>

            {/* 2. Grille d'informations directement visibles */}
            <div className="card-grid">
                <div>
                    <small>Catégorie</small>
                    <p><strong>{categorie}</strong></p>
                </div>

                <div>
                    <small>Statut</small>
                    <p><strong>{statut}</strong></p>
                </div>

                <div>
                    <small>Poids</small>
                    <p><strong>{poids} kg</strong></p>
                </div>

                <div>
                    <small>Date de dépôt</small>
                    <p><strong>{dateDepot}</strong></p>
                </div>
            </div>
        </div>
    );
}

export default UserBack;
