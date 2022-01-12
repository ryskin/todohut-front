import {
  UseExpandedOptions,
  UseFiltersOptions,
  UseGlobalFiltersOptions,
  UseGroupByOptions,
  UsePaginationOptions,
  UseResizeColumnsOptions,
  UseRowSelectOptions,
  UseRowStateOptions,
  UseSortByOptions,
  UseColumnOrderInstanceProps,
  UseExpandedInstanceProps,
  UseFiltersInstanceProps,
  UseGlobalFiltersInstanceProps,
  UseGroupByInstanceProps,
  UsePaginationInstanceProps,
  UseRowSelectInstanceProps,
  UseRowStateInstanceProps,
  UseSortByInstanceProps,
  UseColumnOrderState,
  UseExpandedState,
  UseFiltersState,
  UseGlobalFiltersState,
  UseGroupByState,
  UsePaginationState,
  UseResizeColumnsState,
  UseRowSelectState,
  UseRowStateState,
  UseSortByState,
  UseFiltersColumnOptions,
  UseGlobalFiltersColumnOptions,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
  UseSortByColumnOptions,
  UseFiltersColumnProps,
  UseGroupByColumnProps,
  UseResizeColumnsColumnProps,
  UseSortByColumnProps,
  UseGroupByCellProps,
  UseRowStateCellProps,
  UseExpandedRowProps,
  UseGroupByRowProps,
  UseRowSelectRowProps,
  UseRowStateRowProps,
} from "react-table";

declare module "react-table" {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D> {
    updateMyData: (rowIndex: number, columnId: string, value: any) => void;
  }

  interface TableInstance<D extends object = {}>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {
    editable: boolean;
  }

  interface TableState<D extends object = {}>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  interface ColumnInterface<D extends object = {}>
    extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {}

  interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  interface Cell<D extends object = {}>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {}
}
