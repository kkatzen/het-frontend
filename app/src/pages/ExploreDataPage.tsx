import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import ChartDumpReport from "../features/reports/ChartDumpReport";
import TellMeAboutReport from "../features/reports/TellMeAboutReport";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import {
  MADLIB_LIST,
  getMadLibPhraseText,
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
import CovidReport from "../features/reports/CovidReport";
import { VariableId } from "../utils/variableProviders";

function getPhraseValue(madLib: MadLib, segmentIndex: number): string {
  const segment = madLib.phrase[segmentIndex];
  return typeof segment === "string"
    ? segment
    : segment[madLib.activeSelections[segmentIndex]];
}

function ReportWrapper(props: { madLib: MadLib }) {
  let variableId: VariableId;
  switch (props.madLib.index) {
    case 0:
      // TODO we should add type safety to these instead of casting.
      variableId = getPhraseValue(props.madLib, 1) as VariableId;
      return <TellMeAboutReport variable={variableId} />;
    case 1:
      variableId = getPhraseValue(props.madLib, 1) as VariableId;
      return (
        <CompareStatesForVariableReport
          state1={getPhraseValue(props.madLib, 3)}
          state2={getPhraseValue(props.madLib, 5)}
          variable={variableId}
        />
      );
    case 2:
      return <ChartDumpReport />;
    case 3:
      variableId = getPhraseValue(props.madLib, 1) as VariableId;
      return (
        <CovidReport
          variable={variableId}
          geography={getPhraseValue(props.madLib, 3)}
        />
      );
    default:
      return <p>Report not found</p>;
  }
}

function ExploreDataPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const params = useSearchParams();
  useEffect(() => {
    // TODO - it would be nice to have the params stay and update when selections are made
    // Until then, it's best to just clear them so they can't become mismatched
    clearSearchParams([MADLIB_PHRASE_PARAM, MADLIB_SELECTIONS_PARAM]);
  }, []);

  const initalIndex = Number(params[MADLIB_PHRASE_PARAM]) | 0;
  let defaultValuesWithOverrides = MADLIB_LIST[initalIndex].defaultSelections;
  if (params[MADLIB_SELECTIONS_PARAM]) {
    params[MADLIB_SELECTIONS_PARAM].split(",").forEach((override) => {
      const [key, value] = override.split(":");
      let phrase = MADLIB_LIST[initalIndex].phrase;
      if (
        Object.keys(phrase).includes(key) &&
        Object.keys(phrase[Number(key)]).includes(value)
      ) {
        defaultValuesWithOverrides[Number(key)] = Number(value);
      }
    });
  }

  const [madLib, setMadLib] = useState<MadLib>({
    ...MADLIB_LIST[initalIndex],
    activeSelections: defaultValuesWithOverrides,
  });

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
            {linkToMadLib(madLib.index, madLib.activeSelections, true)}
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
          index={madLib.index}
          onChange={(index: number) => {
            setMadLib({
              ...MADLIB_LIST[index],
              activeSelections: MADLIB_LIST[index].defaultSelections,
            });
          }}
        >
          {MADLIB_LIST.map((madlib: MadLib, i) => (
            <Paper elevation={3} className={styles.CarouselItem} key={i}>
              <CarouselMadLib madLib={madLib} setMadLib={setMadLib} key={i} />
            </Paper>
          ))}
        </Carousel>
      </div>
      <div className={styles.ReportContainer}>
        <h1>
          {getMadLibPhraseText(madLib)}
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => setShareModalOpen(true)}
          >
            <ShareIcon />
          </IconButton>
        </h1>
        <ReportWrapper madLib={madLib} />
      </div>
    </React.Fragment>
  );
}

function CarouselMadLib(props: {
  madLib: MadLib;
  setMadLib: (updatedMadLib: MadLib) => void;
}) {
  return (
    <React.Fragment>
      {props.madLib.phrase.map(
        (phraseSegment: PhraseSegment, index: number) => (
          <React.Fragment key={index}>
            {typeof phraseSegment === "string" ? (
              <React.Fragment>{phraseSegment}</React.Fragment>
            ) : (
              <FormControl>
                <Select
                  className={styles.MadLibSelect}
                  name={index.toString()}
                  defaultValue={props.madLib.defaultSelections[index]}
                  value={props.madLib.activeSelections[index]}
                  onChange={(event) => {
                    let index: number = Number(event.target.name);
                    let updatedArray: PhraseSelections = {
                      ...props.madLib.activeSelections,
                    };
                    updatedArray[index] = Number(event.target.value);
                    props.setMadLib({
                      ...props.madLib,
                      activeSelections: updatedArray,
                    });
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
