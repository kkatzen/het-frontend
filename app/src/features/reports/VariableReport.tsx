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
import Card from "@material-ui/core/Card";

// TODO- investigate type check error to see if we can remove
const VARIABLE_DISPLAY_NAMES: Record<
  DropdownVarId,
  Record<VariableId, string>
> = {
  // @ts-ignore
  diabetes: {
    // @ts-ignore
    diabetes_count: "Diabetes Case Count",
  },
  // @ts-ignore
  copd: {
    // @ts-ignore
    copd_count: "COPD Case Count",
  },
};

function VarGeoReport(props: {
  variable: DropdownVarId;
  stateFips: string;
  updateStateCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const variableId: VariableId = Object.keys(VARIABLE_DISPLAY_NAMES).includes(
    props.variable
  )
    ? (Object.keys(VARIABLE_DISPLAY_NAMES[props.variable])[0] as VariableId)
    : ("diabetes_count" as VariableId);
  const variableDisplayName = Object.keys(VARIABLE_DISPLAY_NAMES).includes(
    props.variable
  )
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
                  <Card
                    raised={true}
                    style={{ margin: "10px", padding: "20px" }}
                  >
                    <MapNavChart
                      data={dataset}
                      varField={variableId}
                      varFieldDisplayName={variableDisplayName}
                      fipsGeo={props.stateFips}
                      countyFips={countyFips}
                      updateGeoCallback={(e: string) => {
                        if (e.length === 5) {
                          setCountyFips(e);
                        } else {
                          setCountyFips(undefined);
                          props.updateStateCallback(e);
                        }
                      }}
                    />
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={props.vertical ? 12 : 6}
                  className={styles.PaddedGrid}
                >
                  <Card raised={true} style={{ margin: "10px" }}>
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
