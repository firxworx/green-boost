import {
  ReactElement,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  Alert,
  Placeholder,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableProps,
} from "@aws-amplify/ui-react";
import { randomId } from "@mantine/hooks";
import { Box } from "../Box.js";
import { Pagination } from "./Pagination.js";
import { styled } from "../stitches.config.js";
import { ActionBar } from "./ActionBar/ActionBar.js";
import {
  Filter,
  FilterOptions,
  InternalFilter,
} from "./ActionBar/FilterAction/FilterAction.js";
import type { Density } from "./ActionBar/DensityAction.js";
import { TableHeaderCell } from "./TableHeaderCell.js";
import { SelectionHeader } from "./SelectionHeader.js";
import { SelectionCell } from "./SelectionCell.js";

const StyledPlaceholder = styled(Placeholder, { height: 55 });
const StyledTable = styled(Table, { display: "grid" });
// https://adamlynch.com/flexible-data-tables-with-css-grid/
const StyledTableHead = styled(TableHead, {
  display: "contents !important",
});
const StyledTableBody = styled(TableBody, { display: "contents !important" });
const StyledTableRow = styled(TableRow, { display: "contents !important" });
export const StyledTableCell = styled(TableCell, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;
export interface Column<T> {
  accessor: Extract<keyof T, string>;
  filterOptions?: FilterOptions;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell?: (value: any, row: T) => ReactElement | string;
  /**
   * @default false
   */
  sortable?: boolean;
  /**
   * Defines max argument in grid-template-columns property
   * minmax(150px, insert-width)
   * @example "20%"
   * @example "400px"
   * @default "1fr"
   */
  width?: string;
}
export interface Sort {
  column: string;
  direction: "asc" | "desc";
}
export interface OnQueryParams {
  filters: Filter[];
  nextToken: string;
  pageSize: number;
  sorts: Sort[];
}
type OnQuerySuccessReturnValue = {
  rows: Row[];
  nextToken: string;
};
type OnQueryErrorReturnValue = {
  errorMessage: string;
};
export type OnQueryReturnValue =
  | OnQuerySuccessReturnValue
  | OnQueryErrorReturnValue;
type SelectAction = "select" | "unselect";
interface QueryTableProps<T> {
  columns: Column<T>[];
  /**
   * @default false
   */
  disableMultiSort?: boolean;
  /**
   * @default false
   */
  disableMultiFilter?: boolean;
  /**
   * Enable CSV file download
   * @default false
   */
  download?: boolean;
  /**
   * If download enabled, sets file name
   * @default "data.csv"
   */
  downloadFileName?: string;
  /**
   * Enables ability to select rows with checkboxes
   * @default false
   */
  enableSelect?: boolean;
  /**
   * Use radio buttons instead of checkboxes
   * @default false
   */
  enableSingleSelect?: boolean;
  /**
   * Function to get id for reach row
   * @default (r) => r.id
   */
  getRowId?: (r: T) => string;
  /**
   * @default "$primary5"
   */
  headerBackgroundColor?: string;
  /**
   * Title of table
   */
  heading?: string;
  /**
   * Default padding in table cells
   * @default "standard"
   */
  initDensity?: Density;
  /**
   * Initial filters. Columns must have filterable: true
   */
  initFilters?: Filter[];
  /**
   * Number of rows per page
   * @default 10
   */
  initPageSize?: number;
  /**
   * Initial sorts. Columns must have sortable: true in definition
   */
  initSorts?: Sort[];
  /**
   * Initial selected rows.
   */
  initSelected?: T[];
  /**
   * Function called to query data from external data source. Params include:
   * nextToken, filterModel, selectionModel, and sortModel. Must return object
   * with rows and nextToken or errorMessage.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onQuery: (params: OnQueryParams) => Promise<OnQueryReturnValue>;
  /**
   * Function called upon update to selected rows
   */
  onSelect?: (action: SelectAction, rows: T[], selected: T[]) => void;
  /**
   * Action Button Component placed on top right of table, often used for creating a row or
   * displaying an actions menu button for user to perform actions on selected
   * row
   */
  ActionButton?: ReactElement;
  /**
   * Amplify UI TableProps to be passes to the table
   */
  tableProps?: TableProps;
}

const densityToPadding: Record<Density, string> = {
  cozy: ".5rem !important",
  standard: "1rem !important",
  comfy: "1.5rem !important",
};

interface TableState<T> {
  columnVisibility: Record<string, boolean>;
  density: Density;
  errorMessage: string;
  filters: InternalFilter[];
  loading: boolean;
  nextToken: string;
  nextNextToken: string;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  prevTokens: string[];
  rows: T[];
  selected: T[];
  sorts: Sort[];
}

type Action<T> =
  | {
      type: "changeColumnVisibility";
      columnVisibility: Record<string, boolean>;
    }
  | { type: "changeDensity"; density: Density }
  | { type: "changeError"; message: string }
  | { type: "changeLoading"; loading: boolean }
  | { type: "changePage"; page: number }
  | { type: "changePageSize"; pageSize: number }
  | { type: "changeRows"; rows: T[]; nextNextToken: string }
  | { type: "changeSelected"; selected: T[] }
  | { type: "filter"; filters: InternalFilter[] }
  | { type: "refresh" }
  | { type: "sort"; sorts: Sort[] }
  | { type: "unknown" };

function tableReducer<T>(
  state: TableState<T>,
  action: Action<T>
): TableState<T> {
  switch (action.type) {
    case "changeColumnVisibility":
      return { ...state, columnVisibility: action.columnVisibility };
    case "changeDensity":
      return { ...state, density: action.density };
    case "changeError":
      return { ...state, loading: false, errorMessage: action.message };
    case "changeLoading":
      return { ...state, loading: action.loading, errorMessage: "" };
    case "changePage":
      let nextToken = state.nextToken;
      let prevTokens = state.prevTokens;
      if (action.page > state.page) {
        // next page
        nextToken = state.nextNextToken;
        // if (state.nextToken) {
        // prevents empty string being added for first page
        prevTokens = [...state.prevTokens, state.nextToken];
        // }
      } else if (action.page < state.page) {
        // action.page / state.page are 1-based
        // indexing on state.prevTokens is 0-based
        nextToken = state.prevTokens[action.page - 1];
        prevTokens = state.prevTokens.slice(0, action.page - 1);
      }
      return {
        ...state,
        nextToken,
        prevTokens,
        page: action.page,
      };
    case "changePageSize": // reset currentToken, nextToken, prevTokens
      return {
        ...state,
        nextToken: "",
        nextNextToken: "",
        pageSize: action.pageSize,
        prevTokens: [],
      };
    case "changeRows":
      return {
        ...state,
        rows: action.rows,
        nextNextToken: action.nextNextToken,
        loading: false,
      };
    case "changeSelected":
      return {
        ...state,
        selected: action.selected,
      };
    case "filter":
      return { ...state, filters: action.filters };
    case "refresh":
      // trigger useEffect to run again
      return { ...state, filters: [...state.filters] };
    case "sort":
      return { ...state, sorts: action.sorts };
    default:
      throw new Error(`Unknown action ${action.type as string}`);
  }
}
const defaultErrorMessage = "Something went wrong";

/**
 * Table component with powerful onQuery prop useful for server side or client
 * side pagination. First class token pagination support with page number
 * pagination also supported. Features filtering, sorting, and custom column
 * widths through columns prop.
 * @component Component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function QueryTable<T extends Record<string, any>>({
  columns = [],
  disableMultiSort = false,
  disableMultiFilter = false,
  download = false,
  downloadFileName = "data.csv",
  enableSelect = false,
  enableSingleSelect = false,
  getRowId = (r: T) => r.id,
  headerBackgroundColor = "$primary5",
  initDensity = "standard",
  initFilters = [],
  initPageSize = 10,
  initSelected = [],
  initSorts = [],
  heading,
  onQuery,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelect = (s) => {},
  ActionButton,
  tableProps,
}: QueryTableProps<T>): ReactElement {
  let spanTableEl: ReactElement | undefined;
  const [
    {
      columnVisibility,
      density,
      errorMessage,
      filters,
      loading,
      nextToken,
      nextNextToken,
      page,
      pageSize,
      pageSizeOptions,
      prevTokens,
      rows,
      selected,
      sorts,
    },
    dispatch,
  ] = useReducer<Reducer<TableState<T>, Action<T>>>(tableReducer, {
    columnVisibility: columns.reduce(
      (prev, cur) => ({ ...prev, [cur.name]: true }),
      {}
    ),
    density: initDensity,
    errorMessage: "",
    filters: initFilters.map((f) => ({ ...f, id: randomId() })),
    loading: false,
    nextToken: "",
    nextNextToken: "",
    page: 1,
    pageSize: initPageSize,
    pageSizeOptions: [10, 20, 50],
    prevTokens: [],
    rows: [],
    selected: initSelected,
    sorts: initSorts,
  });
  useEffect(() => {
    async function fetchData() {
      try {
        dispatch({ type: "changeLoading", loading: true });
        const externalFilters = filters.map((f) => {
          const { id, ...externalFilter } = f;
          return externalFilter;
        });
        const res = await onQuery({
          filters: externalFilters,
          nextToken,
          pageSize,
          sorts,
        });
        if ("rows" in res) {
          dispatch({
            type: "changeRows",
            nextNextToken: res.nextToken,
            rows: res.rows,
          });
        } else {
          dispatch({
            type: "changeError",
            message: res.errorMessage || defaultErrorMessage,
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: "changeError", message: defaultErrorMessage });
      }
    }
    fetchData();
  }, [filters, nextToken, onQuery, pageSize, sorts]);
  const handlePageChange = useCallback(async (newPage: number) => {
    dispatch({ type: "changePage", page: newPage });
  }, []);
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    dispatch({ type: "changePageSize", pageSize: newPageSize });
  }, []);
  if (errorMessage) {
    spanTableEl = <Alert variation="error">{errorMessage}</Alert>;
  } else if (loading) {
    spanTableEl = (
      <Box
        css={{ display: "flex", gap: "$1", flexDirection: "column", my: "$2" }}
      >
        {[...Array(10)].map((e, i) => (
          <StyledPlaceholder key={i} />
        ))}
      </Box>
    );
  }
  const handleFilter = useCallback((newFilters: InternalFilter[]) => {
    dispatch({ type: "filter", filters: newFilters });
  }, []);
  const handleCreateSort = useCallback(
    (sort) =>
      dispatch({
        type: "sort",
        sorts: disableMultiSort ? [...sorts, sort] : [sort],
      }),
    [disableMultiSort, sorts]
  );
  const handleUpdateSort = useCallback(
    (column: string, direction: "asc" | "desc") => {
      const newSorts: Sort[] = [];
      for (const s of sorts) {
        if (s.column === column) {
          newSorts.push({ column, direction });
        } else {
          newSorts.push(s);
        }
      }
      dispatch({ type: "sort", sorts: newSorts });
    },
    [sorts]
  );
  const handleRemoveSort = useCallback(
    (column: string) => {
      dispatch({
        type: "sort",
        sorts: sorts.filter((s) => s.column !== column),
      });
    },
    [sorts]
  );
  const handleSelect = useCallback(
    (row: T) => {
      const newSelected = enableSingleSelect ? [row] : [...selected, row];
      dispatch({ type: "changeSelected", selected: newSelected });
      onSelect("select", [row], newSelected);
    },
    [enableSingleSelect, onSelect, selected]
  );
  const handleUnselect = useCallback(
    (row: T) => {
      const newSelected = selected.filter((s) => getRowId(s) !== getRowId(row));
      dispatch({ type: "changeSelected", selected: newSelected });
      onSelect("unselect", [row], newSelected);
    },
    [getRowId, onSelect, selected]
  );
  const handleSelectAll = useCallback(() => {
    dispatch({ type: "changeSelected", selected: rows });
    onSelect("select", rows, rows);
  }, [onSelect, rows]);
  const handleUnselectAll = useCallback(() => {
    dispatch({ type: "changeSelected", selected: [] });
    onSelect("unselect", rows, []);
  }, [onSelect, rows]);
  const visibleColumns = useMemo(
    () => columns.filter((c) => columnVisibility[c.name]),
    [columns, columnVisibility]
  );
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const gridTemplateColumns = useMemo(() => {
    let gridTempCols = visibleColumns.reduce(
      (prev, cur) => `${prev} minmax(150px, ${cur.width || "1fr"})`,
      ""
    );
    if (enableSelect) gridTempCols = "50px " + gridTempCols;
    return gridTempCols;
  }, [enableSelect, visibleColumns]);
  const showBody = !errorMessage && !loading;
  const padding = densityToPadding[density];
  return (
    <>
      <ActionBar
        columns={columns}
        columnVisibility={columnVisibility}
        density={density}
        disableMultiFilter={disableMultiFilter}
        download={download}
        downloadFileName={downloadFileName}
        filters={filters}
        filterButtonRef={filterButtonRef}
        heading={heading}
        onChangeColumnVisibility={(columnVisibility: Record<string, boolean>) =>
          dispatch({ type: "changeColumnVisibility", columnVisibility })
        }
        onChangeDensity={(density) =>
          dispatch({ type: "changeDensity", density })
        }
        onFilter={handleFilter}
        rows={rows}
        ActionMenu={ActionButton}
      />
      <StyledTable {...tableProps} css={{ gridTemplateColumns }}>
        <StyledTableHead>
          <StyledTableRow>
            {enableSelect && (
              <SelectionHeader
                backgroundColor={headerBackgroundColor}
                enableSingleSelect={enableSingleSelect}
                onSelectAll={handleSelectAll}
                onUnselectAll={handleUnselectAll}
                padding={padding}
                rows={rows}
                selected={selected}
              />
            )}
            {visibleColumns.map((c, i) => (
              <TableHeaderCell
                key={c.accessor}
                activeFilter={filters.some((f) => f.column === c.accessor)}
                backgroundColor={headerBackgroundColor}
                column={c}
                filterButtonRef={filterButtonRef}
                onCreateSort={handleCreateSort}
                onUpdateSort={handleUpdateSort}
                onRemoveSort={handleRemoveSort}
                padding={padding}
                sort={sorts.find((s) => s.column === c.accessor)}
              />
            ))}
          </StyledTableRow>
        </StyledTableHead>
        {showBody && (
          <StyledTableBody>
            {rows.map((r) => (
              <StyledTableRow key={getRowId(r)} rowSpan={columns.length}>
                {enableSelect && (
                  <SelectionCell
                    enableSingleSelect={enableSingleSelect}
                    padding={padding}
                    onSelect={handleSelect}
                    onUnselect={handleUnselect}
                    row={r}
                    selected={selected.some((s) => getRowId(s) === getRowId(r))}
                  />
                )}
                {visibleColumns.map((c) => (
                  <StyledTableCell key={c.accessor} css={{ padding }}>
                    {c.renderCell
                      ? c.renderCell(r[c.accessor], r)
                      : r[c.accessor]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </StyledTableBody>
        )}
      </StyledTable>
      {spanTableEl}
      <Pagination
        disableNext={!nextNextToken}
        disablePrev={!prevTokens.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
      />
    </>
  );
}
