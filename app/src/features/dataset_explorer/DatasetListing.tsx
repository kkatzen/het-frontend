import React, { useState } from "react";
import { DatasetMetadata } from "../../utils/DatasetTypes";
import styles from "./DatasetListing.module.scss";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";

function DatasetListing(props: { dataset: DatasetMetadata }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card elevation={3}>
      <CardHeader
        title={props.dataset.name}
        subheader={props.dataset.description}
      />
      <Collapse in={expanded} timeout="auto" className={styles.MoreInfo}>
        <Table size="small" aria-label="dataset field descriptions">
          <TableBody>
            <TableRow>
              <TableCell width="21%">
                <b>Data Source</b>
              </TableCell>
              <TableCell>{props.dataset.data_source}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Geographic Level</b>
              </TableCell>
              <TableCell>{props.dataset.geographic_level}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Demographic Granularity</b>
              </TableCell>
              <TableCell>{props.dataset.demographic_granularity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Category</b>
              </TableCell>
              <TableCell>{props.dataset.category}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Collapse>
      <div className={styles.FirstCardFooter}>
        <div className={styles.CardFooterRight}>
          Download:
          <Button
            aria-label="expand dataset"
            onClick={() => alert("unimplemented")}
            size="small"
          >
            CSV
          </Button>
          <Button
            aria-label="expand dataset"
            onClick={() => alert("unimplemented")}
            size="small"
          >
            JSON
          </Button>
          <Button
            aria-label="expand dataset"
            onClick={() => alert("unimplemented")}
            size="small"
          >
            Excel
          </Button>
        </div>
        <div className={styles.CardFooterLeft}>
          <Button
            aria-label="expand dataset"
            onClick={() => setExpanded(!expanded)}
            data-testid={"expand-" + props.dataset.id}
            className={styles.ExpandButton}
            size="small"
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            {expanded ? "Less" : "More"}
          </Button>
        </div>
      </div>
      <div className={styles.SecondCardFooter}>
        <Typography
          variant="body2"
          component="p"
          className={styles.CardFooterRight}
        >
          Updated: {props.dataset.update_time}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          className={styles.CardFooterLeft}
        >
          Data source: {props.dataset.data_source}
        </Typography>
      </div>
    </Card>
  );
}

export default DatasetListing;
