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

    return (
        <div className="historik">
          {/* <button onClick={() => navigate('/')}>X</button> */}
          <Link to="/depots">X</Link>
            
             <p>Objet : {historique.objet}</p>
             <p>Date de dépot : {historique.date_depot}</p>
             <p>Status de l'objet : {historique.statut}</p>
             <p>Catégorie : {historique.categorie}</p>
             <p>Poids : {historique.poids}</p>
        </div>
      
    )

 }

export default UserBack
