import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RepairModal } from "./Reparation.jsx"
import outils from "./assets/outils.png";

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

  function handleRepairSaved(repair) {
    console.log("Réparation enregistrée :", repair)
    setSelectedVolunteer(null)
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

        {/* Bénévoles actifs sur une seule ligne + italique */}
        <div className="benevoles-compteur">
          <span className="nombre-actif">{benevole.length}</span>
          <span className="texte-actif">bénévoles actifs</span>
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
              <span>{b.prenom} {b.nom}</span>

              {/* Bouton Réparer isolé et stylisé */}
              <button
                className="btn-reparer"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedVolunteer(b)
                }}
              >
                 <img src={outils} alt="Image d'outils" className="outils"/> 
 
              </button>
            </div>
          )
        })}
      </div>

      {/* Pop-up Modale */}
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
