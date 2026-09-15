import { useState } from "react";

const ENDPOINTS = {
    volunters: "http://localhost:3000/api/personnes/benevoles",
    repairs: "http://localhost:3000/api/reparations"
};

export function RepairModal({ volunters, onClose, onSaved }) {
    const [form, setForm] = useState({
        objet: "",
        duree: "",
        resultat: "reussie"
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    function handChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function valider() {
        const newErrors = {};
        if (!form.objet.trim()) newErrors.objet = "L'objet est requis";
        if (!form.duree || Number(form.duree) <= 0) newErrors.duree = "Durée invalide (en minutes)";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            if (!res.ok) throw new Error("Échec de l'enregistrement");
            const savedRepair = await res.json();
            onSaved(savedRepair);
            onClose();
        } catch (err) {
            setSaveError("Impossible d'enregistrer la réparation...");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Saisir une réparation</h3>
                <p className="modal-subtitle">
                    Bénévole : <strong>{volunters?.prenom} {volunters?.nom}</strong>
                </p>

                <form onSubmit={handSubmit}>
                    <div className="form-group">
                        <label>Objet réparé</label>
                        <input
                            type="text"
                            name="objet"
                            value={form.objet}
                            onChange={handChange}
                        />
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

                    {saveError && <p className="error-text">{saveError}</p>}

                    <div className="modal-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={onClose} 
                            disabled={isSaving}
                        >
                            Annuler
                        </button>
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
