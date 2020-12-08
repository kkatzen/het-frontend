import React, { useState } from "react";
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
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import MapBreadcrumbs from "./MapBreadcrumbs";

function NationalMapCard(props: {
  fips: Fips;
  datasetIds: string[];
  varField: VariableId;
  varFieldDisplayName: string;
  data: Record<string, any>[];
  updateFipsCallback: (fips: Fips) => void;
  countyLevel?: boolean;
}) {
  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      props.updateFipsCallback(new Fips(clickedData.id));
    },
  };

  // TODO - make sure the legends are all the same
  // TODO - pull these from the data itself
  const RACES = [
    "Total",
    "Not Hispanic or Latino",
    "White alone",
    "White alone (Non-Hispanic)",
    "Black or African American alone (Non-Hispanic)",
    "Hispanic or Latino",
    "Asian alone",
    "Asian alone (Non-Hispanic)",
  ];
  const [race, setRace] = useState<string>(RACES[0]);

  console.log(props.data);
  console.log(props.data.filter((r) => r.race === race));

  return (
    <Card raised={true} className={styles.ChartCard}>
      <CardContent>
        <Typography variant="h6">
          {props.varFieldDisplayName} in {props.fips.getFullDisplayName()}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent className={styles.Breadcrumbs}>
        <div style={{ float: "right" }}>
          <span style={{ lineHeight: "33px", fontSize: "13pt" }}>
            Filter by race:
          </span>

          <FormControl>
            <Select
              name="raceSelect"
              value={race}
              onChange={(e) => {
                setRace(e.target.value as string);
                //  setCountyList([]);
              }}
              disabled={props.fips.isUsa() ? false : true}
            >
              {RACES.map((race) => (
                <MenuItem key={race} value={race}>
                  {race}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
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
          data={props.data.filter(
            (r) => r.hispanic_or_latino_and_race === race
          )}
          hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
          showCounties={props.countyLevel ? props.countyLevel : false}
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

export default NationalMapCard;
