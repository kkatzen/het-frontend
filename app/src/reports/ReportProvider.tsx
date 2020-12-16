import React from "react";
import { Grid } from "@material-ui/core";
import ChartDumpReport from "./ChartDumpReport";
import VariableDisparityReport from "./VariableDisparityReport";
import {
  MadLib,
  PhraseSelections,
  DropdownVarId,
  MadLibId,
} from "../utils/madlib/MadLibs";
import { Fips } from "../utils/madlib/Fips";

function getPhraseValue(madLib: MadLib, segmentIndex: number): string {
  const segment = madLib.phrase[segmentIndex];
  return typeof segment === "string"
    ? segment
    : madLib.activeSelections[segmentIndex];
}

function ReportProvider(props: { madLib: MadLib; setMadLib: Function }) {
  function updateFipsCallback(fips: Fips, geoIndex: number) {
    let updatedArray: PhraseSelections = {
      ...props.madLib.activeSelections,
    };
    updatedArray[geoIndex] = fips.code;
    props.setMadLib({
      ...props.madLib,
      activeSelections: updatedArray,
    });
  }
  switch (props.madLib.id as MadLibId) {
    case "disparity":
      const dropdownOption = getPhraseValue(props.madLib, 1);
      return (
        <VariableDisparityReport
          key={dropdownOption}
          dropdownVarId={dropdownOption as DropdownVarId}
          fips={new Fips(getPhraseValue(props.madLib, 3))}
          updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
        />
      );
    case "comparegeos":
      const compareDisparityVariable = getPhraseValue(
        props.madLib,
        1
      ) as DropdownVarId;
      return (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={6}>
            <VariableDisparityReport
              dropdownVarId={compareDisparityVariable}
              fips={new Fips(getPhraseValue(props.madLib, 3))}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
              vertical={true}
            />
          </Grid>
          <Grid item xs={6}>
            <VariableDisparityReport
              dropdownVarId={compareDisparityVariable}
              fips={new Fips(getPhraseValue(props.madLib, 5))}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 5)}
              vertical={true}
            />
          </Grid>
        </Grid>
      );
    case "comparevars":
      const compareGeoVariable = getPhraseValue(
        props.madLib,
        5
      ) as DropdownVarId;
      return (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={6}>
            <VariableDisparityReport
              dropdownVarId={getPhraseValue(props.madLib, 1) as DropdownVarId}
              fips={new Fips(compareGeoVariable)}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
              vertical={true}
            />
          </Grid>
          <Grid item xs={6}>
            <VariableDisparityReport
              dropdownVarId={getPhraseValue(props.madLib, 3) as DropdownVarId}
              fips={new Fips(compareGeoVariable)}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 5)}
              vertical={true}
            />
          </Grid>
        </Grid>
      );
    case "dump":
      return <ChartDumpReport />;
    default:
      return <p>Report not found</p>;
  }
}

export default ReportProvider;
