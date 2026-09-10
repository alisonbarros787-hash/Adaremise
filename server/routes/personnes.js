import express from "express";
import { pool } from "../db.js";

const routerPersonne = express.Router();

routerPersonne.get('/benevoles', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM benevole ORDER BY prenom ASC;`
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des bénévoles !' });
    }
});

// ROUTE POST : Crée une donatrice (nom, prenom, telephone?, adherente?):
routerPersonne.post('/', async (req, res) => {
    const {nom, prenom, telephone, adherente} = req.body

    if(!nom || !prenom || !telephone || !adherente){
        return res.status(400).json({error: 'Champs obligatoires manquants !'})
    }
    const { rows } = await pool.query(
        `INSERT INTO personne (nom, prenom, telephone, adherente)VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [nom, prenom, telephone,(adherente)]
    )
    res.status(201).json(rows[0])
});

export default routerPersonne

