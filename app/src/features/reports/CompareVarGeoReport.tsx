import React from "react";
import { Grid } from "@material-ui/core";
import VarGeoReport from "./VarGeoReport";
import { VariableId } from "../../utils/variableProviders";

function CompareMapNavReport(props: {
  variable: VariableId;
  fipsGeo1: string;
  fipsGeo2: string;
  updateGeo1Callback: Function;
  updateGeo2Callback: Function;
}) {
  return (
    <>
      <Grid container spacing={1} alignItems="flex-start">
        <Grid item xs={6}>
          <VarGeoReport
            variable={props.variable}
            stateFips={props.fipsGeo1}
            updateStateCallback={(fips: string) =>
              props.updateGeo1Callback(fips)
            }
            vertical={true}
          />
        </Grid>
        <Grid item xs={6}>
          <VarGeoReport
            variable={"diabetes_count"}
            stateFips={props.fipsGeo2}
            updateStateCallback={(fips: string) =>
              props.updateGeo2Callback(fips)
            }
            vertical={true}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default CompareMapNavReport;
