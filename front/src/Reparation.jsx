import { useState } from "react";

const ENDPOINTS = {
    volunters: "http://localhost:3000/api/personnes/benevoles",
    repairs: "http://localhost:3000/api/reparations"
};

// =============================================================
// RepairModal : le composant qui affiche la popup de saisie
// d'une réparation.
// =============================================================
//
// Props reçues du composant parent (ex: Benevole.jsx) :
// - volunters : l'objet bénévole déjà choisi (ex: { id: 3, prenom: "Marie", nom: "Dupont" })
//               -> sert juste à l'AFFICHER en haut de la popup et à l'envoyer avec la réparation
// - onClose   : fonction du parent à appeler pour FERMER la popup
//               (le parent gère l'état "popup ouverte/fermée", pas ce composant)
// - onSaved   : fonction du parent à appeler quand la réparation est bien enregistrée
//               (le parent peut alors rafraîchir sa liste, afficher un message, etc.)
export function RepairModal({ volunters, onClose, onSaved }) {

    // form : contient les valeurs actuelles des 3 champs du formulaire.
    // C'est un seul état (un objet) plutôt que 3 useState séparés,
    // pour pouvoir tout envoyer d'un coup à l'API à la fin.
    const [form, setForm] = useState({
        objet: "",
        duree: "",
        resultat: "reussie"   // valeur par défaut, pour que le <select> ne soit jamais vide
    });

    // errors : stocke les messages d'erreur de VALIDATION (champ vide, durée négative...).
    // Structure : { objet: "message", duree: "message" }. Vide {} = pas d'erreur.
    const [errors, setErrors] = useState({});

    // isSaving : true pendant que la requête vers l'API est en cours.
    // Sert à désactiver les boutons et afficher "Enregistrement..." pour éviter
    // qu'on clique 2 fois sur "Enregistrer" (double envoi).
    const [isSaving, setIsSaving] = useState(false);

    // saveError : message d'erreur si l'API a répondu par un échec (contrairement
    // à "errors", qui concerne les erreurs de saisie AVANT même d'appeler l'API).
    const [saveError, setSaveError] = useState(null);

    // ---------------------------------------------------------
    // handChange : appelée à CHAQUE frappe clavier ou changement
    // dans un input/select du formulaire.
    // ---------------------------------------------------------
    // "e" est l'événement du navigateur. e.target est le champ HTML concerné.
    // On récupère son attribut "name" (ex: name="objet") et sa valeur tapée.
    function handChange(e) {
        const { name, value } = e.target;

        // On met à jour uniquement la clé concernée dans "form", sans toucher
        // aux autres. "...prev" copie les valeurs existantes, puis [name]: value
        // écrase juste celle qui a changé.
        // Exemple concret : si on tape dans le champ "durée", seul form.duree
        // change, form.objet et form.resultat restent intacts.
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // ---------------------------------------------------------
    // valider : vérifie que le formulaire est correctement rempli
    // AVANT d'envoyer quoi que ce soit à l'API.
    // ---------------------------------------------------------
    // Renvoie true si tout est bon, false s'il y a au moins une erreur.
    // Sert de "garde-fou" : handSubmit s'arrête si valider() renvoie false.
    function valider() {
        const newErrors = {};

        // .trim() enlève les espaces avant/après, pour éviter qu'un champ
        // rempli seulement d'espaces soit considéré comme valide.
        if (!form.objet.trim()) newErrors.objet = "L'objet est requis";

        // On convertit en nombre avec Number() car la valeur d'un <input type="number">
        // est en réalité une chaîne de caractères ("30", pas 30).
        if (!form.duree || Number(form.duree) <= 0) newErrors.duree = "Durée invalide (en minutes)";

        setErrors(newErrors);

        // Object.keys(newErrors) donne la liste des clés de l'objet, ex: ["objet", "duree"].
        // Si cette liste est vide (.length === 0), c'est qu'il n'y a aucune erreur.
        return Object.keys(newErrors).length === 0;
    }

    // ---------------------------------------------------------
    // handSubmit : appelée quand on soumet le formulaire
    // (clic sur "Enregistrer", ou touche Entrée dans un champ).
    // ---------------------------------------------------------
    async function handSubmit(e) {
        // Par défaut, soumettre un <form> recharge la page entière.
        // preventDefault() empêche ce comportement, pour rester dans l'app React.
        e.preventDefault();

        // Si la validation échoue, on affiche les erreurs (fait dans valider())
        // et on s'arrête là : aucun appel réseau n'est fait.
        if (!valider()) return;

        // On désactive les boutons et on prévient l'utilisateur que ça enregistre.
        setIsSaving(true);

        try {
            // Envoi des données au serveur en HTTP POST (on CRÉE une nouvelle réparation).
            const res = await fetch(ENDPOINTS.repairs, {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // on prévient le serveur qu'on envoie du JSON
                body: JSON.stringify({
                    objet: form.objet,
                    benevoleId: volunters.id,        // on relie la réparation au bénévole sélectionné
                    duree: Number(form.duree),        // reconverti en nombre pour l'API
                    resultat: form.resultat
                })
            });

            // res.ok est true si le serveur a répondu avec un code 200-299 (succès).
            // Sinon (ex: erreur 500), on déclenche volontairement une erreur
            // pour tomber dans le "catch" juste en dessous.
            if (!res.ok) throw new Error("Échec de l'enregistrement");

            // On récupère la réparation telle qu'enregistrée côté serveur
            // (utile si le serveur génère un id, une date, etc.)
            const savedRepair = await res.json();

            // On prévient le composant PARENT que c'est bon (il pourra rafraîchir sa liste).
            onSaved(savedRepair);

            // On ferme la popup.
            onClose();
        } catch (err) {
            // Si fetch échoue (pas de réseau) OU si res.ok était false : on arrive ici.
            //
            // ⚠️ ATTENTION, bug à corriger : la ligne suivante contient une virgule
            // entre setSaveError(...) et "err". En JavaScript, une virgule entre deux
            // expressions exécute les deux mais ne "garde" que la dernière valeur.
            // Ici "err" tout seul ne fait donc RIEN (on ne l'affiche nulle part,
            // on ne le log pas) : l'erreur détaillée est silencieusement perdue.
            // Pour la garder utile pendant le développement, mieux vaut écrire :
            //   console.error(err);
            //   setSaveError("Impossible d'enregistrer la réparation...");
            setSaveError("Impossible d'enregistrer la réparation..."), err;
        } finally {
            // "finally" s'exécute TOUJOURS, que ça ait réussi ou échoué.
            // On réactive donc les boutons dans tous les cas.
            setIsSaving(false);
        }
    }

    // ---------------------------------------------------------
    // Affichage (JSX)
    // ---------------------------------------------------------
    return (
        // Le fond assombri derrière la popup. Cliquer dessus (en dehors
        // de la boîte blanche) appelle onClose -> ferme la popup.
        <div className="modal-overlay" onClick={onClose}>

            {/* La boîte blanche elle-même. stopPropagation() empêche un clic
                À L'INTÉRIEUR de la boîte de "remonter" jusqu'au fond et de
                fermer la popup par erreur. */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Saisir une réparation</h3>

                {/* "?." (optional chaining) évite un plantage si "volunters"
                    n'était pas encore défini au moment du premier rendu. */}
                <p className="modal-subtitle">
                    Bénévole : <strong>{volunters?.prenom} {volunters?.nom}</strong>
                </p>

                {/* onSubmit se déclenche au clic sur le bouton type="submit"
                    OU en appuyant sur Entrée dans un champ du formulaire. */}
                <form onSubmit={handSubmit}>
                    <div className="form-group">
                        <label>Objet réparé</label>
                        <input
                            type="text"
                            name="objet"              // doit correspondre à la clé utilisée dans handChange/form
                            value={form.objet}        // input "contrôlé" : sa valeur vient toujours de l'état React
                            onChange={handChange}     // à chaque frappe, met à jour form.objet
                        />
                        {/* Affiché seulement si errors.objet existe (rendu conditionnel avec &&) */}
                        {errors.objet && <p className="error-text">{errors.objet}</p>}
                    </div>

                    <div className="form-group">
                        <label>Durée (minutes)</label>
                        <input
                            type="number"
                            name="duree"
                            value={form.duree}
                            onChange={handChange}
                        />
                        {errors.duree && <p className="error-text">{errors.duree}</p>}
                    </div>

                    <div className="form-group">
                        <label>Résultat</label>
                        <select
                            name="resultat"
                            value={form.resultat}
                            onChange={handChange}
                        >
                            <option value="reussie">Réussie</option>
                            <option value="echouee">Échouée</option>
                        </select>
                    </div>

                    {/* Erreur venant de l'API (pas de la validation locale) */}
                    {saveError && <p className="error-text">{saveError}</p>}

                    <div className="modal-actions">
                        {/* type="button" est important : sans ça, ce bouton
                            déclencherait aussi la soumission du formulaire. */}
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isSaving}   // on empêche d'annuler en pleine sauvegarde
                        >
                            Annuler
                        </button>

                        {/* type="submit" (par défaut pour un <button> dans un <form>) :
                            déclenche handSubmit via onSubmit du <form>. */}
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
