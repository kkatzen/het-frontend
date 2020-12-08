import React from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { Fips } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import { VariableId } from "../../utils/variableProviders";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import styles from "./Card.module.scss";
import {
  LinkWithStickyParams,
  DATASET_PRE_FILTERS,
  DATA_CATALOG_PAGE_LINK,
} from "../../utils/urlutils";
import MapBreadcrumbs from "./MapBreadcrumbs";

function MapNavCard(props: {
  fips: Fips;
  datasetIds: string[];
  varField: VariableId;
  varFieldDisplayName: string;
  data: Record<string, any>[];
  updateFipsCallback: (fips: Fips) => void;
}) {
  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      props.updateFipsCallback(new Fips(clickedData.id));
    },
  };
  return (
    <Card raised={true} className={styles.ChartCard}>
      <CardContent>
        <Typography variant="h6">
          {props.varFieldDisplayName} in {props.fips.getFullDisplayName()}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent className={styles.Breadcrumbs}>
        <MapBreadcrumbs
          fips={props.fips}
          updateFipsCallback={props.updateFipsCallback}
        />
      </CardContent>
      <Divider />
      <CardContent>
        {!props.fips.isUsa() /* TODO - don't hardcode */ && (
          <Alert severity="warning">
            This dataset does not provide county level data
          </Alert>
        )}
      </CardContent>
      <CardContent>
        <UsaChloroplethMap
          signalListeners={signalListeners}
          varField={props.varField}
          legendTitle={props.varFieldDisplayName}
          data={props.data}
          hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
          showCounties={props.fips.isUsa() ? false : true} // TODO - update logic here when we have county level data
          fips={props.fips}
        />
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
}

export default MapNavCard;
