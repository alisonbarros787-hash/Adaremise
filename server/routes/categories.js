import express from "express";
import { pool } from "../db.js";

const routerCategorie = express.Router();

// ROUTE GET : Toutes les catégories (id + libelle)
routerCategorie.get("/", async (req, res) => {
    try {
        const allCategorie = await pool.query(
            `SELECT * FROM categorie;`
        );
        res.status(200).json(allCategorie.rows);
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Erreur lors de la récupération des données !' });
    }
});

routerCategorie.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const categorie = await pool.query(
            `SELECT * FROM categorie WHERE id = $1;`,
            [id]
        );

        if (categorie.rows.length === 0) {
            return res.status(404).json({ error: 'Catégorie non trouvée.' });
        }

        res.status(200).json(categorie.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie !' });
    }
});

export default routerCategorie