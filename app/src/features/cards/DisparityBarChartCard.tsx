import React, { useState } from "react";
import DisparityBarChart from "../charts/DisparityBarChart";
import styles from "./Card.module.scss";
import { Alert } from "@material-ui/lab";
import { Row } from "../../utils/DatasetTypes";
import { CardContent } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import { VariableId } from "../../utils/variableProviders";
import { Fips } from "../../utils/madlib/Fips";
import {
  BreakdownVar,
  BREAKDOWN_VAR_DISPLAY_NAMES,
  MetricToggle,
  METRIC_FULL_NAMES,
  METRIC_SHORT_NAMES,
} from "../../utils/madlib/DisplayNames";

import CardWrapper from "./CardWrapper";

export type ChartToggle = "percents" | "ratio";

function DisparityBarChartCard(props: {
  dataset?: Row[];
  datasetIds: string[];
  breakdownVar: BreakdownVar;
  metricId: MetricToggle;
  fips: Fips;
}) {
  const [chartToggle, setChartToggle] = useState<ChartToggle>("percents");

  // TODO - we want to bold the breakdown name in the card title
  return (
    <CardWrapper
      datasetIds={props.datasetIds}
      titleText={`Disparities in ${METRIC_FULL_NAMES[props.metricId]} by ${
        BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
      } in ${props.fips.getFullDisplayName()}`}
    >
      <CardContent className={styles.Breadcrumbs}>
        {!props.dataset && (
          <Alert severity="warning">
            Missing data means that we don't know the full story.
          </Alert>
        )}
        {props.dataset && (
          <ToggleButtonGroup
            value={chartToggle}
            exclusive
            onChange={(e, v) => setChartToggle(v)}
            aria-label="text alignment"
          >
            <ToggleButton value="percents">Percent Share</ToggleButton>
            <ToggleButton value="ratio">Per 100,000 People</ToggleButton>
          </ToggleButtonGroup>
        )}
      </CardContent>
      <CardContent className={styles.Breadcrumbs}>
        {props.dataset && (
          <>
            {chartToggle === "percents" && (
              <DisparityBarChart
                data={props.dataset}
                thickMeasure={"population_pct" as VariableId}
                thinMeasure={(props.metricId + "_pct_of_geo") as VariableId}
                breakdownVar={props.breakdownVar as BreakdownVar}
                metricDisplayName={METRIC_SHORT_NAMES[props.metricId]}
              />
            )}
            {chartToggle !== "percents" && (
              // TODO- calculate actual ratio
              <SimpleHorizontalBarChart
                data={props.dataset}
                breakdownVar={props.breakdownVar as BreakdownVar}
                measure={(props.metricId + "_per_100k") as VariableId}
                showLegend={false}
              />
            )}
          </>
        )}
      </CardContent>
    </CardWrapper>
  );
}
export default DisparityBarChartCard;
