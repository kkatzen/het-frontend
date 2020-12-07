import React from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { USA_FIPS, USA_DISPLAY_NAME, Fips } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { VariableId } from "../../utils/variableProviders";

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
  fips: Fips;
  varField: VariableId;
  varFieldDisplayName: string;
  data: Record<string, any>[];
  updateFipsCallback: (fips: Fips) => void;
}) {
  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      const fips = new Fips(clickedData.id);
      if (fips.isCounty()) {
        fips.setCountyName(clickedData.properties.name);
      }
      props.updateFipsCallback(fips);
    },
  };

  // TODO - make the mouse turn into a pointer when you hover over
  return (
    <div>
      {props.fips.isUsa() && (
        <Alert severity="error">
          This dataset does not provide county level data
        </Alert>
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <GeographyBreadcrumb
          text={USA_DISPLAY_NAME}
          isClickable={!props.fips.isUsa()}
          onClick={() => {
            props.updateFipsCallback(new Fips(USA_FIPS));
          }}
        />
        {!props.fips.isUsa() && (
          <GeographyBreadcrumb
            text={props.fips.getStateDisplayName()}
            isClickable={!props.fips.isState()}
            onClick={() => {
              props.updateFipsCallback(props.fips.getParentFips());
            }}
          />
        )}
        {props.fips.isCounty() && (
          <GeographyBreadcrumb
            text={props.fips.countyName}
            isClickable={false}
          />
        )}
      </Breadcrumbs>
      <UsaChloroplethMap
        signalListeners={signalListeners}
        varField={props.varField}
        legendTitle={props.varFieldDisplayName}
        data={props.data}
        hideLegend={props.fips.isUsa()} // TODO - update logic here when we have county level data
        fips={props.fips}
      />
    </div>
  );
}

export default MapNavChart;
