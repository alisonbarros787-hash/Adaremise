// Composant  
// Il reçoit tout via props et se contente d'afficher un select + signaler les changements.
function FilterCategorie({ categories, selecteCategorie, onCategorieChange }) {
    return (
        <select
            value={selecteCategorie} // toujours synchronisé avec le state du parent
            onChange={(e) => onCategorieChange(e.target.value)} // signale le changement au parent
        >
            {categories.map((c) => (
                <option key={c} value={c}>
                    {c === "all" ? "Toutes les catégories" : c}
                </option>
            ))}
        </select>
    )
}

export default FilterCategorie