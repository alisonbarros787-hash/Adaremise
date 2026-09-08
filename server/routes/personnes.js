import express from "express";
import { pool } from "../db.js";

const routerPersonne = express.Router();


// ROUTE POST : Crée une donatrice (nom, prenom, telephone?, adherente?):
routerPersonne.post('/', async (req, res) => {
    const {id, nom, prenom, telephone, adherente} = req.body

    if(!id || !nom || !prenom || !telephone || !adherente){
        return res.status(400).json({error: 'Champs obligatoires manquants !'})
    }
    const { rows } = await pool.query(
        `INSERT INTO personne (id, nom, prenom, telephone, adherente)VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [id, nom, prenom, telephone, BOOLEAN(adherente)]
    )
    res.status(201).json(rows[0])
});

export default routerPersonne