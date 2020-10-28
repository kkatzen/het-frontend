import React, { useState } from "react";
import { DatasetMetadata, Field } from "../../utils/DatasetTypes";
import styles from "./DatasetListing.module.scss";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DownloadButton from "./DownloadButton";

function FieldsTable(props: { fields: Array<Field> }) {
  return (
    <Table size="small" aria-label="dataset field descriptions">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Data Type</TableCell>
          <TableCell>Data Source ID</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.fields.map((field, index) => (
          <TableRow key={index}>
            <TableCell>{field.name}</TableCell>
            <TableCell>{field.description}</TableCell>
            <TableCell>{field.data_type}</TableCell>
            <TableCell>{field.origin_dataset}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DatasetListing(props: {
  dataset: DatasetMetadata;
  onPreview: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Paper className={styles.DataSourceListing}>
      <div className={styles.FlexRow}>
        <IconButton
          aria-label="expand dataset"
          onClick={() => setExpanded(!expanded)}
          data-testid={"expand-" + props.dataset.id}
          className={styles.ExpandButton}
        >
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <div className={styles.FlexCol}>
          <div className={styles.FlexRow}>
            <div className={styles.DatasetTitle}>{props.dataset.name}</div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setExpanded(true);
                props.onPreview();
              }}
              data-testid={"preview-" + props.dataset.id}
              className={styles.PreviewButton}
            >
              Preview
            </Button>
            <DownloadButton
              className={styles.PreviewButton}
              datasetId={props.dataset.id}
            ></DownloadButton>
          </div>
          <div>{props.dataset.description}</div>
        </div>
      </div>
      <Collapse in={expanded} timeout="auto" className={styles.MoreInfo}>
        <FieldsTable fields={props.dataset.fields} key={props.dataset.id} />
      </Collapse>
    </Paper>
  );
}

export default DatasetListing;
