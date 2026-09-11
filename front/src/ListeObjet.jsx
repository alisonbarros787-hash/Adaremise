import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

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
            <h2>Inventaire des objets</h2>
            <div className="card-grid">
                {objet.map(o => (
                    <div key={o.objet_id} className="card">
                    <p><Link to={`/objets/${o.objet_id}`}>{o.objet_libelle}</Link></p>
                        <p>{o.categorie_libelle}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListeObjets;