import express from "express";
import { pool } from "../db.js";

const routerStat = express.Router();

// ROUTE GET : indicateurs du tableau de bord
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

        // Chiffre d'affaires : somme des prix réellement payés sur les objets vendus
        const chiffreAffaires = await pool.query(
            `SELECT SUM(prix_paye) AS total FROM objet WHERE statut = 'vendu'`
        )

        // Heures de bénévolat : somme des durées passées en réparation
        const heuresBenevolat = await pool.query(
            `SELECT SUM(duree_h) AS total FROM reparation`
        )

        // Taux de réussite des réparations : réparations réussies / total des réparations
        const reparationsStats = await pool.query(
            `SELECT
                 COUNT(*) FILTER (WHERE resultat = 'reussie') AS reussies,
                 COUNT(*) AS total
             FROM reparation`
        )
        const { reussies, total: totalReparations } = reparationsStats.rows[0]
        const tauxReussite = totalReparations > 0
            ? (reussies / totalReparations) * 100
            : 0

        // Chiffre d'affaires par mois, pour la courbe d'évolution
        const caParMois = await pool.query(
            `SELECT
                 to_char(date_trunc('month', v.date_vente), 'YYYY-MM') AS mois,
                 SUM(o.prix_paye) AS total
             FROM vente v
             JOIN objet o ON o.vente_id = v.id
             GROUP BY mois
             ORDER BY mois`
        )

        res.status(200).json({
            objetsParStatut: parStatut.rows,
            poidsTotalRecu: poidsTotal.rows[0].total,
            poidsDetourne: poidsDetourne.rows[0].total,
            nbObjetsEnRayon: enRayon.rows[0].total,
            chiffreAffaires: chiffreAffaires.rows[0].total,
            heuresBenevolat: heuresBenevolat.rows[0].total,
            tauxReussiteReparations: tauxReussite,
            evolutionCA: caParMois.rows
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ erreur: 'ERREUR statistique non trouvé...' });
    }
});

export default routerStat