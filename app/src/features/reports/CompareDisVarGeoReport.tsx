import React from "react";
import { Grid } from "@material-ui/core";
import { VariableId } from "../../utils/variableProviders";
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
