// @ts-nocheck
import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import DemoReport from "../features/madlib_reports/DemoReport";
import Demo2Report from "../features/madlib_reports/Demo2Report";
import MenuItem from "@material-ui/core/MenuItem";
import MADLIB_LIST from "../utils/MadLibs";
import styles from "./ExploreDataPage.module.scss";
import { MadLib, PhraseSegment } from "../utils/DatasetTypes";

function CarouselMadLib(props: {
  madlib: MadLib;
  phraseValue: number[];
  setBlankValues: ([]) => void;
}) {
  // const updateBlankValue = (event: React.ChangeEvent<{ value: unknown }>) => {
  const updateBlankValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let phraseIndex: number = Number(event.target.name);
    let updatedArray: number[] = [...props.phraseValue];
    updatedArray[phraseIndex] = Number(event.target.value);
    props.setBlankValues(updatedArray);
  };

  return props.madlib.phrase.map(
    (phraseSegment: PhraseSegment, index: number) => (
      <React.Fragment>
        {phraseSegment.constructor === Object ? (
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name={index.toString()}
              value={props.phraseValue[index]}
              onChange={updateBlankValue}
              style={{ margin: "5px" }}
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
        ) : (
          <React.Fragment>{phraseSegment}</React.Fragment>
        )}
      </React.Fragment>
    )
  );
}

function ExploreDataPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseValue, setBlankValues] = useState(
    MADLIB_LIST[0].phrase.map((i) => 0)
  );

  function changeMadLib(index: number) {
    // TODO make this the right size tho
    setBlankValues(MADLIB_LIST[0].phrase.map((i) => 0));
    setPhraseIndex(index);
  }

  return (
    <React.Fragment>
      <div style={{ background: "#e4e4e4", padding: "20px" }}>
        <div style={{ margin: "auto", width: "80%" }}>
          <Carousel
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
                  phraseValue={phraseValue}
                  setBlankValues={setBlankValues}
                  key={madlib.id + i}
                />
              </Paper>
            ))}
          </Carousel>
        </div>
      </div>
      <div className={styles.ReportContainer}>
        {phraseIndex === 0 && <DemoReport phraseValue={phraseValue} />}
        {phraseIndex === 1 && <Demo2Report phraseValue={phraseValue} />}
      </div>
    </React.Fragment>
  );
}

export default ExploreDataPage;
