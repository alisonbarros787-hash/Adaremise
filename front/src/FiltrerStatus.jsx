// Fitre de l'état des objets

function FiltrerStatus({ statusFilter, selectStatus, onChangeStatus }) {
    return (
        <select value={selectStatus} onChange={(s) => onChangeStatus(s.target.value)}>
          {statusFilter.map((s) => (
            <option key={s} value={s}>
                {s === "all" ? "Tous les Statuts" : s.replaceAll("_", " ")} 
                 {/*replaceAll : permet d'enlever l'endorscore et de mettre un "espace"*/}
            </option>
          ))}
        </select>
    )
}

export default FiltrerStatus


