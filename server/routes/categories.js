import express from "express";
import { pool } from "../db.js";

const routerCategorie = express.Router();


/**
 * @openapi
 * 
 * /api/categories:
 *   get:
 *     summary: Récupère toutes les categories
 *     responses:
 *       200:
 *         description: 
 *     error:
 *       500:
 *         description: 'Erreur lors de la récupération des données !'
 */
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

/**
 * @openapi
 * 
 * /api/categories/:id:
 *   get:
 *     summary: Récupère la premiere categorie
 *     responses:
 *       404:
 *         description:'Catégorie non trouvée.'
 *       200:
 *         description: 
 *     error:
 *       500:
 *         description: 'Erreur lors de la récupération de la catégorie !'
 */
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