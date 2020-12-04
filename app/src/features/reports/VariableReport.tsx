// @ts-nocheck

import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import TableChart from "../charts/TableChart";
import styles from "./Report.module.scss";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { DropdownVarId } from "../../utils/MadLibs";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS } from "../../utils/Fips";
import MapNavChart from "../charts/MapNavChart";
import Alert from "@material-ui/lab/Alert";

// TODO- investigate type check error to see if we can remove
// @ts-ignore
const VARIABLE_DISPLAY_NAMES: Record<
  DropdownVarId,
  Record<VariableId, string>
> = {
  diabetes: {
    diabetes_count: "Diabetes Case Count",
  },
};

function VarGeoReport(props: {
  variable: DropdownVarId;
  stateFips: string;
  updateStateCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const variableId =
    props.variable === "diabetes"
      ? Object.keys(VARIABLE_DISPLAY_NAMES[props.variable])[0]
      : "diabetes_count";
  const variableDisplayName =
    props.variable === "diabetes"
      ? Object.entries(VARIABLE_DISPLAY_NAMES[props.variable])[0][1]
      : "Placeholder";

  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[variableId];
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
          <>
            {!Object.keys(VARIABLE_DISPLAY_NAMES).includes(props.variable) && (
              <Grid container xs={12} spacing={1} justify="center">
                <Grid item xs={5}>
                  <Alert severity="error">Data not currently available</Alert>
                </Grid>
              </Grid>
            )}
            {Object.keys(VARIABLE_DISPLAY_NAMES).includes(props.variable) && (
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
                    varField={variableId}
                    varFieldDisplayName={variableDisplayName}
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
                          name: variableId,
                          displayName: variableDisplayName,
                        },
                      ]}
                    />
                  )}
                  {countyFips && (
                    <Alert severity="error">
                      This dataset does not provide county level data
                    </Alert>
                  )}
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
