import React, { useState } from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { Fips } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import { VariableId } from "../../utils/variableProviders";
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
    "Not Hispanic or Latino",
    "White alone",
    "White alone (Non-Hispanic)",
    "Black or African American alone (Non-Hispanic)",
    "Hispanic or Latino",
    "Asian alone",
    "Asian alone (Non-Hispanic)",
  ];
  const [race, setRace] = useState<string>(RACES[0]);

  return (
    <CardWrapper
      datasetIds={props.datasetIds}
      titleText={`${
        props.varFieldDisplayName
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => (
        <>
          <CardContent className={styles.Breadcrumbs}>
            <MapBreadcrumbs
              fips={props.fips}
              updateFipsCallback={props.updateFipsCallback}
            />
          </CardContent>

          {props.enableFilter && (
            <>
              <Divider />
              <CardContent
                className={styles.Breadcrumbs}
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
              data={
                props.enableFilter
                  ? props.data.filter(
                      (r) => r.hispanic_or_latino_and_race === race
                    )
                  : props.data
              }
              hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
              showCounties={props.showCounties}
              fips={props.fips}
            />
          </CardContent>
        </>
      )}
    </CardWrapper>
  );
}

export default MapCard;
