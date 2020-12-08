import React, { useState } from "react";
import { VariableId } from "../../utils/variableProviders";
import DisparityBarChart from "../charts/DisparityBarChart";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import styles from "./Card.module.scss";
import { Alert } from "@material-ui/lab";
import { Row } from "../../utils/DatasetTypes";
import {
  LinkWithStickyParams,
  DATASET_PRE_FILTERS,
  DATA_CATALOG_PAGE_LINK,
} from "../../utils/urlutils";
import { CardContent } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import Divider from "@material-ui/core/Divider";
import { Fips } from "../../utils/Fips";

export type ChartToggle = "percent" | "ratio";

function DisparityBarChartCard(props: {
  dataset?: Row[];
  datasetIds: string[];
  variableId: VariableId;
  variableDisplayName: string;
  breakdownVar: string;
  breakdownVarDisplayName: string;
  fips: Fips;
}) {
  const [chartToggle, setChartToggle] = useState<ChartToggle>("percent");

  return (
    <Card raised={true} className={styles.ChartCard}>
      <CardContent>
        <Typography gutterBottom className={styles.CardHeader}>
          Disparities in {props.variableDisplayName} for{" "}
          <b>{props.breakdownVarDisplayName}</b> in{" "}
          {props.fips.getDisplayName()}
        </Typography>
      </CardContent>
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
            <ToggleButton value="percent">Percent</ToggleButton>
            <ToggleButton value="ratio">Ratio</ToggleButton>
          </ToggleButtonGroup>
        )}
      </CardContent>
      <CardContent className={styles.Breadcrumbs}>
        {props.dataset && (
          <>
            {chartToggle === "percent" && (
              <DisparityBarChart
                data={props.dataset}
                thickMeasure="population_pct"
                thinMeasure={props.variableId}
                thickMeasureDisplayName="Population %"
                thinMeasureDisplayName={
                  props.variableDisplayName + " as % of Geo"
                }
                breakdownVar={props.breakdownVar}
                breakdownVarDisplayName={props.breakdownVarDisplayName}
              />
            )}
            {chartToggle !== "percent" && (
              // TODO- calculate actual ratio
              <SimpleHorizontalBarChart
                data={props.dataset}
                breakdownVar={props.breakdownVar}
                measure={"covid_cases_per_100k"}
                measureDisplayName="COVID cases per 100k"
              />
            )}
            <LinkWithStickyParams
              target="_blank"
              to={`${DATA_CATALOG_PAGE_LINK}?${DATASET_PRE_FILTERS}=${props.datasetIds.join(
                ","
              )}`}
            >
              View Data Sources
            </LinkWithStickyParams>
          </>
        )}
      </CardContent>
    </Card>
  );
}
export default DisparityBarChartCard;
