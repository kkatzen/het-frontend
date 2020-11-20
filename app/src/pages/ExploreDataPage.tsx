import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import DemoReport from "../features/reports/DemoReport";
import TellMeAboutReport from "../features/reports/TellMeAboutReport";
import {
  MADLIB_LIST,
  MadLib,
  PhraseSegment,
  PhraseSelections,
} from "../utils/MadLibs";
import styles from "./ExploreDataPage.module.scss";
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
  const [madLibIndex, setMadLibIndex] = useState(0);
  const [phraseSelections, setPhraseSelections] = useState<PhraseSelections>(
    MADLIB_LIST[madLibIndex].defaultSelections
  );

  useEffect(() => {
    setPhraseSelections({ ...MADLIB_LIST[madLibIndex].defaultSelections });
  }, [madLibIndex]);

  return (
    <React.Fragment>
      <div className={styles.CarouselContainer}>
        <Carousel
          className={styles.Carousel}
          timeout={200}
          autoPlay={false}
          indicators={false}
          animation="slide"
          navButtonsAlwaysVisible={true}
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
  setPhraseSelections: (newArray: PhraseSelections) => void;
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
