import React, { useState } from "react";
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

import CardWrapper from "./CardWrapper";

export type ChartToggle = "percents" | "ratio";

function DisparityBarChartCard(props: {
  breakdownVar: BreakdownVar;
  metricId: MetricToggle;
  fips: Fips;
}) {
  const [chartToggle, setChartToggle] = useState<ChartToggle>("percents");

  const datasetStore = useDatasetStore();

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const breakdowns = Breakdowns.forFips(props.fips).andRace(true);
  const variables: VariableId[] = [
    shareOf(props.metricId) as VariableId,
    "population",
    "population_pct",
  ];
  const query = new VariableQuery(variables, breakdowns);

  // TODO - we want to bold the breakdown name in the card title
  return (
    <CardWrapper
      datasetIds={getDependentDatasets(variables)}
      queries={[query]}
      titleText={`Disparities in ${METRIC_FULL_NAMES[props.metricId]} by ${
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
              {props.breakdownVar ===
                ("race_and_ethnicity" as BreakdownVar) && (
                <ToggleButtonGroup
                  value={chartToggle}
                  exclusive
                  onChange={(e, v) => setChartToggle(v)}
                  aria-label="text alignment"
                >
                  {/* TODO - change to "Cases/Deaths/Hospitalizations and Population" */}
                  <ToggleButton value="percents">Percent Share</ToggleButton>
                  <ToggleButton value="ratio">Per 100,000 People</ToggleButton>
                </ToggleButtonGroup>
              )}
            </CardContent>
            <CardContent className={styles.Breadcrumbs}>
              {props.breakdownVar ===
                ("race_and_ethnicity" as BreakdownVar) && (
                <>
                  {chartToggle === "percents" && (
                    <DisparityBarChart
                      data={dataset}
                      thickMeasure={"population_pct" as VariableId}
                      thinMeasure={
                        (props.metricId + "_pct_of_geo") as VariableId
                      }
                      breakdownVar={props.breakdownVar as BreakdownVar}
                      metricDisplayName={METRIC_SHORT_NAMES[props.metricId]}
                    />
                  )}
                  {chartToggle !== "percents" && (
                    <SimpleHorizontalBarChart
                      data={dataset}
                      breakdownVar={props.breakdownVar as BreakdownVar}
                      measure={(props.metricId + "_per_100k") as VariableId}
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
