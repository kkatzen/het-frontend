import React from "react";
import Card from "@material-ui/core/Card";
import styles from "./Card.module.scss";
import {
  LinkWithStickyParams,
  DATASET_PRE_FILTERS,
  DATA_CATALOG_PAGE_LINK,
} from "../utils/urlutils";
import { CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { WithVariables } from "../data/WithLoadingOrErrorUI";
import VariableQuery from "../data/VariableQuery";
import CircularProgress from "@material-ui/core/CircularProgress";

// TODO - gracefully handle loading- progress bar should be inside card
function CardWrapper(props: {
  datasetIds: string[];
  titleText?: string;
  queries?: VariableQuery[];
  children: () => JSX.Element;
}) {
  function optionalTitle() {
    return props.titleText ? (
      <>
        <CardContent>
          <Typography className={styles.CardHeader}>
            {props.titleText}
          </Typography>
        </CardContent>
        <Divider />
      </>
    ) : null;
  }

  return (
    <WithVariables
      queries={props.queries ? props.queries : []}
      loadingComponent={
        <Card raised={true} className={styles.ChartCard}>
          {optionalTitle()}
          <CardContent>
            <CircularProgress />
          </CardContent>
        </Card>
      }
    >
      {() => {
        return (
          <Card raised={true} className={styles.ChartCard}>
            {optionalTitle()}
            {props.children()}
            <CardContent>
              <LinkWithStickyParams
                target="_blank"
                to={`${DATA_CATALOG_PAGE_LINK}?${DATASET_PRE_FILTERS}=${props.datasetIds.join(
                  ","
                )}`}
              >
                View Data Sources
              </LinkWithStickyParams>
            </CardContent>
          </Card>
        );
      }}
    </WithVariables>
  );
}

export default CardWrapper;
