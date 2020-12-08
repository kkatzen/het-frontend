import React, { useState } from "react";
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
import { Fips } from "../../utils/Fips";
import { VariableId } from "../../utils/variableProviders";

export type ChartToggle = "percents" | "ratio";

function DisparityBarChartCard(props: {
  dataset?: Row[];
  datasetIds: string[];
  metricId: string;
  variableTitle: string;
  breakdownVar: string;
  breakdownVarDisplayName: string;
  fips: Fips;
}) {
  const [chartToggle, setChartToggle] = useState<ChartToggle>("percents");

  return (
    <Card raised={true} className={styles.ChartCard}>
      <CardContent>
        <Typography gutterBottom className={styles.CardHeader}>
          Disparities in {props.variableTitle} by{" "}
          <b>{props.breakdownVarDisplayName}</b> in{" "}
          {props.fips.getFullDisplayName()}
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
            <ToggleButton value="percents">Percent Share</ToggleButton>
            <ToggleButton value="ratio">Per 100k Persons</ToggleButton>
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
                breakdownVar={props.breakdownVar}
                breakdownVarDisplayName={props.breakdownVarDisplayName}
              />
            )}
            {chartToggle !== "percents" && (
              // TODO- calculate actual ratio
              <SimpleHorizontalBarChart
                data={props.dataset}
                breakdownVar={props.breakdownVar}
                measure={props.metricId + "_per_100k"}
                measureDisplayName={props.variableTitle + " per 100,000 people"}
                breakdownVarDisplayName="Race/Ethnicity"
                showLegend={false}
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