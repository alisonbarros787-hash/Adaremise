import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

function FicheObjet() {
    // useParams() lit l'id présent dans l'URL (ex: /objets/5 -> id = "5")
    const { id } = useParams()

    // useNavigate() est appelé ici, à l'intérieur du composant
    const navigate = useNavigate()

    const [objet, setObjet] = useState(null)

    useEffect(() => {
        const fetchObjetDetails = async () => {
            try {
                // Appel de la route qui renvoie UN SEUL objet, celui correspondant à id
                const reponse = await fetch(`http://localhost:3000/api/objets/${id}`)
                const data = await reponse.json()
                setObjet(data)
            } catch (error) {
                console.error("Erreur chargement fiche objet :", error)
            }
        }

        if (id) fetchObjetDetails()
    }, [id])

    if (!objet) return <div>Chargement de la fiche...</div>

    return (
        <div className="fiche-container">
            {/* Un seul gestionnaire de clic : navigate remplace onRetour */}
            <button className="btn-retour" onClick={() => navigate('/objets')}>
                ← Retour
            </button>
            <h2>{objet.objet_libelle || objet.libelle}</h2>
            <p>Poids : {objet.poids_kg} kg</p>
            <p>Statut : {objet.statut}</p>
            <p>Prix : {objet.prix} €</p>
             <p>Déposé par : {objet.nom}</p>
        </div>
    )
}

export default FicheObjet