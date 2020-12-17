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

  // Each report has a unique key based on its props so it will create a
  // new instance and reset its state when the provided props change.
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
      const compareDisparityVariable = getPhraseValue(props.madLib, 1);
      const fipsCode1 = getPhraseValue(props.madLib, 3);
      const fipsCode2 = getPhraseValue(props.madLib, 5);
      return (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={6}>
            <VariableDisparityReport
              key={compareDisparityVariable + fipsCode1}
              dropdownVarId={compareDisparityVariable as DropdownVarId}
              fips={new Fips(fipsCode1)}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
              vertical={true}
            />
          </Grid>
          <Grid item xs={6}>
            <VariableDisparityReport
              key={compareDisparityVariable + fipsCode2}
              dropdownVarId={compareDisparityVariable as DropdownVarId}
              fips={new Fips(fipsCode2)}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 5)}
              vertical={true}
            />
          </Grid>
        </Grid>
      );
    case "comparevars":
      const compareDisparityVariable1 = getPhraseValue(props.madLib, 1);
      const compareDisparityVariable2 = getPhraseValue(props.madLib, 3);
      const fipsCode = getPhraseValue(props.madLib, 5);
      return (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={6}>
            <VariableDisparityReport
              key={compareDisparityVariable1 + fipsCode}
              dropdownVarId={compareDisparityVariable1 as DropdownVarId}
              fips={new Fips(fipsCode)}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
              vertical={true}
            />
          </Grid>
          <Grid item xs={6}>
            <VariableDisparityReport
              key={compareDisparityVariable2 + fipsCode}
              dropdownVarId={compareDisparityVariable2 as DropdownVarId}
              fips={new Fips(fipsCode)}
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
