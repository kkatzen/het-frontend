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

function ExploreDataPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseSelectionIds, setPhraseSelectionIds] = useState<
    PhraseSelections
  >(MADLIB_LIST[phraseIndex].defaultSelections);

  useEffect(() => {
    setPhraseSelectionIds({ ...MADLIB_LIST[phraseIndex].defaultSelections });
  }, [phraseIndex]);

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
          onChange={setPhraseIndex}
        >
          {MADLIB_LIST.map((madlib: MadLib, i) => (
            <Paper elevation={3} className={styles.CarouselItem} key={i}>
              <CarouselMadLib
                madlib={madlib}
                phraseSelectionIds={phraseSelectionIds}
                setPhraseSelectionIds={setPhraseSelectionIds}
                key={i}
              />
            </Paper>
          ))}
        </Carousel>
      </div>
      <div className={styles.ReportContainer}>
        {phraseIndex === 0 && (
          <DemoReport
            madlib={MADLIB_LIST[0]}
            phraseSelectionIds={phraseSelectionIds}
          />
        )}
        {phraseIndex === 1 && (
          <TellMeAboutReport
            madlib={MADLIB_LIST[1]}
            phraseSelectionIds={phraseSelectionIds}
          />
        )}
      </div>
    </React.Fragment>
  );
}

function CarouselMadLib(props: {
  madlib: MadLib;
  phraseSelectionIds: PhraseSelections;
  setPhraseSelectionIds: (newArray: PhraseSelections) => void;
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
                  value={props.phraseSelectionIds[index]}
                  onChange={(event) => {
                    let phraseIndex: number = Number(event.target.name);
                    let updatedArray: PhraseSelections = {
                      ...props.phraseSelectionIds,
                    };
                    updatedArray[phraseIndex] = Number(event.target.value);
                    props.setPhraseSelectionIds(updatedArray);
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
