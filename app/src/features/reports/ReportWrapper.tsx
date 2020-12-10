import React from "react";
import { Grid } from "@material-ui/core";
import ChartDumpReport from "./ChartDumpReport";
import VariableDisparityReport from "./VariableDisparityReport";
import {
  MadLib,
  PhraseSelections,
  DropdownVarId,
  MadLibId,
} from "../../utils/madlib/MadLibs";
import { Fips } from "../../utils/madlib/Fips";
import VariableReport from "./VariableReport";

function getPhraseValue(madLib: MadLib, segmentIndex: number): string {
  const segment = madLib.phrase[segmentIndex];
  return typeof segment === "string"
    ? segment
    : madLib.activeSelections[segmentIndex];
}

function ReportWrapper(props: { madLib: MadLib; setMadLib: Function }) {
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
    case "disvargeo":
      return (
        <VariableDisparityReport
          dropdownVarId={getPhraseValue(props.madLib, 1) as DropdownVarId}
          fips={new Fips(getPhraseValue(props.madLib, 3))}
          updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
        />
      );
    case "disvarcompare":
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
    case "vargeo":
      return (
        <VariableReport
          variable={getPhraseValue(props.madLib, 1) as DropdownVarId}
          fips={new Fips(getPhraseValue(props.madLib, 3))}
          updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
        />
      );
    case "varcompare":
      const compareVariable = getPhraseValue(props.madLib, 1) as DropdownVarId;
      return (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={6}>
            <VariableReport
              variable={compareVariable}
              fips={new Fips(getPhraseValue(props.madLib, 3))}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 3)}
              vertical={true}
            />
          </Grid>
          <Grid item xs={6}>
            <VariableReport
              variable={compareVariable}
              fips={new Fips(getPhraseValue(props.madLib, 5))}
              updateFipsCallback={(fips: Fips) => updateFipsCallback(fips, 5)}
              vertical={true}
            />
          </Grid>
        </Grid>
      );
    case "geo":
      return <p>Unimplemented</p>;
    case "dump":
      return <ChartDumpReport />;
    default:
      return <p>Report not found</p>;
  }
}

export default ReportWrapper;
