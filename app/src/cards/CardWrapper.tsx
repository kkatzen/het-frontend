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
import { Breakdowns } from "../data/Breakdowns";

function CardWrapper(props: {
  datasetIds: string[];
  titleText?: string;
  queries?: VariableQuery[];
  children: () => JSX.Element;
}) {
  return (
    <WithVariables queries={props.queries ? props.queries : []}>
      {() => {
        return (
          <Card raised={true} className={styles.ChartCard}>
            {props.titleText && (
              <>
                <CardContent>
                  <Typography className={styles.CardHeader}>
                    {props.titleText}
                  </Typography>
                </CardContent>
                <Divider />
              </>
            )}
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
