import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import VolunteersPage from "./Reparation.jsx"

const API_URL = "http://localhost:3000/api/personnes/benevoles"

// Génère les initiales à partir du prénom et du nom (ex: "Agnès Colin" -> "AC")
// Utilisé pour afficher un avatar rond avec 2 lettres au lieu d'une image
function getInitiales(prenom, nom) {
  const p = prenom?.[0] || ""
  const n = nom?.[0] || ""
  return (p + n).toUpperCase()
}

function Benevole() {
  // --- LIGNE OBLIGATOIRE ---
  const navigate = useNavigate()

  const [benevole, setBenevole] = useState([])   // liste complète récupérée depuis l'API
  const [recherche, setRecherche] = useState("") // texte tapé dans la barre de recherche

  useEffect(() => {
    // Appel API au chargement de la page pour récupérer tous les bénévoles
    const idBenevole = async () => {
      try {
        const reponse = await fetch(API_URL)
        const result = await reponse.json()
        setBenevole(result)
      } catch (error) {
        console.log("❌ Erreur de chargement", error.message)
      }
    }
    idBenevole()
  }, [])

  // Filtre la liste complète pour n'afficher que les bénévoles dont le nom
  // complet contient le texte tapé dans la recherche (insensible à la casse).
  // Ne modifie pas "benevole" : recalculé à chaque frappe, sans nouvel appel API.
  const benevolesFiltres = benevole.filter((b) => {
    const nomComplet = `${b.prenom} ${b.nom}`.toLowerCase()
    return nomComplet.includes(recherche.toLowerCase())
  })

  return (
    <div>
      <h2>Bénévoles</h2>

      {/* Ligne recherche + compteur, alignées aux extrémités via .benevole-toolbar (CSS) */}
      <div className="benevole-toolbar">
        <input
          type="text"
          className="benevole-search"
          placeholder="Rechercher un bénévole..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        {/* Réutilise .stats-banner : compte simplement benevole.length (liste non filtrée) */}
        <div className="stats-banner">
          <div className="stats-banner-item">
            <div className="stats-banner-value">{benevole.length}</div>
            <div className="stats-banner-label">Bénévoles actifs</div>
          </div>
        </div>
      </div>

      <div className="benevole-cloud">
        {/* On boucle sur la liste FILTRÉE (pas "benevole") pour que la recherche fonctionne */}
        {benevolesFiltres.map((b, index) => {
          // Certaines API renvoient id / id_personne / personne_id selon les cas :
          // on prend le premier qui existe, sinon on retombe sur l'index
          const idReel = b.id || b.id_personne || b.personne_id || index + 1

          return (
            <div
              key={idReel}
              className="benevole-item"
              onClick={() => navigate(`/depots/${idReel}`)} // clic -> fiche des dépôts de ce bénévole
            >
              <div className="benevole-avatar">
                {getInitiales(b.prenom, b.nom)}
              </div>
              {b.prenom} {b.nom}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Benevole