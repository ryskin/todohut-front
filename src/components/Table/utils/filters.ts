import { FilterValue, IdType, Row } from "react-table";
import { matchSorter } from "match-sorter";

export function filterGreaterThan(
    rows: Array<Row<any>>,
    id: Array<IdType<any>>,
    filterValue: FilterValue
) {
    return rows.filter((row) => {
        const rowValue = row.values[id[0]];
        return rowValue >= filterValue;
    });
}

export function fuzzyTextFilterFn<T extends object>(
    rows: Array<Row<T>>,
    ids: Array<IdType<T>>,
    filterValue: FilterValue
) {
    //   return matchSorter(rows, filterValue, {
    //     keys: [(row: Row<any>) => row.values[id]],
    //   });
    return rows;
}

export const textSearch = (rows: Array<Row<any>>, ids: Array<IdType<any>>, filterValue: FilterValue) => {
    return rows.filter(row => {
        const rowValue = row.values[ids[0]];
        return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
    });
};

export function roundedMedian(values: any[]) {
    let min = values[0] || '';
    let max = values[0] || '';

    values.forEach(value => {
        min = Math.min(min, value);
        max = Math.max(max, value);
    });

    return Math.round((min + max) / 2);
}