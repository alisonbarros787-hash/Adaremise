# Adapi 

Construis l’API REST de La Remise — celle que ton équipe reprendra en S15 pour AdaRemise.


## Objectif

Construire un serveur qui expose ces données à d’autres programmes. Une application front, un script, un téléphone : n’importe qui pourra demander des données au serveur en HTTP, et recevoir du JSON en réponse.

C’est ce qu’on appelle une API REST. C’est la brique  entre une base de données et une vraie application.



## Architecture 

```
adapi/
├── package.json
├── .env                 
├── .env.example         
├── .gitignore
├── README.md
├── db/
│   ├── migration_up.sql  
│   └── seed.sql
├── requetes/ 
|   ├── categories.http
|   ├── depots.http
|   ├── objets.http
|   ├── personnes.http
|   └── stats.http   
└── server/
    ├── index.js          
    ├── db.js             
    └── routes/
        ├── categories.js
        ├── objets.js
        ├── personnes.js
        ├── depots.js
        └── stats.js

```

## Questions 

  ### Comment installer et lancer le projet ? (variables d’environnement, import de la base, commande de démarrage)
  - Prérequis :
  Node.js installé
  PostgreSQL installé et lancé localement
   - les dependances :
   npm install
   - lancer le projet :
   npm run dev

 ### Quelles routes existent, et que renvoient-elles ?
  - Les differentes routes :
    - Lesroutes sont entreposer dans le dossiers routes lui meme dans le dossier server/
      - ROUTE : categorie
      - ROUTE : depot
      - ROUTE : objet
      - ROUTE : personne
      - ROUTE : stat


  ### Comment tester l’API ?
    - Dans le dossier requete/ il y a un dossier par route qui peut etre tester (cela ne fonctionne pas)


