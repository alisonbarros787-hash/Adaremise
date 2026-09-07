import express from "express";
import {pool} from "../db.js";

const routerCategorie = express.Router();



// ROUTE GET : Toutes les catégories (id + libelle):
routerCategorie.get("/", async (req, res) => {
    try {
        const allCategorie = await pool.query(
            // Analogie : pool est comme un téléphone déjà connecté à la base de données. .query("SELECT ...") est l'action de "parler" dans ce téléphone pour poser une question et attendre la réponse.
            `SELECT * FROM categories;`
        )
        res.status(200).json(allCategorie.rows)
        // rows est la propriété qui contient précisément ce que tu veux : le tableau des lignes retournées par ta requête SQL. Les autres propriétés (rowCount, command, fields...) sont des métadonnées techniques, utiles dans d'autres contextes mais pas ce que le client de ton API attend.

    }catch(error){
       console.error(error)
       res.status(500).json({error : 'Erreur lors de la recuperation des donnees !'})
    }
})

export default routerCategorie