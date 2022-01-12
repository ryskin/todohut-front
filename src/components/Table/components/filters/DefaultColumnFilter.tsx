import { FilterProps } from "react-table";

export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, parent },
}: FilterProps<any>) {
  const count = preFilteredRows.length;

  const foo = parent; // $ExpectType ColumnInstance<Data> | undefined

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}
