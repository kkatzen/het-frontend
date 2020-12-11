import React from "react";
import { Grid } from "@material-ui/core";
import TableCard from "../cards/TableCard";
import styles from "./Report.module.scss";
import WithDatasets from "../data/WithDatasets";
import useDatasetStore from "../data/useDatasetStore";
import { DropdownVarId } from "../utils/madlib/MadLibs";
import { VARIABLE_DISPLAY_NAMES } from "../utils/madlib/DisplayNames";
import variableProviders, { VariableId } from "../data/variableProviders";
import { Breakdowns } from "../data/Breakdowns";
import VariableProvider from "../data/variables/VariableProvider";
import { USA_FIPS, Fips } from "../utils/madlib/Fips";
import MapCard from "../cards/MapCard";
import Alert from "@material-ui/lab/Alert";

// TODO - remove hardcoded values when we have full support
const SUPPORTED_MADLIB_VARIABLES: DropdownVarId[] = ["diabetes"];
const METRIC_VARIABLES: Record<string, string> = {
  diabetes: "diabetes_per_100k",
};

function VarGeoReport(props: {
  variable: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const variableId: VariableId = SUPPORTED_MADLIB_VARIABLES.includes(
    props.variable
  )
    ? (METRIC_VARIABLES[props.variable] as VariableId)
    : ("diabetes_per_100k" as VariableId);

  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[variableId];
  const datasetIds = VariableProvider.getUniqueDatasetIds([variableProvider]);

  return (
    <WithDatasets datasetIds={datasetIds}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState().andRace()
        );

        let tableDataset =
          props.fips.code === USA_FIPS
            ? variableProvider.getData(
                datasetStore.datasets,
                Breakdowns.national().andRace()
              )
            : dataset.filter((r) => r.state_fips === props.fips.code);

        return (
          <>
            {!SUPPORTED_MADLIB_VARIABLES.includes(props.variable) && (
              <Grid container xs={12} spacing={1} justify="center">
                <Grid item xs={5}>
                  <Alert severity="error">Data not currently available</Alert>
                </Grid>
              </Grid>
            )}
            {SUPPORTED_MADLIB_VARIABLES.includes(props.variable) && (
              <Grid container spacing={1} alignItems="flex-start">
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={props.vertical ? 12 : 6}
                  className={styles.PaddedGrid}
                >
                  <MapCard
                    data={dataset}
                    datasetIds={datasetIds}
                    varField={variableId}
                    varFieldDisplayName={VARIABLE_DISPLAY_NAMES[variableId]}
                    fips={props.fips}
                    updateFipsCallback={(fips: Fips) => {
                      props.updateFipsCallback(fips);
                    }}
                    showCounties={props.fips.isUsa() ? false : true}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={props.vertical ? 12 : 6}
                  className={styles.PaddedGrid}
                >
                  <TableCard
                    data={tableDataset}
                    datasetIds={datasetIds}
                    fields={["race", variableId]}
                  />
                </Grid>
              </Grid>
            )}
          </>
        );
      }}
    </WithDatasets>
  );
}

export default VarGeoReport;
