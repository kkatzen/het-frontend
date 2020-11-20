import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import DemoReport from "../features/reports/DemoReport";
import TellMeAboutReport from "../features/reports/TellMeAboutReport";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { getMadLibPhraseText } from "../utils/MadLibs";

import {
  MADLIB_LIST,
  MadLib,
  PhraseSegment,
  PhraseSelections,
} from "../utils/MadLibs";
import styles from "./ExploreDataPage.module.scss";
import {
  clearSearchParams,
  MADLIB_PHRASE_PARAM,
  MADLIB_SELECTIONS_PARAM,
  useSearchParams,
  linkToMadLib,
} from "../utils/urlutils";
import CompareStatesForVariableReport from "../features/reports/CompareStatesForVariableReport";

function getPhraseValue(
  madlib: MadLib,
  segmentIndex: number,
  phraseSelections: PhraseSelections
): string {
  const segment = madlib.phrase[segmentIndex];
  return typeof segment === "string"
    ? segment
    : segment[phraseSelections[segmentIndex]];
}

function ReportWrapper(props: {
  madLibIndex: number;
  phraseSelections: PhraseSelections;
}) {
  const madlib = MADLIB_LIST[props.madLibIndex];
  switch (props.madLibIndex) {
    case 0:
      return (
        <DemoReport madlib={madlib} phraseSelections={props.phraseSelections} />
      );
    case 1:
      return (
        <TellMeAboutReport
          madlib={madlib}
          phraseSelections={props.phraseSelections}
        />
      );
    case 2:
      return (
        <CompareStatesForVariableReport
          state1={getPhraseValue(madlib, 3, props.phraseSelections)}
          state2={getPhraseValue(madlib, 5, props.phraseSelections)}
          variable={getPhraseValue(madlib, 1, props.phraseSelections)}
        />
      );
    default:
      return <p>Report not found</p>;
  }
}  
        
        
function ExploreDataPage() {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const params = useSearchParams();
  useEffect(() => {
    // TODO - it would be nice to have the params stay and update when selections are made
    // Until then, it's best to just clear them so they can't become mismatched
    clearSearchParams([MADLIB_PHRASE_PARAM, MADLIB_SELECTIONS_PARAM]);
  }, []);
  const [madLibIndex, setMadLibIndex] = useState(0);
    Number(params[MADLIB_PHRASE_PARAM]) | 0
  );

  let defaultValuesWithOverrides = MADLIB_LIST[madLibIndex].defaultSelections;
  if (params[MADLIB_SELECTIONS_PARAM]) {
    params[MADLIB_SELECTIONS_PARAM].split(",").forEach((override) => {
      const [key, value] = override.split(":");
      // Validate that key is in valid range
      if (!Object.keys(MADLIB_LIST[madLibIndex].phrase).includes(key)) return;
      // Validate that value is in valid range
      if (
        !Object.keys(MADLIB_LIST[madLibIndex].phrase[Number(key)]).includes(
          value
        )
      )
        return;
      defaultValuesWithOverrides[Number(key)] = Number(value);
    });
  }
  const [phraseSelections, setPhraseSelections] = useState<PhraseSelections>(
    defaultValuesWithOverrides
  );

  useEffect(() => {
    setPhraseSelections({ ...MADLIB_LIST[madLibIndex].defaultSelections });
  }, [madLibIndex]);

  return (
    <React.Fragment>
      <Dialog
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Link to this Report</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {linkToMadLib(madLibIndex, phraseSelections, true)}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <div className={styles.CarouselContainer}>
        <Carousel
          className={styles.Carousel}
          timeout={200}
          autoPlay={false}
          indicators={false}
          animation="slide"
          navButtonsAlwaysVisible={true}
          index={madLibIndex}
          onChange={setMadLibIndex}
        >
          {MADLIB_LIST.map((madlib: MadLib, i) => (
            <Paper elevation={3} className={styles.CarouselItem} key={i}>
              <CarouselMadLib
                madlib={madlib}
                phraseSelections={phraseSelections}
                setPhraseSelections={setPhraseSelections}
                key={i}
              />
            </Paper>
          ))}
        </Carousel>
      </div>
      <div className={styles.ReportContainer}>
        <h1>
          {getMadLibPhraseText(MADLIB_LIST[madLibIndex], phraseSelections)}
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => setShareModalOpen(true)}
          >
            <ShareIcon />
          </IconButton>
        </h1>
        <ReportWrapper
          madLibIndex={madLibIndex}
          phraseSelections={phraseSelections}
        />
      </div>
    </React.Fragment>
  );
}

function CarouselMadLib(props: {
  madlib: MadLib;
  phraseSelections: PhraseSelections;
  Selections: (newArray: PhraseSelections) => void;
}) {
  return (
    <React.Fragment>
      {props.madlib.phrase.map(
        (phraseSegment: PhraseSegment, index: number) => (
          <React.Fragment key={index}>
            {typeof phraseSegment === "string" ? (
              <React.Fragment>{phraseSegment}</React.Fragment>
            ) : (
              <FormControl>
                <Select
                  className={styles.MadLibSelect}
                  name={index.toString()}
                  defaultValue={props.madlib.defaultSelections[index]}
                  value={props.phraseSelections[index]}
                  onChange={(event) => {
                    let madLibIndex: number = Number(event.target.name);
                    let updatedArray: PhraseSelections = {
                      ...props.phraseSelections,
                    };
                    updatedArray[madLibIndex] = Number(event.target.value);
                    props.setPhraseSelections(updatedArray);
                  }}
                >
                  {Object.keys(phraseSegment).map((key: string) => (
                    <MenuItem key={key} value={Number(key)}>
                      {phraseSegment[Number(key)]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
}

export default ExploreDataPage;
