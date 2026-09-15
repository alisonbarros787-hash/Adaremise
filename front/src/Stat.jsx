import { useState, useEffect } from 'react';

// URL du point d'entrée de l'API backend pour récupérer les statistiques
const API_STATS_URL = "http://localhost:3000/api/stats";

function TableauDeBord() {
  // 1. État contenant l'ensemble des données reçues du serveur
  const [stats, setStats] = useState({
    poidsTotalRecu: 0,
    nbObjetsEnRayon: 0,
    objetsParStatut: [],
    evolutionCA: []
  });

  // 2. États d'interface : gestion du chargement et des erreurs HTTP/réseau
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Effet déclenché une seule fois au montage du composant pour charger l'API
  useEffect(() => {
    const recupStats = async () => {
      try {
        const reponse = await fetch(API_STATS_URL);

        // Interception des erreurs de statut HTTP (404, 500, etc.)
        if (!reponse.ok) {
          throw new Error(`Erreur ${reponse.status} lors de la récupération des stats`);
        }
        
        const result = await reponse.json();

        // Enregistrement des données et réinitialisation des erreurs
        setStats(result);
        setError(null);
      } catch (error) {
        console.log("❌ Erreur de chargement des stats :", error.message);
        setError("Impossible de charger les statistiques du tableau de bord");
      } finally {
        // Fin du chargement quel que soit le résultat (succès ou échec)
        setLoading(false);
      }
    };

    recupStats();
  }, []);

  // Extraction sécurisée des propriétés pour gérer la compatibilité des clés (camelCase vs snake_case SQL)
  const poidsTotal = stats.poidsTotalRecu ?? stats.poids_total ?? stats.poids ?? 0;
  const nbEnRayon = stats.nbObjetsEnRayon ?? stats.en_rayon ?? stats.total_rayon ?? 0;
  const listeStatuts = Array.isArray(stats.objetsParStatut) ? stats.objetsParStatut : [];
  const listeCA = Array.isArray(stats.evolutionCA) ? stats.evolutionCA : [];

  // Calcul du montant de CA le plus élevé pour servir d'échelle 100% dans le graphique
  const maxCA = Math.max(...listeCA.map((item) => Number(item.total) || 0), 1);

  return (
    <div className="section dashboard-section">
      <h2>Tableau de bord</h2>

      {/* Message affiché pendant l'attente de la réponse serveur */}
      {loading && <p className="loading-text">Chargement des statistiques...</p>}
      
      {/* Message d'erreur affiché si l'appel API a échoué */}
      {error && <p className="error-text">{error}</p>}

      {/* Rendu principal : affiché uniquement si les données sont prêtes et sans erreur */}
      {!loading && !error && (
        <>
          {/* --- SECTION 1 : Cartes d'indicateurs clés (Poids & Rayon) --- */}
          <div className="stats-grid">
            <div className="stat-card highlight">
              <span className="stat-icon">⚖️</span>
              <div className="stat-info">
                <p className="stat-label">Poids total reçu</p>
                <p className="stat-value">{poidsTotal} kg</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🏪</span>
              <div className="stat-info">
                <p className="stat-label">Objets en rayon</p>
                <p className="stat-value">{nbEnRayon}</p>
              </div>
            </div>
          </div>

          {/* --- SECTION 2 : Répartition du nombre d'objets par statut --- */}
          <div className="statut-block">
            <h3>Nombre d'objets par statut</h3>
            <div className="statut-grid">
              {listeStatuts.length > 0 ? (
                // Génération d'une carte d'affichage pour chaque statut en base de données
                listeStatuts.map((item, index) => (
                  <div key={item.statut || index} className="statut-card">
                    <span className="statut-name">
                      {/* Nettoyage du texte (remplacement des underscores par des espaces) */}
                      {(item.statut || "").replace("_", " ")}
                    </span>
                    <span className="statut-count">
                      {item.count ?? item.total ?? 0}
                    </span>
                  </div>
                ))
              ) : (
                <p className="empty-text">Aucune donnée de statut disponible</p>
              )}
            </div>
          </div>

          {/* --- SECTION 3 : Graphique horizontal d'évolution du CA par mois --- */}
          <div className="chart-block">
            <h3>Chiffre d'affaires par mois</h3>
            {listeCA.length > 0 ? (
              <div className="chart-bar-list">
                {listeCA.map((item, index) => {
                  // Calcul du pourcentage relatif de la barre par rapport au mois le plus haut
                  const pourcentage = Math.round((Number(item.total) / maxCA) * 100);

                  return (
                    <div key={item.mois || index} className="chart-bar-item">
                      {/* Libellé de la période (ex: 2026-04) */}
                      <span className="chart-label">{item.mois}</span>
                      
                      {/* Piste de fond de la barre */}
                      <div className="chart-track">
                        {/* Remplissage dynamique via variable CSS native (évite le style inline brut) */}
                        <div
                          className="chart-fill"
                          style={{ '--fill-width': `${pourcentage}%` }}
                        />
                      </div>

                      {/* Montant financier du mois */}
                      <span className="chart-value">{item.total} €</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-text">Aucune donnée de chiffre d'affaires</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TableauDeBord;