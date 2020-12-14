import React, { useState, useEffect } from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { Fips, USA_FIPS } from "../utils/madlib/Fips";
import Alert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import { CardContent } from "@material-ui/core";
import styles from "./Card.module.scss";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import MapBreadcrumbs from "./MapBreadcrumbs";
import CardWrapper from "./CardWrapper";
import { per100k } from "../utils/madlib/DisplayNames";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import VariableQuery from "../data/VariableQuery";
import { VARIABLE_DISPLAY_NAMES } from "../utils/madlib/DisplayNames";
import {
  METRIC_CONFIG,
  MetricConfig,
  VariableConfig,
} from "../data/MetricConfig";

function MapCard(props: {
  fips: Fips;
  metricConfig: MetricConfig | undefined;
  nonstandardizedRace: boolean /* TODO- ideally wouldn't go here, could be calculated based on dataset */;
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
  const RACES = props.nonstandardizedRace
    ? [
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
      ]
    : [
        "American Indian/Alaskan Native, Non-Hispanic",
        "Asian, Non-Hispanic",
        "Black, Non-Hispanic",
        "Hispanic",
        "Other race, Non-Hispanic",
        "White, Non-Hispanic",
      ];

  const [race, setRace] = useState<string>(RACES[0]);
  useEffect(() => {
    setRace(RACES[0]);
  }, [RACES, props.metricConfig]);

  const datasetStore = useDatasetStore();

  const allGeosBreakdowns = Breakdowns.byState().andRace(
    props.nonstandardizedRace
  );
  const allGeosQuery = new VariableQuery(
    props.metricConfig!.metricId,
    allGeosBreakdowns
  );

  const datasets = props.metricConfig
    ? getDependentDatasets([props.metricConfig.metricId])
    : [];

  return (
    <CardWrapper
      queries={[allGeosQuery]}
      datasetIds={datasets}
      titleText={`${
        props.metricConfig!.fullCardTitleName
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const dataset = datasetStore
          .getVariables(allGeosQuery)
          .filter((row) => row.race_and_ethnicity !== "Not Hispanic or Latino");

        let mapData = dataset.filter(
          (r) => r[props.metricConfig!.metricId] !== undefined
        );
        console.log("mapData", mapData);
        if (props.fips.code !== USA_FIPS) {
          // TODO - this doesn't consider county level data
          mapData = mapData.filter((r) => r.state_fips === props.fips.code);
        }
        console.log("mapData", mapData);
        if (props.enableFilter) {
          mapData = mapData.filter((r) => r.race_and_ethnicity === race);
        }
        console.log("mapData", mapData);

        return (
          <>
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
              {props.metricConfig && (
                <UsaChloroplethMap
                  signalListeners={signalListeners}
                  varField={props.metricConfig!.metricId}
                  legendTitle={props.metricConfig!.fullCardTitleName}
                  data={mapData}
                  hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
                  showCounties={props.showCounties}
                  fips={props.fips}
                />
              )}
            </CardContent>
          </>
        );
      }}
    </CardWrapper>
  );
}

export default MapCard;
