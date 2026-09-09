import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/personnes"

// creation de l'identification de la bénévole, le changement de statut 

function Benevole() {
    const [benevole , setBenevole] = useState([]);
    // const [carte, setCarte] = useState("");

    
    useEffect(() => {
    const idBenevole = async () => {
        try{
        const reponse = await fetch(API_URL)
        const result = await reponse.json()
        setBenevole(result)
        }catch (error){
            console.log("❌ Aie, Aie erreur", error.message)
    
        }
    }
    idBenevole()
}, [])

 return (
    <div>
      {benevole.map(b => (
        <div>
            {b.nom}
            {b.prenom}
        </div>
      ))}
    </div> 
 
)

}

export default Benevole;