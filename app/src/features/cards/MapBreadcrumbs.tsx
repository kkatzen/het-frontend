import React, { useState } from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { USA_FIPS, USA_DISPLAY_NAME, Fips } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { VariableId } from "../../utils/variableProviders";
import Button from "@material-ui/core/Button";
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

function MapBreadcrumbs(props: { fips: Fips; updateFipsCallback: Function }) {
  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Crumb
        text={USA_DISPLAY_NAME}
        isClickable={!props.fips.isUsa()}
        onClick={() => {
          props.updateFipsCallback(new Fips(USA_FIPS));
        }}
      />
      {!props.fips.isUsa() && (
        <Crumb
          text={props.fips.getStateDisplayName()}
          isClickable={!props.fips.isState()}
          onClick={() => {
            props.updateFipsCallback(props.fips.getParentFips());
          }}
        />
      )}
      {props.fips.isCounty() && (
        <Crumb text={props.fips.getDisplayName()} isClickable={false} />
      )}
    </Breadcrumbs>
  );
}

function Crumb(props: {
  text: string;
  isClickable: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      {props.isClickable && (
        <Button color="primary" style={{ padding: "3px" }}>
          <Link color="inherit" onClick={() => props.onClick!()}>
            {props.text}
          </Link>
        </Button>
      )}
      {!props.isClickable && (
        <Button style={{ padding: "3px" }} disabled>
          {props.text}
        </Button>
      )}
    </>
  );
}

export default MapBreadcrumbs;
