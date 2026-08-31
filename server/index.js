console.log("test")
import express from 'express'
import cors from 'cors'
import router from './src/router.js'
const app = express()
 
app.use(cors)

app.use(express.json())

// app.use(router)

// const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log("ok")
  
});

app.get("/", async (req, res) => {
    res.send("Connexion etablie !");
})