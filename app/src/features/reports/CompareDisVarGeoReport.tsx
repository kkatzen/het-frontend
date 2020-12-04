import React, { useState, useEffect } from "react";
import { Grid, Table } from "@material-ui/core";
import MapNavChart from "../charts/MapNavChart";
import TableChart from "../charts/TableChart";
import VarGeoReport from "./VarGeoReport";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, USA_DISPLAY_NAME, STATE_FIPS_MAP } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import DisVarGeoReport from "./DisVarGeoReport";

function CompareDisVarGeoReport(props: {
  variable: VariableId;
  fipsGeo1: string;
  fipsGeo2: string;
}) {
  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={6}>
        <DisVarGeoReport variable={props.variable} stateFips={props.fipsGeo1} />
      </Grid>
      <Grid item xs={6}>
        <DisVarGeoReport variable={props.variable} stateFips={props.fipsGeo2} />
      </Grid>
    </Grid>
  );
}

export default CompareDisVarGeoReport;
