import pg from "pg";
import "dotenv/config";

const {Pool} = pg;
// "pg" exporte plusieurs outils, dont "Pool". Un "Pool" gère un ensemble de 
// connexions réutilisables à la base de données,
//  plutôt que d'en ouvrir une nouvelle à chaque requête

export const pool = new Pool({
// Crée une nouvelle instance de Pool, configurée avec les infos
// de connexion à ta base. "export" rend cette variable "pool"
// utilisable depuis d'autres fichiers (comme tes fichiers de routes),
// en l'important avec : import { pool } from "../db.js";

   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
});


