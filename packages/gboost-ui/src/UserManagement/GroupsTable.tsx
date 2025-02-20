import { type ReactElement, useMemo } from "react";
import { listGroups } from "./gql.js";
import { type CognitoGroup } from "gboost-common";
import { Link, useTheme } from "@aws-amplify/ui-react";
import { Link as RouterLink } from "react-router-dom";
import {
  type Column,
  QueryTable,
  type OnQueryReturnValue,
} from "../OldQueryTable/QueryTable.js";
import { gQuery } from "../index.js";
import { renderDate } from "./common.js";
import { useMediaQuery } from "@mantine/hooks";

interface ListGroupsResponse {
  listGroups: {
    groups: CognitoGroup[];
    nextToken: string;
  };
}

async function handleQuery(): Promise<OnQueryReturnValue<CognitoGroup>> {
  try {
    const res = await gQuery({ query: listGroups });
    const { nextToken, groups: rows } = (res as ListGroupsResponse).listGroups;
    return { rows, nextToken: nextToken ?? "" };
  } catch (err) {
    console.error(err);
    return { errorMessage: err as string };
  }
}

export function GroupsTable(): ReactElement {
  const theme = useTheme();
  const mqLg = useMediaQuery(
    `(min-width: ${theme.breakpoints?.values?.large}px)`
  );
  const columns: Column<CognitoGroup>[] = useMemo(
    () => [
      {
        accessor: "name",
        name: "Name",
        renderCell: (name) => (
          <Link as={RouterLink} to={`./${name}`}>
            {name}
          </Link>
        ),
      },
      { accessor: "description", name: "Description", width: "3fr" },
      { accessor: "precedence", name: "Precedence" },
      {
        accessor: "createdAt",
        name: "Created At",
        renderCell: renderDate,
        width: !mqLg ? "0" : "2fr",
      },
      {
        accessor: "updatedAt",
        name: "Updated At",
        renderCell: renderDate,
        width: !mqLg ? "0" : "2fr",
      },
    ],
    [mqLg]
  );
  return (
    <QueryTable
      columns={columns}
      getRowId={(r) => r.name}
      heading="Groups"
      onQuery={handleQuery}
    />
  );
}
