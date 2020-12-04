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
import { ALL_RACES_DISPLAY_NAME, USA_FIPS } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import MapNavChart from "../charts/MapNavChart";

function VarGeoReport(props: {
  variable: VariableId;
  stateFips: string;
  updateStateCallback: Function;
  vertical?: boolean;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);
  const [countyFips, setCountyFips] = useState<string | undefined>();

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState().andRace()
        );

        let tableDataset =
          props.stateFips === USA_FIPS
            ? variableProvider.getData(
                datasetStore.datasets,
                Breakdowns.national().andRace()
              )
            : dataset.filter((r) => r.state_fips_code === props.stateFips);

        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid
              item
              xs={12}
              sm={12}
              md={props.vertical ? 12 : 6}
              className={styles.PaddedGrid}
            >
              <MapNavChart
                data={dataset}
                fipsGeo={props.stateFips}
                countyFips={countyFips}
                updateGeoCallback={(e: string) => {
                  console.log(e);
                  if (e.length === 5) {
                    setCountyFips(e);
                    // props.updateStateCallback(e.substring(0,2));
                  } else {
                    setCountyFips(undefined);
                    props.updateStateCallback(e);
                  }
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={props.vertical ? 12 : 6}
              className={styles.PaddedGrid}
            >
              {!countyFips && (
                <TableChart
                  data={tableDataset}
                  fields={[
                    { name: "race", displayName: "Race and Ethnicity" },
                    {
                      name: props.variable,
                      displayName: variableProvider.variableName,
                    },
                  ]}
                />
              )}
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default VarGeoReport;
