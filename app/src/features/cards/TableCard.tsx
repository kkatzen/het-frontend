import React from "react";
import TableChart from "../charts/TableChart";
import Card from "@material-ui/core/Card";
import cardStyles from "./Card.module.scss";
import { Row } from "../../utils/DatasetTypes";

export interface Field {
  readonly name: string;
  readonly displayName: string;
}

function TableCard(props: { data: Row[]; fields?: Field[] }) {
  // TODO- would be nice if the header row didn't scroll with content
  return (
    <Card raised={true} className={cardStyles.ChartCard}>
      <div className={cardStyles.TableContainer}>
        <TableChart data={props.data} fields={props.fields} />
      </div>
    </Card>
  );
}

export default TableCard;
