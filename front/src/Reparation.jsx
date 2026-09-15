import { useState, useEffect } from "react";

const ENDPOINTS = {
    volunters: "http://localhost:3000/api/personnes/benevoles",
    repairs: "http://localhost:3000/api/reparations"
};

// RepairModal : la popup
// Ses "props" (ce qu'elle reçoit du parent)
function RepairModal({ volunters, onClose, onSaved }) {
    // volunters : l'objet bénévole déjà sélectionné (pour l'afficher en haut de la popup)
    // onClose : une fonction fournie par le parent, à appeler pour fermer la popup
    // onSaved : une fonction fournie par le parent, à appeler quand la réparation est bien enregistrée

    const [form, setForm] = useState({    // form : les valeurs actuelles des champs du formulaire
        objet: "",
        duree: "",
        resultat: "reussie"
    });
    const [errors, setErrors] = useState({}); // errors : les messages d'erreur de validation, par champ
    const [isSaving, setIsSaving] = useState(false); // isSaving : true pendant l'appel réseau
    const [saveError, setSaveError] = useState(null); // saveError : message d'erreur si l'appel API échoue

    function handChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Appelée à chaque frappe/clic dans un champ. name correspond à l'attribut
        // name="objet" (ou duree, resultat) de l'input. [name]: value met à jour
        // dynamiquement la bonne clé de form, sans toucher aux autres (...prev copie le reste).
    }

    function valider() {
        const newErrors = {};
        if (!form.objet.trim()) newErrors.objet = "L'objet est requis";
        if (!form.duree || Number(form.duree) <= 0) newErrors.duree = "Durée invalide (en minutes)";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
        // Vérifie les champs avant envoi. Renvoie true/false pour dire au code
        // appelant si on peut continuer.
    }

    async function handSubmit(e) {
        e.preventDefault();
        if (!valider()) return;

        setIsSaving(true);
        try {
            const res = await fetch(ENDPOINTS.repairs, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    objet: form.objet,
                    benevoleId: volunters.id,
                    duree: Number(form.duree),
                    resultat: form.resultat
                })
            });
            if (!res.ok) throw new Error("Echec et mat");
            const savedRepair = await res.json();
            onSaved(savedRepair);
            onClose();
        } catch (err) {
            setSaveError("Impossible d'enregistrer...", err);
        } finally {
            setIsSaving(false);
        }
        // e.preventDefault() empêche le rechargement de page par défaut d'un <form>
        // Valide, sinon s'arrête
        // Envoie les données en POST à l'API
        // Si succès → prévient le parent (onSaved) et ferme la popup (onClose)
        // Si échec → affiche saveError
        // finally remet isSaving à false dans tous les cas
    }

    // Il manquait tout l'affichage (JSX) : sans ce "return", rien ne s'affiche à l'écran.
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-1">Saisir une réparation</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Bénévole : <strong>{volunters.prenom} {volunters.nom}</strong>
                </p>

                <form onSubmit={handSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Objet réparé</label>
                        <input
                            type="text"
                            name="objet"
                            value={form.objet}
                            onChange={handChange}
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.objet && <p className="text-red-500 text-sm">{errors.objet}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                        <input
                            type="number"
                            name="duree"
                            value={form.duree}
                            onChange={handChange}
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.duree && <p className="text-red-500 text-sm">{errors.duree}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Résultat</label>
                        <select name="resultat" value={form.resultat} onChange={handChange} className="w-full border rounded-md px-3 py-2">
                            <option value="reussie">Réussie</option>
                            <option value="echouee">Échouée</option>
                        </select>
                    </div>

                    {saveError && <p className="text-red-500 text-sm">{saveError}</p>}

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSaving}>Annuler</button>
                        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                            {isSaving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// VolunteersPage : le composant parent, il manquait entièrement dans votre code.
// C'est lui qui charge les bénévoles et décide quand ouvrir la popup.
export default function VolunteersPage() {
    const [volunters, setVolunters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null); // null = popup fermée

    useEffect(() => {
        fetch(ENDPOINTS.volunters)
            .then((res) => res.json())
            .then((data) => setVolunters(data))
            .finally(() => setIsLoading(false));
    }, []);

    function handleRepairSaved(repair) {
        console.log("Réparation enregistrée :", repair);
        // ici vous pourrez par exemple rafraîchir une liste de réparations
    }

    if (isLoading) return <p>Chargement...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Bénévoles</h1>
            <ul className="space-y-3">
                {volunters.map((v) => (
                    <li key={v.id} className="flex items-center justify-between border rounded-md p-4">
                        <span>{v.prenom} {v.nom}</span>
                        <button onClick={() => setSelectedVolunteer(v)} className="bg-gray-900 text-white px-3 py-2 rounded-md">
                            Réparer
                        </button>
                    </li>
                ))}
            </ul>

            {selectedVolunteer && (
                <RepairModal
                    volunters={selectedVolunteer}
                    onClose={() => setSelectedVolunteer(null)}
                    onSaved={handleRepairSaved}
                />
            )}
        </div>
    );
}
