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

const StyledTableHeader = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
)(TableCell);

function TableChart(props: { data: Row[]; columns?: string[] }) {
  const tableColumns: string[] =
    props.columns === undefined ? Object.keys(props.data[0]) : props.columns;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns.map((columnName) => (
              <StyledTableHeader>{columnName}</StyledTableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow>
              {tableColumns.map((columnName) => (
                <TableCell>
                  {Number.isInteger(row[columnName])
                    ? row[columnName].toLocaleString("en")
                    : row[columnName]}
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
