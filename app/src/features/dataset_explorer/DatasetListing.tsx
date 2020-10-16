import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import styles from "./DatasetListing.module.scss";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

function DatasetListing(props: {
  source: { id: string; displayName: string; description: string };
  onPreview: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Paper className={styles.DataSourceListing}>
      <div className={styles.FlexRow}>
        <IconButton
          aria-label="expand dataset"
          onClick={() => setExpanded(!expanded)}
          className={styles.ExpandButton}
        >
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <div className={styles.FlexCol}>
          <div className={styles.FlexRow}>
            <div className={styles.DatasetTitle}>
              {props.source.displayName}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setExpanded(true);
                props.onPreview();
              }}
              className={styles.PreviewButton}
            >
              Preview
            </Button>
          </div>
          <div>{props.source.description}</div>
        </div>
      </div>
      <Collapse in={expanded} timeout="auto" className={styles.MoreInfo}>
        <p>
          More details... this should probably contain schema, publisher, etc.
        </p>
      </Collapse>
    </Paper>
  );
}

export default DatasetListing;
