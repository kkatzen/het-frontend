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

function CompareMapNavReport(props: {
  variable: VariableId;
  fipsGeo1: string;
  fipsGeo2: string;
  updateGeo1Callback: Function;
  updateGeo2Callback: Function;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState().andRace()
        );

        return (
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
        );
      }}
    </WithDatasets>
  );
}

export default CompareMapNavReport;
