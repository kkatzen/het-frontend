import React from "react";
import { Grid } from "@material-ui/core";
import VarGeoReport from "./VarGeoReport";
import { DropdownVarId } from "../../utils/MadLibs";

function CompareMapNavReport(props: {
  variable: DropdownVarId;
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
            variable={props.variable}
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
