import { useState, useEffect } from 'react';

// URL de l'API backend pour récupérer les métriques
const API_STATS_URL = "http://localhost:3000/api/stats";

function TableauDeBord() {
  // Initialisation de l'état "stats" avec des valeurs par défaut pour éviter les erreurs au premier rendu
  const [stats, setStats] = useState({
    poidsTotalRecu: 0,
    nbObjetsEnRayon: 0,
    objetsParStatut: [] // Tableau vide attendu pour la liste des statuts
  });

  // Nouvel état : indique si la requête est en cours (pour afficher un message de chargement)
  const [loading, setLoading] = useState(true);

  // Nouvel état : contient un message d'erreur lisible si la requête échoue
  const [error, setError] = useState(null);

  // 3. Effet chargé de récupérer les données au montage du composant
  useEffect(() => {
    const recupStats = async () => {
      try {
        // Envoi de la requête GET vers le serveur Node/Express
        const reponse = await fetch(API_STATS_URL);

        // Vérification du statut HTTP AVANT de traiter la réponse.
        // Sans ce contrôle, une erreur 500 (qui renvoie { error: "..." })
        // serait quand même stockée dans "stats" comme si c'était des données valides.
        if (!reponse.ok) {
          throw new Error(`Erreur ${reponse.status} lors de la récupération des stats`);
        }
        const result = await reponse.json();

        // Mise à jour de l'état local avec la réponse du backend
        setStats(result);
        setError(null); // on efface une éventuelle erreur précédente en cas de succès
      } catch (error) {
        // Gestion et affichage des erreurs : en console (pour le debug)
        console.log("❌ Erreur de chargement des stats", error.message);
        // et côté utilisateur, via un message affiché à l'écran
        setError("Impossible de charger les statistiques du tableau de bord");
      } finally {
        // Que ça réussisse ou échoue, le chargement est terminé
        setLoading(false);
      }
    };

    recupStats(); // Exécution de la fonction asynchrone
  }, []); // Le tableau de dépendances vide [] garantit que la requête ne s'exécute qu'une seule fois

  return (
    <div className="section dashboard-section">
      <h2>Tableau de bord</h2>

      {/* --- Affichage de l'état de chargement --- */}
      {loading && <p className="loading-text">Chargement des statistiques...</p>}

      {/* --- Affichage d'un message d'erreur si la requête a échoué --- */}
      {error && <p className="error-text">{error}</p>}

      {/* --- Le contenu principal ne s'affiche que si on n'est plus en chargement et qu'il n'y a pas d'erreur --- */}
      {!loading && !error && (
        <>
          {/* --- SECTION 1 : Cartes des métriques principales --- */}
          <div className="stats-grid">
            {/* Carte : Poids total reçu */}
            <div className="stat-card highlight">
              <span className="stat-icon">⚖️</span>
              <div className="stat-info">
                <p className="stat-label">Poids total reçu</p>
                {/* Affichage dynamique du poids récupéré de l'API */}
                <p className="stat-value">{stats.poidsTotalRecu} kg</p>
              </div>
            </div>

            {/* Carte : Objets actuellement en rayon */}
            <div className="stat-card">
              <span className="stat-icon">🏪</span>
              <div className="stat-info">
                <p className="stat-label">Objets en rayon</p>
                {/* Affichage dynamique du nombre d'objets */}
                <p className="stat-value">{stats.nbObjetsEnRayon}</p>
              </div>
            </div>
          </div>

          {/* --- SECTION 2 : Répartition par Statut --- */}
          <div className="statut-block">
            <h3>Nombre d'objets par statut</h3>
            <div className="statut-grid">
              {/* Vérification que le tableau objetsParStatut existe et contient des données */}
              {stats.objetsParStatut && stats.objetsParStatut.length > 0 ? (
                // Parcours du tableau avec .map() pour générer une carte par statut
                // Utilisation de item.statut comme clé (plus stable qu'un index si l'ordre change)
                stats.objetsParStatut.map((item) => (
                  <div key={item.statut} className="statut-card">
                    <span className="statut-name">{item.statut}</span>
                    <span className="statut-count">{item.count}</span>
                  </div>
                ))
              ) : (
                // Message de repli si le backend ne renvoie aucune donnée
                <p className="empty-text">Aucune donnée de statut disponible</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TableauDeBord;