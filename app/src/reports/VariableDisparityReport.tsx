import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { WithVariables } from "../data/WithLoadingOrErrorUI";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import {
  MetricToggle,
  VARIABLE_DISPLAY_NAMES,
  shareOf,
  per100k,
  METRICS_FOR_VARIABLE,
} from "../utils/madlib/DisplayNames";
import DisparityBarChartCard from "../cards/DisparityBarChartCard";
import MapCard from "../cards/MapCard";
import TableCard from "../cards/TableCard";
import { DropdownVarId } from "../utils/madlib/MadLibs";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Alert from "@material-ui/lab/Alert";
import { Fips } from "../utils/madlib/Fips";
import VariableQuery from "../data/VariableQuery";

// TODO - remove hardcoded values when we have full support
const SUPPORTED_MADLIB_VARIABLES: DropdownVarId[] = ["covid"];

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

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const shareOfVariable = shareOf(metric) as VariableId;
  const geoFilteredBreakdowns = Breakdowns.forFips(props.fips).andRace(true);
  const allGeosBreakdowns = Breakdowns.byState().andRace(true);
  const variables: VariableId[] = [
    shareOfVariable,
    "population",
    "population_pct",
  ];
  const geoFilteredQuery = new VariableQuery(variables, geoFilteredBreakdowns);
  const allGeosQuery = new VariableQuery(shareOfVariable, allGeosBreakdowns);

  const queries = [geoFilteredQuery, allGeosQuery];
  const datasetIds = getDependentDatasets(variables);

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
          <WithVariables queries={queries}>
            {() => {
              const geoFilteredDataset = datasetStore
                .getVariables(geoFilteredQuery)
                .filter(
                  (row) =>
                    !["Not Hispanic or Latino", "Total"].includes(
                      row.race_and_ethnicity
                    )
                );

              const dataset = datasetStore
                .getVariables(allGeosQuery)
                .filter(
                  (row) => row.race_and_ethnicity !== "Not Hispanic or Latino"
                );

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
                      enableFilter={props.fips.isUsa()}
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
                      breakdownVar="sex"
                      fips={props.fips}
                    />
                  </Grid>
                </>
              );
            }}
          </WithVariables>
        </Grid>
      )}
    </>
  );
}

export default DisVarGeo;
