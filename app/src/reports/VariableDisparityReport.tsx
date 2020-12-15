import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { VariableId } from "../data/variableProviders";
import {
  MetricToggle,
  VARIABLE_DISPLAY_NAMES,
  BreakdownVar,
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
                  <ToggleButton value={variableId as VariableId} key={key}>
                    {VARIABLE_DISPLAY_NAMES[variableId as VariableId]}
                  </ToggleButton>
                )
              )}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={props.vertical ? 12 : 6}>
            <MapCard
              variable={metric as string}
              fips={props.fips}
              updateFipsCallback={(fips: Fips) => {
                props.updateFipsCallback(fips);
              }}
              enableFilter={props.fips.isUsa()}
              nonstandardizedRace={true}
            />
            <TableCard
              fips={props.fips}
              variableIds={[
                per100k(metric) as VariableId,
                shareOf(metric) as VariableId,
                "population" as VariableId,
                "population_pct" as VariableId,
              ]}
              breakdownVar={"race_and_ethnicity" as BreakdownVar}
            />
          </Grid>
          <Grid item xs={props.vertical ? 12 : 6}>
            <DisparityBarChartCard
              metricId={metric}
              breakdownVar="race_and_ethnicity"
              fips={props.fips}
            />
            <DisparityBarChartCard
              metricId={metric}
              breakdownVar="age"
              fips={props.fips}
            />
            <DisparityBarChartCard
              metricId={metric}
              breakdownVar="sex"
              fips={props.fips}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default DisVarGeo;
