import express from 'express'
import cors from 'cors'

import routerObjet from './routes/objets.js'
import routerCategorie from './routes/categories.js'
import routerDepot from './routes/depots.js'
import routerPersonne from './routes/personnes.js'
import routerStat from './routes/stats.js'
// Importe les "routers" définis dans chaque fichier séparé.
// Chaque fichier regroupe les routes liées à une seule ressource, ça garde le code organisé.

const app = express();

app.use(cors())
// Importe le middleware CORS, Il sert à autoriser un navigateur (ex: React sur localhost:5173)
// fait des requêtes vers l'API, tourne sur (localhost:3000).
// Sans lui, le navigateur bloque ces requêtes par sécurité (voir l'exercice CORS du TP).


app.use(express.json())
// Crée l'application Express. C'est cet objet "app" qui gérer les requetes et les dirige vers les bonnes routes.
// Middleware qui permet à Express de comprendre le JSON envoyé dans le corps
// d'une requête (req.body). Sans lui, req.body serait "undefined" même si le client envoie bien des données 


app.use("/api/categories", routerCategorie);
app.use("/api/depots", routerDepot);
app.use("/api/personnes", routerPersonne);
app.use("/api/objets", routerObjet);
app.use("/api/stats", routerStat);


app.get("/", async (req, res) => {
    res.send("Connexion etablie !");
})
// Permet de vérifier rapidement que le serveur répond,


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
// Route de "health check" (vérification de santé) — un standard courant en
// développement d'API. Renvoie un JSON simple avec le statut 200, pour
// confirmer que le serveur tourne, sans dépendre de la base de données
// ni d'aucune logique métier.


app.listen(3000, () => {
    console.log("✅ Fonctionne sur le port 3000")
});
// Démarre le serveur, qui se met à écouter les requêtes entrantes sur le
// port 3000. La fonction callback (() => { console.log("ok") }) s'exécute
// une seule fois, au moment où le serveur démarre avec succès — pratique
// pour confirmer dans le terminal que tout est bien lancé.
