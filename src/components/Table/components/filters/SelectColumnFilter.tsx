// This is a custom filter UI for selecting

import { useMemo } from "react";
import { FilterProps } from "react-table";

// a unique option from a list
export function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: FilterProps<any>) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() => {
        const options = new Set<any>();
        preFilteredRows.forEach(row => {
            options.add(row.values[id]);
        });
        return [...Array.from(options.values())];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}