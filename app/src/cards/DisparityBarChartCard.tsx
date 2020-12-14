import React, { useState, useEffect } from "react";
import DisparityBarChart from "../charts/DisparityBarChart";
import styles from "./Card.module.scss";
import { Alert } from "@material-ui/lab";
import { CardContent } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import { Fips } from "../utils/madlib/Fips";
import {
  BreakdownVar,
  BREAKDOWN_VAR_DISPLAY_NAMES,
  MetricToggle,
  shareOf,
  METRIC_FULL_NAMES,
  METRIC_SHORT_NAMES,
} from "../utils/madlib/DisplayNames";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import VariableQuery from "../data/VariableQuery";
import {
  METRIC_CONFIG,
  MetricConfig,
  VariableConfig,
} from "../data/MetricConfig";

import CardWrapper from "./CardWrapper";

export type ChartToggle = "percents" | "ratio";

function DisparityBarChartCard(props: {
  breakdownVar: BreakdownVar;
  variableConfig: VariableConfig;
  fips: Fips;
}) {
  const VALID_METRIC_TYPES = ["pct_share", "per100k"];

  // Initalized state
  const [metricConfig, setMetricConfig] = useState<MetricConfig>(
    props.variableConfig.metrics["pct_share"]
  );
  useEffect(() => {
    setMetricConfig(props.variableConfig.metrics["pct_share"]);
  }, [props.variableConfig]);

  console.log(metricConfig);

  const datasetStore = useDatasetStore();

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const geoFilteredBreakdowns = Breakdowns.forFips(props.fips).andRace(true);

  const metricIds = Object.values(props.variableConfig.metrics).map(
    (metricConfig: MetricConfig) => metricConfig.metricId
  );
  const variables: VariableId[] = [
    ...metricIds,
    "population",
    "population_pct",
  ];
  console.log(variables);
  const geoFilteredQuery = new VariableQuery(variables, geoFilteredBreakdowns);

  // TODO - we want to bold the breakdown name in the card title
  return (
    <CardWrapper
      datasetIds={getDependentDatasets(variables)}
      queries={[geoFilteredQuery]}
      titleText={`Disparities in ${metricConfig.fullCardTitleName} by ${
        BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const dataset = datasetStore
          .getVariables(geoFilteredQuery)
          .filter(
            (row) =>
              !["Not Hispanic or Latino", "Total"].includes(
                row.race_and_ethnicity
              )
          );
        return (
          <>
            <CardContent className={styles.Breadcrumbs}>
              {props.breakdownVar !==
                ("race_and_ethnicity" as BreakdownVar) && (
                <Alert severity="warning">
                  Missing data means that we don't know the full story.
                </Alert>
              )}
              {props.breakdownVar ===
                ("race_and_ethnicity" as BreakdownVar) && (
                <ToggleButtonGroup
                  value={metricConfig}
                  exclusive
                  onChange={(e, metricType) => {
                    console.log(metricType);
                    if (metricType !== null) {
                      setMetricConfig(
                        props.variableConfig.metrics[metricType] as MetricConfig
                      );
                    }
                  }}
                  aria-label="text alignment"
                >
                  {Object.values(props.variableConfig.metrics)
                    .filter((metricConfig) =>
                      VALID_METRIC_TYPES.includes(metricConfig.type)
                    )
                    .map((metricConfig) => (
                      <ToggleButton value={metricConfig.type}>
                        {metricConfig.type}
                      </ToggleButton>
                    ))}
                </ToggleButtonGroup>
              )}
            </CardContent>
            <CardContent className={styles.Breadcrumbs}>
              {props.breakdownVar ===
                ("race_and_ethnicity" as BreakdownVar) && (
                <>
                  {metricConfig.type === "pct_share" && (
                    <DisparityBarChart
                      data={dataset}
                      thickMeasure={"population_pct" as VariableId}
                      thinMeasure={metricConfig.metricId}
                      breakdownVar={props.breakdownVar as BreakdownVar}
                      metricDisplayName={metricConfig.shortVegaLabel}
                    />
                  )}
                  {metricConfig.type === "per100k" && (
                    <SimpleHorizontalBarChart
                      data={dataset}
                      breakdownVar={props.breakdownVar as BreakdownVar}
                      measure={metricConfig.metricId}
                      showLegend={false}
                    />
                  )}
                </>
              )}
            </CardContent>
          </>
        );
      }}
    </CardWrapper>
  );
}
export default DisparityBarChartCard;
