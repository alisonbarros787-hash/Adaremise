import { useState, useEffect } from 'react';

const API_URL = "http://localhost:3000/api/objets"

// creation de l'identification de la bénévole, le changement de statut 

function ListeObjets() {
    const [objet, setobjet] = useState([]);
    // const [carte, setCarte] = useState("");

    useEffect(() => {
    const recupObjets = async () => {
        try{
        const reponse = await fetch(API_URL)
        const result = await reponse.json()
        setobjet(result)
        }catch (error){
            console.log("❌ Aie, Aie erreur", error.message)
    
        }
    }
    recupObjets()
}, [])

 return (
    <div>
      {objet.map(o => (
        <div>
            {o.objet_libelle} {o.categorie_libelle}
        </div>
      ))}
    </div> 
 
)
}

export default ListeObjets;