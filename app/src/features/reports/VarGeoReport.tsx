import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import TableChart from "../charts/TableChart";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styles from "./Report.module.scss";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { ALL_RACES_DISPLAY_NAME } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import MapNavChart from "../charts/MapNavChart";

function VarGeoReport(props: {
  variable: VariableId;
  stateFips: string;
  updateGeoCallback: Function;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);
  const [race, setRace] = useState<string>(ALL_RACES_DISPLAY_NAME);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        const breakdowns =
          race === ALL_RACES_DISPLAY_NAME
            ? Breakdowns.byState()
            : Breakdowns.byState().andRace();
        let dataset = variableProvider
          .getData(datasetStore.datasets, breakdowns)
          .filter((r) => r.race === race);

        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
              <MapNavChart
                data={dataset}
                fipsGeo={props.stateFips}
                updateGeoCallback={(e: string) => props.updateGeoCallback(e)}
              />
              <TableChart
                data={dataset}
                fields={[
                  { name: "state_name", displayName: "State name" },
                  {
                    name: props.variable,
                    displayName: variableProvider.variableName,
                  },
                ]}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default VarGeoReport;
