import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import { Breakdowns } from "../../utils/Breakdowns";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import {
  MetricToggle,
  VARIABLE_DISPLAY_NAMES,
  shareOf,
  per100k,
  METRICS_FOR_VARIABLE,
} from "../../utils/madlib/DisplayNames";
import VariableProvider from "../../utils/variables/VariableProvider";
import DisparityBarChartCard from "../cards/DisparityBarChartCard";
import MapCard from "../cards/MapCard";
import TableCard from "../cards/TableCard";
import { DropdownVarId } from "../../utils/madlib/MadLibs";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Alert from "@material-ui/lab/Alert";
import { Fips } from "../../utils/madlib/Fips";

// TODO - remove hardcoded values when we have full support
const SUPPORTED_MADLIB_VARIABLES: DropdownVarId[] = ["covid"];

function asDate(dateStr: string) {
  const parts = dateStr.split("-").map(Number);
  // Date expects month to be 0-indexed so need to subtract 1.
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function DisVarGeo(props: {
  dropdownVarId: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const [metric, setMetric] = useState<MetricToggle>(
    SUPPORTED_MADLIB_VARIABLES.includes(props.dropdownVarId)
      ? (METRICS_FOR_VARIABLE[props.dropdownVarId as string][0] as MetricToggle)
      : ("covid_cases" as MetricToggle)
  );

  const datasetStore = useDatasetStore();
  const percentProvider = variableProviders[shareOf(metric)];
  const popProvider = variableProviders["population_pct"];
  const datasetIds = VariableProvider.getUniqueDatasetIds([
    percentProvider,
    popProvider,
  ]);

  return (
    <>
      {!SUPPORTED_MADLIB_VARIABLES.includes(props.dropdownVarId) && (
        <Grid container xs={12} spacing={1} justify="center">
          <Grid item xs={5}>
            <Alert severity="error">Data not currently available</Alert>
          </Grid>
        </Grid>
      )}

      {SUPPORTED_MADLIB_VARIABLES.includes(props.dropdownVarId) && (
        <Grid container spacing={1} justify="center">
          <WithDatasets datasetIds={datasetIds}>
            {() => {
              const data = percentProvider
                .getData(
                  datasetStore.datasets,
                  Breakdowns.byState().andTime().andRace(true)
                )
                .concat(
                  percentProvider.getData(
                    datasetStore.datasets,
                    Breakdowns.national().andTime().andRace(true)
                  )
                )
                .filter(
                  (row) => row.race_and_ethnicity !== "Not Hispanic or Latino"
                );

              const dateTimes = data.map((row) => asDate(row.date).getTime());
              const lastDate = new Date(Math.max(...dateTimes));
              const dataset = data.filter(
                (row) => asDate(row.date).getTime() === lastDate.getTime()
              );

              const geoFilteredDataset = dataset
                .filter((r) => r.race_and_ethnicity !== "Total")
                .filter((row) => row.state_fips === props.fips.code);

              return (
                <>
                  <Grid item xs={12}>
                    <ToggleButtonGroup
                      exclusive
                      value={metric}
                      onChange={(e, v) => {
                        if (v !== null) {
                          setMetric(v);
                        }
                      }}
                      aria-label="text formatting"
                    >
                      {METRICS_FOR_VARIABLE[props.dropdownVarId].map(
                        (variableId: string, key: number) => (
                          <ToggleButton
                            value={variableId as VariableId}
                            key={key}
                          >
                            {VARIABLE_DISPLAY_NAMES[variableId as VariableId]}
                          </ToggleButton>
                        )
                      )}
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid item xs={props.vertical ? 12 : 6}>
                    <MapCard
                      data={dataset}
                      datasetIds={datasetIds}
                      varField={per100k(metric)}
                      varFieldDisplayName={
                        VARIABLE_DISPLAY_NAMES[per100k(metric)]
                      }
                      fips={props.fips}
                      updateFipsCallback={(fips: Fips) => {
                        props.updateFipsCallback(fips);
                      }}
                      enableFilter={true}
                      showCounties={false}
                    />
                    <TableCard
                      data={geoFilteredDataset}
                      datasetIds={datasetIds}
                      fields={[
                        "race_and_ethnicity",
                        "population",
                        "population_pct",
                        shareOf(metric),
                        per100k(metric),
                      ]}
                    />
                  </Grid>
                  <Grid item xs={props.vertical ? 12 : 6}>
                    <DisparityBarChartCard
                      dataset={geoFilteredDataset}
                      datasetIds={datasetIds}
                      metricId={metric}
                      breakdownVar="race_and_ethnicity"
                      fips={props.fips}
                    />
                    <DisparityBarChartCard
                      datasetIds={datasetIds}
                      metricId={metric}
                      breakdownVar="age"
                      fips={props.fips}
                    />
                    <DisparityBarChartCard
                      datasetIds={datasetIds}
                      metricId={metric}
                      breakdownVar="gender"
                      fips={props.fips}
                    />
                  </Grid>
                </>
              );
            }}
          </WithDatasets>
        </Grid>
      )}
    </>
  );
}

export default DisVarGeo;
