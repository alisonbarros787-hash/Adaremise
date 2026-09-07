# Adapi 

Construis l’API REST de La Remise — celle que ton équipe reprendra en S15 pour AdaRemise.


## Objectif

Jusqu’ici, tu as écrit des requêtes SQL dans un terminal. Personne d’autre que toi ne pouvait les exécuter.

Tu vas maintenant construire un serveur qui expose ces données à d’autres programmes. Une application front, un script, un téléphone : n’importe qui pourra demander des données à ton serveur en HTTP, et recevoir du JSON en réponse.

C’est ce qu’on appelle une API REST. C’est la brique qui manquait entre ta base de données et une vraie application.



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

    Comment installer et lancer le projet ? (variables d’environnement, import de la base, commande de démarrage)
    Quelles routes existent, et que renvoient-elles ?
    Comment tester l’API ?
