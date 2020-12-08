import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import TableChart from "../charts/TableChart";
import styles from "./Report.module.scss";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { DropdownVarId } from "../../utils/MadLibs";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, Fips } from "../../utils/Fips";
import MapNavChart from "../charts/MapNavChart";
import Alert from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";

const VARIABLE_DISPLAY_NAMES: Record<string, Record<string, string>> = {
  diabetes: {
    diabetes_count: "Diabetes Case Count",
  },
  copd: {
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

  // TODO - would be nice to have this controlled entirely by the prop, this would mean the MadLib knows the county
  const [fips, setFips] = useState<Fips>(new Fips(props.stateFips));

  useEffect(() => {
    setFips(new Fips(props.stateFips));
  }, [props.stateFips]);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState().andRace()
        );

        let tableDataset =
          fips.code === USA_FIPS
            ? variableProvider.getData(
                datasetStore.datasets,
                Breakdowns.national().andRace()
              )
            : dataset.filter((r) => r.state_fips_code === fips.code);

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
                      fips={fips}
                      updateFipsCallback={(fips: Fips) => {
                        setFips(fips);
                        props.updateStateCallback(fips.getStateFipsCode());
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
                    {!fips.isCounty() && (
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

                    {fips.isCounty() && (
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
