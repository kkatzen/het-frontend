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

function MapNavChart(props: {
  fipsGeo: string;
  countyFips: string | undefined;
  data: Record<string, any>[];
  updateGeoCallback: (message: string) => void;
}) {
  const [countyName, setCountyName] = useState<string>();

  useEffect(() => {
    setCountyName(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fipsGeo]);

  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      props.updateGeoCallback(clickedData.id);
      if (clickedData.id.length === 5) {
        setCountyName(clickedData.properties.name);
      }
    },
  };

  // TODO - make the mouse turn into a pointer when you hover over
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <GeographyBreadcrumb
          text={USA_DISPLAY_NAME}
          isClickable={props.fipsGeo !== USA_FIPS}
          onClick={() => {
            props.updateGeoCallback(USA_FIPS);
            setCountyName(undefined);
          }}
        />
        {props.fipsGeo !== USA_FIPS && (
          <GeographyBreadcrumb
            text={STATE_FIPS_MAP[props.fipsGeo]}
            isClickable={!!countyName}
            onClick={() => {
              props.updateGeoCallback(props.fipsGeo.substring(0, 2));
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
        data={props.data}
        hideLegend={props.fipsGeo ? true : false}
        stateFips={props.fipsGeo === USA_FIPS ? undefined : props.fipsGeo}
        countyFips={props.countyFips}
      />
      {props.fipsGeo !== USA_FIPS && (
        <Alert severity="error">
          This dataset does not provide county level data
        </Alert>
      )}
    </div>
  );
}

export default MapNavChart;
