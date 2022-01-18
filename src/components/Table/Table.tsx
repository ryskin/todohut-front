/* eslint-disable no-empty-pattern */
import { useMemo } from "react";
import {
  Cell,
  CellProps,
  Column,
  FilterValue,
  HeaderGroup,
  HeaderProps,
  Hooks,
  IdType,
  Row,
  useTable,
  useGroupBy,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useExpanded,
  usePagination,
  useRowSelect,
} from "react-table";
import { AddTaskForm } from "../AddTaskForm/AddTaskForm";
import { EditableCell } from "./components/EditableCell";
import { DefaultColumnFilter } from "./components/filters/DefaultColumnFilter";
import { fuzzyTextFilterFn } from "./utils/filters";

export interface Data {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  subRows?: Data[] | undefined;
  progress: number;
}

interface ITable<T extends object> {
  columns: ReadonlyArray<Column<T>>;
  data: T[];
  updateMyData?: any;
  skipPageReset?: boolean | undefined;
}

export const Table = ({
  columns,
  data,
  updateMyData,
  skipPageReset = false,
}: ITable<any>) => {
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (
        rows: Array<Row<any>>,
        ids: Array<IdType<any>>,
        filterValue: FilterValue
      ) => {
        return rows.filter((row) => {
          const rowValue = row.values[ids[0]];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
      Cell: EditableCell,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, groupBy, expanded, filters, selectedRowIds },
  } = useTable<any>(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      // nestExpandedRows: true,
      initialState: { pageIndex: 0, pageSize: 100 },
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data, undefined means using the default
      autoResetPage: !skipPageReset,
      // Do not reset hidden columns when columns change. Allows
      // for creating columns during render.
      autoResetHiddenColumns: false,
      autoResetResize: false,
    },
    useFilters,
    useGroupBy,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks: Hooks<any>) => {
      hooks.allColumns.push((columns) => [
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
            <div>
              <input
                type="checkbox"
                {...getToggleAllRowsSelectedProps()}
                className="rounded-full text-pink-500 h-3 w-3"
              />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }: CellProps<any>) => (
            <div>
              <input
                type="checkbox"
                {...row.getToggleRowSelectedProps()}
                className="rounded-full form-checkbox h-3 w-3 text-green-600"
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Render the UI for your table
  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200 shadow"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup: HeaderGroup<any>) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                // $ExpectType TableHeaderProps
                const headerProps = column.getHeaderProps();
                const {
                  // key: headerKey,
                  // className: headerClassName,
                  // style: headerStyle,
                  // role: headerRole,
                } = headerProps;
                const groupByToggleProps = column.getGroupByToggleProps();

                const sortByProps = column.getSortByToggleProps();
                // const {
                //   title: sortTitle,
                //   style: sortStyle,
                //   onClick: sortOnClick,
                // } = sortByProps;
                return (
                  <th
                    {...headerProps}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    <div>
                      {/* {column.canGroupBy ? (
                        // If the column can be grouped, let's add a toggle
                        <span {...groupByToggleProps}>{column.isGrouped ? '🛑 ' : '👊 '}</span>
                      ) : null} */}
                      <span {...sortByProps}>
                        {column.render("Header")}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </div>
                    {/* Render the columns filter UI */}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {page.map((row: Row<any>) => {
            prepareRow(row);
            return (
              <>
                <tr
                  {...row.getRowProps()}
                  className="bg-gradient-to-t from-gray-50 to-white hover:from-white-500 hover:to-blue-50"
                  id={row?.original?.id}
                >
                  {row.cells.map((cell: Cell<any>) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="text-sm font-light px-3 py-2 whitespace-nowrap"
                      >
                        {cell.isGrouped ? (
                          <>
                            <span {...row.getToggleRowExpandedProps()}>
                              {row.isExpanded ? "👇" : "👉"}
                            </span>{" "}
                            {cell.render("Cell", { editable: false })} (
                            {row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : (
                          // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell", { editable: false })
                        )}
                      </td>
                    );
                  })}
                </tr>
                {/* <tr>
                  <td colSpan={row.cells.length+1}>
                    <AddTaskForm
                      parentId={row.original.id}
                      statusId={row.original.status.id}
                    />
                  </td>
                </tr> */}
              </>
            );
          })}
        </tbody>
      </table>
      {/* <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre> */}
      {/*
  Pagination can be built however you'd like.
  This is just a very basic UI implementation:
*/}
      {/* <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={previousPage} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={nextPage} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              groupBy,
              expanded,
              filters,
              selectedRowIds,
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  );
};
