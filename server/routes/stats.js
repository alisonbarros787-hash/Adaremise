import express from "express";
import { pool } from "../db.js";

const routerStat = express.Router();

// ROUTE GET : 3 indicateurs : objets par statut, poids total reçu, poids détourné de la déchetterie
routerStat.get('/', async (req, res) => {
    try {
        const parStatut = await pool.query(
            `SELECT statut, COUNT(*) FROM objet GROUP BY statut`
        )
        const poidsTotal = await pool.query(
            `SELECT SUM(poids_kg) AS total FROM objet`
        )
        const poidsDetourne = await pool.query(
            `SELECT SUM(poids_kg) AS total FROM objet WHERE statut != 'recycle'`
        )
        const enRayon = await pool.query(
            `SELECT COUNT(*) AS total FROM objet WHERE statut = 'en_rayon'`
        )

        res.status(200).json({
            objetsParStatut: parStatut.rows,
            poidsTotalRecu: poidsTotal.rows[0].total,
            poidsDetourne: poidsDetourne.rows[0].total,
            nbObjetsEnRayon: enRayon.rows[0].total
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erreur: 'ERREUR statistique non trouvé...' });
    }
});

export default routerStat