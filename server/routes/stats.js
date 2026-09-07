import express from "express";
import { pool } from "../db.js";

const routerStat = express.Router();

// ROUTE GET : 3 indicateurs : objets par statut, poids total reçu, poids détourné de la déchetterie
routerStat.get('/', async (req, res) => {
    try {
        // Indicateur 1 : nombre d'objets par statut
        const parStatut = await pool.query(
            `SELECT statut, COUNT(*) 
             FROM objet 
             GROUP BY statut`
        )
        // Indicateur 2 : poids total reçu (tous objets confondus)
        const poidsTotal = await pool.query(
            `SELECT SUM(poids_kg) 
             FROM objet`
        )
        // Indicateur 3 : poids "détourné" de la déchetterie
        // (tout ce qui N'A PAS fini recyclé/jeté)
        const poidsDetourne = await pool.query(
            `SELECT SUM(poids_kg) 
             FROM objet 
             WHERE statut != 'recycle'`
        )
        res.status(200).json({
            objetsParStatut: parStatut.rows,
            poidsTotal: poidsTotal.rows[0],
            poidsDetourne: poidsDetourne.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erreur: 'ERREUR statistique non trouvé...' });
    }
});

// Un COUNT(*) GROUP BY statut pour le premier indicateur (objets par statut)
// Un SUM(poids) pour le poids total reçu
// Un SUM(poids) avec un filtre (WHERE) pour le poids "détourné"

export default routerStat