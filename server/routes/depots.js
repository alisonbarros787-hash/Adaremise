import express from "express";
import { pool } from "../db.js";

const routerDepot = express.Router();

// ============================================================
// ROUTE GET : Un dépôt + sa donatrice + la liste des objets qu'il contient

routerDepot.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const depotInfo = await pool.query(
            `SELECT d.type, p.*, o.* 
             FROM depot d 
             JOIN personne p ON d.personne_id = p.id 
             JOIN objet o ON o.depot_id = d.id 
             WHERE d.id = $1 AND d.type = 'boutique'`,
            [id]
        );

        if (depotInfo.rows.length === 0) {
            return res.status(404).json({ erreur: 'Aucun dépôt correspondant.' });
        }

        res.status(200).json(depotInfo.rows);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
});

// ============================================================
// ROUTE POST : Enregistre un dépôt (personne_id, date_depot, type)

routerDepot.post('/', async (req, res) => {
    try {
        const { personne_id, date_depot, type } = req.body;

        // Vérification de la liste blanche AVANT l'insertion
        const TYPES = ['boutique', 'domicile'];
        if (!TYPES.includes(type)) {
            return res.status(400).json({
                error: `type doit valoir : ${TYPES.join(', ')}`
            });
        }

        const nouveauDepot = await pool.query(
            `INSERT INTO depot (personne_id, date_depot, type) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [personne_id, date_depot, type]
        );

        res.status(201).json(nouveauDepot.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du dépôt.' });
    }
});

// ============================================================
// ROUTE POST : Ajoute un objet au dépôt (libelle, poids_kg, etat_arrivee, categorie_id)

routerDepot.post('/:id/objet', async (req, res) => {
    try {
        const { id } = req.params; // l'id du DÉPÔT, vient de l'URL
        const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body;

        const nouveauObjet = await pool.query(
            `INSERT INTO objet (depot_id, libelle, poids_kg, etat_arrivee, categorie_id)
             VALUES ($1, $2, $3::numeric, $4, $5)
             RETURNING *`,
            [id, libelle, poids_kg, etat_arrivee, categorie_id]
        );

        res.status(201).json(nouveauObjet.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Erreur, ajout interrompu.' });
    }
});

export default routerDepot;