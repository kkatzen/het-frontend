import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import MapNavChart from "../charts/MapNavChart";
import TableChart from "../charts/TableChart";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, USA_DISPLAY_NAME, STATE_FIPS_MAP } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function CompareMapNavReport(props: {
  fipsGeo1: string;
  fipsGeo2: string;
  updateGeo1Callback: Function;
  updateGeo2Callback: Function;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders["diabetes_count"];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState()
        );

        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={6}>
              <MapNavChart
                data={dataset}
                fipsGeo={props.fipsGeo1}
                updateGeoCallback={(e: string) => props.updateGeo1Callback(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <MapNavChart
                data={dataset}
                fipsGeo={props.fipsGeo2}
                updateGeoCallback={(e: string) => props.updateGeo2Callback(e)}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default CompareMapNavReport;
