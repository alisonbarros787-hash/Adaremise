function FilterStatus({ statusFilter, selectStatus, onChangeStatus }) {
    return (
        <select value={selectStatus} onChange={(s) => onChangeStatus(s.target.value)}>
          {statusFilter.map((s) => (
            <option key={s} value={s}>
                {s === "all" ? "Tous les Status" : s}
            </option>
          ))}
        </select>
    )
}


export default FilterStatus
