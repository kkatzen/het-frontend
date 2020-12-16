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
} from "../utils/madlib/DisplayNames";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import VariableQuery from "../data/VariableQuery";
import { MetricConfig, VariableConfig } from "../data/MetricConfig";

import CardWrapper from "./CardWrapper";

const VALID_METRIC_TYPES = ["pct_share", "per100k"];

function getInitalMetricConfig(variableConfig: VariableConfig) {
  return variableConfig.metrics["pct_share"]
    ? variableConfig.metrics["pct_share"]
    : variableConfig.metrics["per100k"];
}

function DisparityBarChartCard(props: {
  breakdownVar: BreakdownVar;
  variableConfig: VariableConfig;
  nonstandardizedRace: boolean /* TODO- ideally wouldn't go here, could be calculated based on dataset */;
  fips: Fips;
}) {
  const [metricConfig, setMetricConfig] = useState<MetricConfig>(
    getInitalMetricConfig(props.variableConfig)
  );
  // TODO - Fix antipattern per comments in PR 150
  useEffect(() => {
    setMetricConfig(getInitalMetricConfig(props.variableConfig));
  }, [props.variableConfig]);

  const datasetStore = useDatasetStore();

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const breakdowns = Breakdowns.forFips(props.fips).andRace(
    props.nonstandardizedRace
  );

  const metricIds = Object.values(props.variableConfig.metrics).map(
    (metricConfig: MetricConfig) => metricConfig.metricId
  );
  const variables: VariableId[] = [
    ...metricIds,
    "population",
    "population_pct",
  ];

  const query = new VariableQuery(variables, breakdowns);

  // TODO - what if there are no valid types at all? What do we show?
  const validDisplayMetricConfigs: MetricConfig[] = Object.values(
    props.variableConfig.metrics
  ).filter((metricConfig) => VALID_METRIC_TYPES.includes(metricConfig.type));

  // TODO - we want to bold the breakdown name in the card title
  return (
    <CardWrapper
      datasetIds={getDependentDatasets(variables)}
      queries={[query]}
      titleText={`${metricConfig.fullCardTitleName} by ${
        BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const dataset = datasetStore
          .getVariables(query)
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
              {props.breakdownVar === ("race_and_ethnicity" as BreakdownVar) &&
                validDisplayMetricConfigs.length > 1 && (
                  <ToggleButtonGroup
                    value={metricConfig.type}
                    exclusive
                    onChange={(e, metricType) => {
                      if (metricType !== null) {
                        setMetricConfig(
                          props.variableConfig.metrics[
                            metricType
                          ] as MetricConfig
                        );
                      }
                    }}
                  >
                    {validDisplayMetricConfigs.map((metricConfig) => (
                      <ToggleButton value={metricConfig.type}>
                        {metricConfig.type === "pct_share" &&
                          props.variableConfig.variableId + " and Population"}
                        {metricConfig.type === "per100k" &&
                          "per 100,000 people"}
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
