import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import { Breakdowns } from "../../utils/Breakdowns";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import VariableProvider from "../../utils/variables/VariableProvider";
import DisparityBarChartCard from "../cards/DisparityBarChartCard";
import MapNavCardWithFilter from "../cards/MapNavCardWithFilter";
import TableChart from "../charts/TableChart";
import { DropdownVarId } from "../../utils/MadLibs";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Alert from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";
import { Fips } from "../../utils/Fips";
import cardStyles from "./Card.module.scss";
import { Row } from "../../utils/DatasetTypes";

export interface Field {
  readonly name: string;
  readonly displayName: string;
}

function TableCard(props: { data: Row[]; fields?: Field[] }) {
  return (
    <Card raised={true} className={cardStyles.TableCard}>
      <TableChart data={props.data} fields={props.fields} />
    </Card>
  );
}

export default TableCard;
