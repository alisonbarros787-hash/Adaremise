import express from "express";
import { pool } from "../db.js";

const routerObjet = express.Router();

// ============================================================
// Liste des objets, avec le libellé de leur catégorie
// Filtrable par categorie_id et/ou statut 

routerObjet.get('/', async (req, res) => {
    try {
        const { categorie_id, statut } = req.query;

        const result = await pool.query(
            `SELECT o.*, c.libelle 
             FROM objet o 
             JOIN categorie c ON o.categorie_id = c.id
             WHERE o.categorie_id = COALESCE($1::integer, o.categorie_id)
               AND o.statut = COALESCE($2::status_objet, o.statut)`,
            [categorie_id ?? null, statut ?? null]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erreur: 'Erreur, aucun objet trouvé.' });
    }
});

// ============================================================
// Un objet + sa catégorie + son dépôt + le nom de la donatrice

routerObjet.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT o.*, c.libelle, d.type, p.nom 
             FROM objet o 
             JOIN categorie c ON o.categorie_id = c.id 
             JOIN depot d ON o.depot_id = d.id
             JOIN personne p ON d.personne_id = p.id
             WHERE o.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erreur: 'Objet introuvable.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
});

// ============================================================
// Change le statut d'un objet (statut, prix?)
// ============================================================
routerObjet.patch('/:id/status', async (req, res) => {
    try {
        const { statut, prix } = req.body;
        const { id } = req.params;

        const STATUT = ['arrive', 'en_reparation', 'en_rayon', 'vendu', 'recycle'];
        if (!STATUT.includes(statut)) {
            return res.status(400).json({ error: 'STATUT INVALIDE !' });
        }

        const { rows } = await pool.query(
            `UPDATE objet 
             SET statut = $1::status_objet,
                 prix = COALESCE($2, prix),
                 date_mise_rayon = CASE WHEN $1 = 'en_rayon' THEN CURRENT_DATE ELSE date_mise_rayon END
             WHERE id = $3
             RETURNING *`,
            [statut, prix ?? null, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erreur: 'AUCUNE UPDATE !' });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur serveur.' });
    }
});

export default routerObjet;