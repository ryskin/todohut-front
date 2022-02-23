/* eslint-disable no-empty-pattern */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { EditableCell } from "./components/EditableCell";
import { DefaultColumnFilter } from "./components/filters/DefaultColumnFilter";
import { fuzzyTextFilterFn } from "./utils/filters";
import update from "immutability-helper";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { DotsVerticalIcon } from "@heroicons/react/outline";

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
  const [records, setRecords] = useState(data);

  const getRowId = useCallback((row) => {
    return row.id;
  }, []);

  useEffect(() => {
    setRecords(data);
  }, [data]);

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
      data: records,
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
      autoResetExpanded: false,
      getRowId,
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

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = records[dragIndex];
      const dropCard = records[hoverIndex];
      console.log(dragCard, dropCard);
      setRecords(
        update(records, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [records]
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
              <th></th>
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
          {page.map((row: Row<any>, index) => {
            prepareRow(row);
            return (
              <>
                <RowItems
                  index={index}
                  moveRow={moveRow}
                  row={row}
                  itemId={row?.original?.id}
                  {...row.getRowProps()}
                />
                {/* <tr
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

const TASK = "task";
const SUB_TASK = "subTask";

const RowItems = ({ row, index, moveRow, itemId }: any) => {
  const dropRef = useRef<any>(null);
  const dragRef = useRef<any>(null);

  const type = row.original.parent ? SUB_TASK : TASK

  const [, drop] = useDrop({
    accept: type,

    hover(item: any, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      console.log(dragIndex, hoverIndex);
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      console.log("type", type)
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: type,
    item: { itemId, index },
    isDragging: (monitor) => {
      return monitor.getItem().itemId === itemId;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  console.log(row.original.parent);

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <tr ref={dropRef} style={{ opacity }} id={row?.original?.id}>
      {!row.original.parent ? <td
        ref={dragRef}
        className="flex flex-row text-sm py-2 text-gray-200 items-center justify-center"
      >
        <DotsVerticalIcon className="w-6 h-6" />
      </td> : <td></td>}
      {row.cells.map((cell: Cell<any>) => {
        return (
          <td
            className="text-sm font-light px-3 py-2 whitespace-nowrap"
            {...cell.getCellProps()}
          >
            {cell.render("Cell")}
          </td>
        );
      })}
    </tr>
  );
};
