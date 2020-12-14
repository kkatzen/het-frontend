import React, { useState } from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { Fips, USA_FIPS } from "../utils/madlib/Fips";
import Alert from "@material-ui/lab/Alert";
import { VariableId } from "../data/variableProviders";
import Divider from "@material-ui/core/Divider";
import { CardContent } from "@material-ui/core";
import styles from "./Card.module.scss";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import MapBreadcrumbs from "./MapBreadcrumbs";
import CardWrapper from "./CardWrapper";

function MapCard(props: {
  fips: Fips;
  datasetIds: string[];
  varField: VariableId;
  varFieldDisplayName: string;
  data: Record<string, any>[];
  updateFipsCallback: (fips: Fips) => void;
  enableFilter?: boolean;
  showCounties: boolean;
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
    "American Indian and Alaska Native alone",
    "American Indian and Alaska Native alone (Non-Hispanic)",
    "Asian alone",
    "Asian alone (Non-Hispanic)",
    "Black or African American alone",
    "Black or African American alone (Non-Hispanic)",
    "Hispanic or Latino",
    "Native Hawaiian and Other Pacific Islander alone",
    "Native Hawaiian and Other Pacific Islander alone (Non-Hispanic)",
    "Some other race alone",
    "Some other race alone (Non-Hispanic)",
    "Two or more races",
    "Two or more races (Non-Hispanic)",
    "White alone",
    "White alone (Non-Hispanic)",
  ];
  const [race, setRace] = useState<string>(RACES[0]);

  let mapData = props.data.filter((r) => r[props.varField] !== undefined);
  if (props.fips.code !== USA_FIPS) {
    // TODO - this doesn't consider county level data
    mapData = mapData.filter((r) => r.state_fips === props.fips.code);
  }
  if (props.enableFilter) {
    mapData = mapData.filter((r) => r.race_and_ethnicity === race);
  }

  return (
    <CardWrapper
      datasetIds={props.datasetIds}
      titleText={`${
        props.varFieldDisplayName
      } in ${props.fips.getFullDisplayName()}`}
    >
      <CardContent className={styles.SmallMarginContent}>
        <MapBreadcrumbs
          fips={props.fips}
          updateFipsCallback={props.updateFipsCallback}
        />
      </CardContent>

      {props.enableFilter && (
        <>
          <Divider />
          <CardContent
            className={styles.SmallMarginContent}
            style={{ textAlign: "left" }}
          >
            <span style={{ lineHeight: "33px", fontSize: "13pt" }}>
              Filter by race:
            </span>

            <FormControl>
              <Select
                name="raceSelect"
                value={race}
                onChange={(e) => {
                  setRace(e.target.value as string);
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
          </CardContent>
        </>
      )}

      <Divider />
      <CardContent>
        {mapData.length !== 0 &&
          !props.fips.isUsa() /* TODO - don't hardcode */ && (
            <Alert severity="warning">
              This dataset does not provide county level data
            </Alert>
          )}
        {mapData.length === 0 && (
          <Alert severity="error">No data available</Alert>
        )}
      </CardContent>
      <CardContent>
        <UsaChloroplethMap
          signalListeners={signalListeners}
          varField={props.varField}
          legendTitle={props.varFieldDisplayName}
          data={mapData}
          hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
          showCounties={props.showCounties}
          fips={props.fips}
        />
      </CardContent>
    </CardWrapper>
  );
}

export default MapCard;
