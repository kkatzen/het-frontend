import React from "react";
import TableChart from "../charts/TableChart";
import { Row } from "../data/DatasetTypes";
import { Alert } from "@material-ui/lab";
import CardWrapper from "./CardWrapper";

function TableCard(props: {
  datasetIds: string[];
  data: Row[];
  fields?: string[];
}) {
  return (
    <>
      {props.data.length === 0 && (
        <Alert severity="warning">
          Missing data means that we don't know the full story.
        </Alert>
      )}
      {props.data.length > 0 && (
        <CardWrapper datasetIds={props.datasetIds}>
          <TableChart data={props.data} fields={props.fields} />
        </CardWrapper>
      )}
    </>
  );
}

export default TableCard;
