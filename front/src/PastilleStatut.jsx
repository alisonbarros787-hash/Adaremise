// Cree un dictionnaire (objet js) qui va faire le lien entre chaque statut (key) et une couleur (value)
// Key = le texte brut de la base de donnees
// Value = le code couleur a afficher (ici hexadecimal)

const STATUSCOLORS = {
    arrive : '#3B82F6',        
    en_reparation: '#F59E0B', 
    en_rayon: '#10B981',     
    vendu: '#6B7280',        
    recycle: '#8B5CF6',
};


// 2eme Dictionnaire : le texte a afficher pour l'utilisateur 
// Separer couleur et texte pour pouvoir traduire ou reformuler facilement sans toucher au couleurs , et vice-versa ..

const STATUSTEXT = {
    arrive : 'Arrivé',
    en_reparation : 'En réparation',
    en_rayon : 'En rayon',
    vendu : 'Vendu',
    recycle : 'Recyclé',
};


// Un conposant React qui va recevoit des "props" dans ce cas c'est 'status' puis retoune du html
function StatusBadge({ status }) {

    //Aller chercher la couleur du texte qui correspont au status reçus
    // Si le status n'existe pas dans STATUSCOLORS alors la couleur par defaut ce noir ('#000')
    const color = STATUSCOLORS[status] || '#000'

    const label = STATUSTEXT[status] || '#000'

    // meme chose pour le texte , si aucun label n'est trouvé , le status en brut sera afficher 
    //* (peut etre utile pour reperer un status mal gerer)
    return (
        <span 
        className="pastille" // applique le style CSS 
        style={{backgroundColor : color}}> 
        {/* // couleur dynamique injectée ici */}
            {label}
        </span>
          
    )

}

    <StatusBadge status="en_reparation"/>  
    // -> affichera une pastille orange avec le texte "En réparation"  

export default StatusBadge