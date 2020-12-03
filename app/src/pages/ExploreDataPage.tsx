import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CompareMapNavReport from "../features/reports/CompareMapNavReport";
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
import ReactTooltip from "react-tooltip";

function getPhraseValue(madLib: MadLib, segmentIndex: number): string {
  const segment = madLib.phrase[segmentIndex];
  return typeof segment === "string"
    ? segment
    : madLib.activeSelections[segmentIndex];
}

function ReportWrapper(props: { madLib: MadLib; setMadLib: Function }) {
  let variableId: VariableId;

  function updateGeo(fips: string, geoIndex: number) {
    let updatedArray: PhraseSelections = {
      ...props.madLib.activeSelections,
    };
    updatedArray[geoIndex] = fips;
    props.setMadLib({
      ...props.madLib,
      activeSelections: updatedArray,
    });
  }

  switch (props.madLib.id) {
    case "diabetes":
      // TODO we should add type safety to these instead of casting.
      variableId = getPhraseValue(props.madLib, 1) as VariableId;
      return <TellMeAboutReport variable={variableId} />;
    case "compare":
      variableId = getPhraseValue(props.madLib, 1) as VariableId;
      return (
        <CompareStatesForVariableReport
          stateFips1={getPhraseValue(props.madLib, 3)}
          stateFips2={getPhraseValue(props.madLib, 5)}
          variable={variableId}
        />
      );
    case "dump":
      return <ChartDumpReport />;
    case "covid":
      variableId = getPhraseValue(props.madLib, 1) as VariableId;
      return (
        <CovidReport
          variable={variableId}
          stateFips={getPhraseValue(props.madLib, 3)}
        />
      );
    case "mapnav":
      return (
        <CompareMapNavReport
          fipsGeo1={props.madLib.activeSelections[1]}
          fipsGeo2={props.madLib.activeSelections[3]}
          updateGeo1Callback={(fips: string) => updateGeo(fips, 1)}
          updateGeo2Callback={(fips: string) => updateGeo(fips, 3)}
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

  const foundIndex = MADLIB_LIST.findIndex(
    (madlib) => madlib.id === params[MADLIB_PHRASE_PARAM]
  );
  const initalIndex = foundIndex !== -1 ? foundIndex : 0;
  let defaultValuesWithOverrides = MADLIB_LIST[initalIndex].defaultSelections;
  if (params[MADLIB_SELECTIONS_PARAM]) {
    params[MADLIB_SELECTIONS_PARAM].split(",").forEach((override) => {
      const [phraseSegmentIndex, value] = override.split(":");
      let phraseSegments: PhraseSegment[] = MADLIB_LIST[initalIndex].phrase;
      if (
        Object.keys(phraseSegments).includes(phraseSegmentIndex) &&
        Object.keys(phraseSegments[Number(phraseSegmentIndex)]).includes(value)
      ) {
        defaultValuesWithOverrides[Number(phraseSegmentIndex)] = value;
      }
    });
  }

  const [madLib, setMadLib] = useState<MadLib>({
    ...MADLIB_LIST[initalIndex],
    activeSelections: defaultValuesWithOverrides,
  });

  return (
    <React.Fragment>
      <ReactTooltip />
      <Dialog
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Link to this Report</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {linkToMadLib(madLib.id, madLib.activeSelections, true)}
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
            data-tip="Share a Link to this Report"
          >
            <ShareIcon />
          </IconButton>
        </h1>
        <ReportWrapper madLib={madLib} setMadLib={setMadLib} />
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
                    let phraseIndex: number = Number(event.target.name);
                    let updatePhraseSelections: PhraseSelections = {
                      ...props.madLib.activeSelections,
                    };
                    updatePhraseSelections[phraseIndex] = event.target
                      .value as string;
                    props.setMadLib({
                      ...props.madLib,
                      activeSelections: updatePhraseSelections,
                    });
                  }}
                >
                  {Object.entries(phraseSegment)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([key, value]) => (
                      // TODO - we may want to not have this alphabetized by ID by default
                      <MenuItem key={value} value={key}>
                        {value}
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
