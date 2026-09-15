import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RepairModal } from "./Reparation.jsx"   

const API_URL = "http://localhost:3000/api/personnes/benevoles"

function getInitiales(prenom, nom) {
  const p = prenom?.[0] || ""
  const n = nom?.[0] || ""
  return (p + n).toUpperCase()
}

function Benevole() {
  const navigate = useNavigate()

  const [benevole, setBenevole] = useState([])
  const [recherche, setRecherche] = useState("")

  // ⬅ NOUVEAU : contrôle l'ouverture de la popup.
  // null = fermée. Un objet bénévole = ouverte, pour CE bénévole.
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)

  useEffect(() => {
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

  const benevolesFiltres = benevole.filter((b) => {
    const nomComplet = `${b.prenom} ${b.nom}`.toLowerCase()
    return nomComplet.includes(recherche.toLowerCase())
  })

  // ⬅ NOUVEAU : appelée par la popup quand une réparation est bien enregistrée
  function handleRepairSaved(repair) {
    console.log("Réparation enregistrée :", repair)
    // ici vous pourrez par ex. rafraîchir une liste de réparations récentes
  }

  return (
    <div>
      <h2>Bénévoles</h2>

      <div className="benevole-toolbar">
        <input
          type="text"
          className="benevole-search"
          placeholder="Rechercher un bénévole..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <div className="stats-banner">
          <div className="stats-banner-item">
            <div className="stats-banner-value">{benevole.length}</div>
            <div className="stats-banner-label">Bénévoles actifs</div>
          </div>
        </div>
      </div>

      <div className="benevole-cloud">
        {benevolesFiltres.map((b, index) => {
          const idReel = b.id || b.id_personne || b.personne_id || index + 1

          return (
            <div
              key={idReel}
              className="benevole-item"
              onClick={() => navigate(`/depots/${idReel}`)}
            >
              <div className="benevole-avatar">
                {getInitiales(b.prenom, b.nom)}
              </div>
              {b.prenom} {b.nom}

              {/* ⬅ NOUVEAU : bouton Réparer */}
              <button
                onClick={(e) => {
                  // Sans stopPropagation, le clic remonterait jusqu'à la div
                  // parente et déclencherait AUSSI navigate() vers /depots/...
                  e.stopPropagation()
                  setSelectedVolunteer(b)
                }}
              >
                Réparer
              </button>
            </div>
          )
        })}
      </div>

      {selectedVolunteer && (
        <RepairModal
          volunters={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          onSaved={handleRepairSaved}
        />
      )}
    </div>
  )
}

export default Benevole
