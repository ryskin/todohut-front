import { FilterProps } from "react-table";

export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, parent },
}: FilterProps<any>) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      className="bg-gray-50"
      placeholder={`Search ${count} records...`}
    />
  );
}
