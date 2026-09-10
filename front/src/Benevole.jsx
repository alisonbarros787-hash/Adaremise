import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const API_URL = "http://localhost:3000/api/personnes/benevoles"

// creation de l'identification de la bénévole, le changement de statut 

function Benevole() {
    //* useNavigate() renvoie une fonction permettant de changer d'URL
    const naviger = useNavigate()

    const btnClic = () => {
        //* changement de l'url vers /api/objets
        //*react-router-dom va afficher le composant associer a cette url
        naviger('/')
    
        return (
            <section> <Link to="/objets">Inventaire</Link>
                <Link to="/depots">Dépot</Link>
                <Link to="/stats">Statistique</Link>
            </section>
        )
    }

    const [benevole, setBenevole] = useState([]);
    // const [carte, setCarte] = useState("");

    useEffect(() => {
        const idBenevole = async () => {
            try {
                const reponse = await fetch(API_URL)
                const result = await reponse.json()
                setBenevole(result)
            } catch (error) {
                console.log("❌ Aie, Aie erreur", error.message)
            }
        }
        idBenevole()
    }, [])

    return (
        <div>
            <button onClick={btnClic}>Retour</button>
            {benevole.map(b => (
                <div key={b.id}>
                    {b.nom} {b.prenom}
                </div>
            ))}
        </div>
    )
}


export default Benevole;