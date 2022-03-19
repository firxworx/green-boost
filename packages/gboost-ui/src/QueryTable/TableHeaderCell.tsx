import { ReactElement, useCallback, useRef } from "react";
import { Button, TableCell } from "@aws-amplify/ui-react";
import { config, styled } from "../stitches.config.js";
import * as Stitches from "@stitches/react";
import { MdArrowDownward, MdArrowUpward, MdFilterList } from "react-icons/md";
import { Column, Sort } from "./QueryTable.js";
import { Box } from "../Box.js";
import { RefObject } from "react";

const StyledTableCell = styled(TableCell, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
const StyledHeaderButton = styled(Button, { px: "$1" });
const StyledArrowUpward = styled(MdArrowUpward);
const StyledArrowDownward = styled(MdArrowDownward);
const StyledFilterList = styled(MdFilterList);

interface TableHeaderCellProps<T> {
  activeFilter: boolean;
  backgroundColor: string;
  column: Column<T>;
  filterButtonRef: RefObject<HTMLButtonElement>;
  onCreateSort: (sort: Sort) => void;
  onRemoveSort: (column: string) => void;
  onUpdateSort: (column: string, direction: "asc" | "desc") => void;
  padding: string;
  sort?: Sort;
}

export function TableHeaderCell<T>(
  props: TableHeaderCellProps<T>
): ReactElement {
  const {
    activeFilter,
    backgroundColor,
    column,
    filterButtonRef,
    onCreateSort: handleCreateSort,
    onRemoveSort: handleRemoveSort,
    onUpdateSort: handleUpdateSort,
    padding,
    sort,
  } = props;
  const sortButton = useRef<HTMLButtonElement>(null);
  const handleClick = useCallback(() => {
    if (sort) {
      if (sort.direction === "asc") {
        handleUpdateSort(column.accessor, "desc");
      } else {
        handleRemoveSort(column.accessor);
        sortButton.current?.blur();
      }
    } else {
      handleCreateSort({ column: column.accessor, direction: "asc" });
    }
  }, [
    column.accessor,
    handleUpdateSort,
    handleRemoveSort,
    handleCreateSort,
    sort,
  ]);
  let buttonCss: Stitches.CSS<typeof config> = {};
  let iconCss: Stitches.CSS<typeof config> = {};
  if (sort) {
    buttonCss = {
      visibility: "visible",
      width: "auto",
    };
    iconCss = {
      color: "black",
      fontWeight: "bolder",
    };
  } else {
    buttonCss = {
      visibility: "hidden",
      width: 0,
    };
    iconCss = {
      color: "$grey7",
    };
  }
  return (
    <StyledTableCell
      as="th"
      // amplify-table__th is removed when using display: "contents"
      // is used for thead, tbody, and tr's
      className="amplify-table__th"
      css={{
        padding,
        bc: backgroundColor,
        [`&:hover`]: {
          [`& ${StyledHeaderButton}`]: {
            visibility: "visible",
            width: "auto",
          },
        },
      }}
    >
      <Box css={{ display: "flex", gap: "$1", height: "100%" }}>
        <Box css={{ alignSelf: "end" }}>{column.name}</Box>
        {activeFilter && (
          <StyledHeaderButton
            variation="link"
            onClick={() => filterButtonRef.current?.click()}
          >
            <StyledFilterList css={{ color: "black" }} />
          </StyledHeaderButton>
        )}
        {column.sortable && (
          <StyledHeaderButton
            ref={sortButton}
            css={buttonCss}
            onClick={handleClick}
            variation="link"
          >
            {sort?.direction === "desc" ? (
              <StyledArrowDownward css={iconCss} />
            ) : (
              <StyledArrowUpward css={iconCss} />
            )}
          </StyledHeaderButton>
        )}
      </Box>
    </StyledTableCell>
  );
}
