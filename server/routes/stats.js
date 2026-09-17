import express from "express";
import { pool } from "../db.js";

const routerStat = express.Router();

/**
 * @openapi
 *  api/stats:
 *   get:
 *     summary: Récupère l'ensemble des statistiques globales
 *     description: Calcule et retourne les indicateurs clés (KPI) de la ressourcerie, incluant les poids, le chiffre d'affaires, le bénévolat et l'évolution mensuelle.
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 objetsParStatut:
 *                   type: array
 *                   description: Nombre d'objets groupés par leur statut actuel.
 *                   items:
 *                     type: object
 *                     properties:
 *                       statut:
 *                         type: string
 *                         example: "en_rayon"
 *                       count:
 *                         type: string
 *                         description: Le nombre d'objets (renvoyé sous forme de chaîne par PostgreSQL pour les COUNT).
 *                         example: "124"
 *                 poidsTotalRecu:
 *                   type: number
 *                   nullable: true
 *                   description: Somme totale du poids de tous les objets collectés (en kg).
 *                   example: 1250.5
 *                 poidsDetourne:
 *                   type: number
 *                   nullable: true
 *                   description: Poids total des objets sauvés de la poubelle (statut différent de 'recycle').
 *                   example: 980.2
 *                 nbObjetsEnRayon:
 *                   type: string
 *                   description: Nombre total d'objets actuellement disponibles en magasin.
 *                   example: "45"
 *                 chiffreAffaires:
 *                   type: number
 *                   nullable: true
 *                   description: Cumul des ventes réelles encaissées.
 *                   example: 3450.75
 *                 heuresBenevolat:
 *                   type: number
 *                   nullable: true
 *                   description: Nombre total d'heures consacrées aux réparations.
 *                   example: 120
 *                 tauxReussiteReparations:
 *                   type: number
 *                   description: Pourcentage de réparations qui ont réussi (entre 0 et 100).
 *                   example: 78.5
 *                 evolutionCA:
 *                   type: array
 *                   description: Historique du chiffre d'affaires cumulé par mois pour les graphiques.
 *                   items:
 *                     type: object
 *                     properties:
 *                       mois:
 *                         type: string
 *                         description: Année et mois au format YYYY-MM.
 *                         example: "2026-09"
 *                       total:
 *                         type: number
 *                         description: Chiffre d'affaires réalisé ce mois-ci.
 *                         example: 450.00
 *       400:
 *         description: Une erreur est survenue lors de la récupération des données.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erreur:
 *                   type: string
 *                   example: "ERREUR statistique non trouvé..."
 */

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