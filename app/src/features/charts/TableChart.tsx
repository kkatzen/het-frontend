import React from "react";
import { Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Row } from "../../utils/DatasetTypes";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";

export interface Field {
  readonly name: string;
  readonly displayName: string;
}

const StyledTableHeader = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
)(TableCell);

function TableChart(props: { data: Row[]; fields?: Field[] }) {
  const tableColumns: Field[] =
    props.fields === undefined
      ? Object.keys(props.data[0]).map((name) => ({
          name: name,
          displayName: name,
        }))
      : props.fields;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map((field) => (
              <StyledTableHeader>{field.displayName}</StyledTableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow>
              {tableColumns.map((field) => (
                <TableCell>
                  {Number.isInteger(row[field.name])
                    ? row[field.name].toLocaleString("en")
                    : row[field.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableChart;
