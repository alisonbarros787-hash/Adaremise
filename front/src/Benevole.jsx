import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = "http://localhost:3000/api/personnes/benevoles"

function Benevole() {
  // --- LIGNE OBLIGATOIRE ---
  const navigate = useNavigate()

  const [benevole, setBenevole] = useState([])

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

  return (
    <div>
      <h2>Bénévoles</h2>
      <div className="benevole-cloud">
        {benevole.map((b, index) => {
          const idReel = b.id || b.id_personne || b.personne_id || index + 1

          return (
            <div
              key={idReel}
              className="benevole-item"
              onClick={() => navigate(`/depots/${idReel}`)}
            >
              🙋 {b.prenom} {b.nom}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Benevole