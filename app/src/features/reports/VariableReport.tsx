import React from "react";
import { Grid } from "@material-ui/core";
import TableChart from "../charts/TableChart";
import styles from "./Report.module.scss";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, {
  VariableId,
  VARIABLE_DISPLAY_NAMES,
} from "../../utils/variableProviders";
import { DropdownVarId } from "../../utils/MadLibs";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, Fips } from "../../utils/Fips";
import MapCard from "../cards/MapCard";
import Alert from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";

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
            : dataset.filter((r) => r.state_fips_code === props.fips.code);

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
                  <Card raised={true} style={{ margin: "10px" }}>
                    {!props.fips.isCounty() && (
                      <TableChart
                        data={tableDataset}
                        fields={[
                          { name: "race", displayName: "Race and Ethnicity" },
                          {
                            name: variableId,
                            displayName: VARIABLE_DISPLAY_NAMES[variableId],
                          },
                        ]}
                      />
                    )}
                    {props.fips.isCounty() && (
                      <Alert severity="error">
                        This dataset does not provide county level data
                      </Alert>
                    )}
                  </Card>
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
