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
import {
  METRIC_CONFIG,
  VariableConfig,
  MetricConfig,
} from "../data/MetricConfig";

function VariableDisparityReport(props: {
  dropdownVarId: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const [variableConfig, setVariableConfig] = useState<VariableConfig | null>(
    Object.keys(METRIC_CONFIG).includes(props.dropdownVarId)
      ? METRIC_CONFIG[props.dropdownVarId as string][0]
      : null
  );

  return (
    <>
      {!variableConfig && (
        <Grid container xs={12} spacing={1} justify="center">
          <Grid item xs={5}>
            <Alert severity="error">Data not currently available</Alert>
          </Grid>
        </Grid>
      )}

      {variableConfig && (
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <ToggleButtonGroup
              exclusive
              value={variableConfig.variableId}
              onChange={(e, variableId) => {
                console.log(variableId);
                if (variableId !== null) {
                  console.log(
                    METRIC_CONFIG[props.dropdownVarId].find(
                      (variableConfig) =>
                        variableConfig.variableId === variableId
                    )
                  );
                  setVariableConfig(
                    METRIC_CONFIG[props.dropdownVarId].find(
                      (variableConfig) =>
                        variableConfig.variableId === variableId
                    ) as VariableConfig
                  );
                }
              }}
              aria-label="text formatting"
            >
              {METRIC_CONFIG[props.dropdownVarId as string].map(
                (variable: VariableConfig, key: number) => (
                  <ToggleButton value={variable.variableId} key={key}>
                    {variable.variableId}
                  </ToggleButton>
                )
              )}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={props.vertical ? 12 : 6}>
            <MapCard
              metricConfig={variableConfig.metrics["per100k"] as MetricConfig}
              fips={props.fips}
              updateFipsCallback={(fips: Fips) => {
                props.updateFipsCallback(fips);
              }}
              enableFilter={props.fips.isUsa()}
              showCounties={false}
              nonstandardizedRace={true}
            />
            <TableCard
              fips={props.fips}
              variableIds={[
                variableConfig.metrics["per100k"].metricId as VariableId,
                variableConfig.metrics["pct_share"].metricId as VariableId,
                "population" as VariableId,
                "population_pct" as VariableId,
              ]}
              breakdownVar={"race_and_ethnicity" as BreakdownVar}
            />
          </Grid>
          <Grid item xs={props.vertical ? 12 : 6}>
            <DisparityBarChartCard
              variableConfig={variableConfig}
              breakdownVar="race_and_ethnicity"
              fips={props.fips}
            />
            <DisparityBarChartCard
              variableConfig={variableConfig}
              breakdownVar="age"
              fips={props.fips}
            />
            <DisparityBarChartCard
              variableConfig={variableConfig}
              breakdownVar="sex"
              fips={props.fips}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default VariableDisparityReport;
