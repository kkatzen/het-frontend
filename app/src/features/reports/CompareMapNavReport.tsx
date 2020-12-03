import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import TableChart from "../charts/TableChart";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, USA_DISPLAY_NAME, STATE_FIPS_MAP } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function GeographyBreadcrumb(props: {
  text: string;
  isClickable: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      {props.isClickable && (
        <Link color="inherit" onClick={() => props.onClick!()}>
          {props.text}
        </Link>
      )}
      {!props.isClickable && (
        <Typography color="textPrimary">{props.text}</Typography>
      )}
    </>
  );
}

function Map(props: {
  fipsGeo: string;
  data: Record<string, any>[];
  updateGeoCallback: (message: string) => void;
}) {
  const [countyFips, setCountyFips] = useState<string>();
  const [countyName, setCountyName] = useState<string>();

  useEffect(() => {
    setCountyFips(undefined);
    setCountyName(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fipsGeo]);

  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      if (clickedData.id.length === 2) {
        // Updating the state
        props.updateGeoCallback(clickedData.id);
      } else {
        // Updating the county
        setCountyFips(clickedData.id);
        setCountyName(clickedData.properties.name);
      }
    },
  };

  let dataset =
    props.fipsGeo === USA_FIPS
      ? props.data
      : props.data.filter((r) => r.state_fips_code === props.fipsGeo);

  // TODO - make the mouse turn into a pointer when you hover over
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <GeographyBreadcrumb
          text={USA_DISPLAY_NAME}
          isClickable={props.fipsGeo !== USA_FIPS}
          onClick={() => {
            props.updateGeoCallback(USA_FIPS);
            setCountyFips(undefined);
            setCountyName(undefined);
          }}
        />
        {props.fipsGeo !== USA_FIPS && (
          <GeographyBreadcrumb
            text={STATE_FIPS_MAP[props.fipsGeo]}
            isClickable={!(!props.fipsGeo || !countyFips)}
            onClick={() => {
              setCountyFips(undefined);
            }}
          />
        )}
        {countyName && (
          <GeographyBreadcrumb text={countyName} isClickable={false} />
        )}
      </Breadcrumbs>

      <UsaChloroplethMap
        signalListeners={signalListeners}
        varField={"diabetes_count"}
        legendTitle="Diabetes Count"
        data={dataset}
        hideLegend={props.fipsGeo ? true : false}
        stateFips={props.fipsGeo === USA_FIPS ? undefined : props.fipsGeo}
        countyFips={countyFips ? countyFips : undefined}
      />
      {props.fipsGeo !== USA_FIPS && (
        <Alert severity="error">
          This dataset does not provide county level data
        </Alert>
      )}
      {countyFips === undefined && <TableChart data={dataset} />}
    </div>
  );
}

function CompareMapNavReport(props: {
  fipsGeo1: string;
  fipsGeo2: string;
  updateGeo1Callback: Function;
  updateGeo2Callback: Function;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders["diabetes_count"];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState()
        );

        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={6}>
              <Map
                data={dataset}
                fipsGeo={props.fipsGeo1}
                updateGeoCallback={(e: string) => props.updateGeo1Callback(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <Map
                data={dataset}
                fipsGeo={props.fipsGeo2}
                updateGeoCallback={(e: string) => props.updateGeo2Callback(e)}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default CompareMapNavReport;
