import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import DemoReport from "../features/madlib_reports/DemoReport";
import MenuItem from "@material-ui/core/MenuItem";
import MADLIB_LIST from "../utils/MadLibs";
import styles from "./ExploreDataPage.module.scss";
import { MadLib, PhraseSegment } from "../utils/DatasetTypes";

function ExploreDataPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseValues, setPhraseValues] = useState(
    MADLIB_LIST[0].phrase.map(() => 0)
  );

  function changeMadLib(index: number) {
    setPhraseValues(MADLIB_LIST[0].phrase.map(() => 0));
    setPhraseIndex(index);
  }

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
          onChange={(index: number) => {
            changeMadLib(index);
          }}
        >
          {MADLIB_LIST.map((madlib: MadLib, i) => (
            <Paper elevation={3} className={styles.CarouselItem} key={i}>
              <CarouselMadLib
                madlib={madlib}
                phraseValues={phraseValues}
                setPhraseValues={setPhraseValues}
                key={i}
              />
            </Paper>
          ))}
        </Carousel>
      </div>
      <div className={styles.ReportContainer}>
        {phraseIndex === 0 && <DemoReport phraseValues={phraseValues} />}
      </div>
    </React.Fragment>
  );
}

function CarouselMadLib(props: {
  madlib: MadLib;
  phraseValues: number[];
  setPhraseValues: (newArray: number[]) => void;
}) {
  return (
    <React.Fragment>
      {props.madlib.phrase.map(
        (phraseSegment: PhraseSegment, index: number) => (
          <React.Fragment>
            {phraseSegment.constructor !== Object ? (
              <React.Fragment>{phraseSegment}</React.Fragment>
            ) : (
              <FormControl>
                <Select
                  className={styles.MadLibSelect}
                  name={index.toString()}
                  value={props.phraseValues[index]}
                  onChange={(event) => {
                    let phraseIndex: number = Number(event.target.name);
                    let updatedArray: number[] = [...props.phraseValues];
                    updatedArray[phraseIndex] = Number(event.target.value);
                    props.setPhraseValues(updatedArray);
                  }}
                >
                  {Object.keys(phraseSegment).map(
                    (value: string, index: number) => (
                      <MenuItem key={index} value={index}>
                        {phraseSegment[index]}
                      </MenuItem>
                    )
                  )}
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
