import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/personnes/benevoles";

function Benevole() {
  const [benevole, setBenevole] = useState([]);

  useEffect(() => {
    const idBenevole = async () => {
      try {
        const reponse = await fetch(API_URL);
        const result = await reponse.json();
        setBenevole(result);
      } catch (error) {
        console.log("❌ Erreur de chargement", error.message);
      }
    };
    idBenevole();
  }, []);

  return (
    <div className="section benevole-section">
      <h2>Bénévoles</h2>
      <div className="benevole-cloud">
        {benevole.map((b) => (
          <div className="benevole-item" key={`${b.nom}-${b.prenom}`}>
            🙋 {b.nom} {b.prenom}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Benevole;