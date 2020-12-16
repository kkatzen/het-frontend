import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
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
} from "../utils/madlib/MadLibs";
import { Fips } from "../utils/madlib/Fips";
import styles from "./ExploreDataPage.module.scss";
import {
  clearSearchParams,
  MADLIB_PHRASE_PARAM,
  MADLIB_SELECTIONS_PARAM,
  useSearchParams,
  linkToMadLib,
} from "../utils/urlutils";
import ReactTooltip from "react-tooltip";
import ReportProvider from "../reports/ReportProvider";
import FipsSelector from "./ui/FipsSelector";

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

  const [sticking, setSticking] = useState<boolean>(false);

  useEffect(() => {
    const header = document.getElementById("ExploreData");
    const stickyBarOffsetFromTop: number = header ? header.offsetTop : 1;
    const scrollCallBack: any = window.addEventListener("scroll", () => {
      if (window.pageYOffset > stickyBarOffsetFromTop) {
        if (header) {
          header.classList.add(styles.Sticky);
        }
        setSticking(true);
      } else {
        if (header) {
          header.classList.remove(styles.Sticky);
        }
        setSticking(false);
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  return (
    <div id="ExploreData" className={styles.ExploreData}>
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
            {getMadLibPhraseText(madLib)}
          </DialogContentText>
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
          indicators={!sticking}
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
            <CarouselMadLib
              madLib={madLib}
              setMadLib={setMadLib}
              key={i}
              setShareModalOpen={(open: boolean) => setShareModalOpen(open)}
            />
          ))}
        </Carousel>
      </div>
      <div className={styles.ReportContainer}>
        <ReportProvider madLib={madLib} setMadLib={setMadLib} />
      </div>
    </div>
  );
}

function CarouselMadLib(props: {
  madLib: MadLib;
  setMadLib: (updatedMadLib: MadLib) => void;
  setShareModalOpen: (open: boolean) => void;
}) {
  function updateMadLib(phraseSegementIndex: number, newValue: string) {
    let updatePhraseSelections: PhraseSelections = {
      ...props.madLib.activeSelections,
    };
    updatePhraseSelections[phraseSegementIndex] = newValue;
    props.setMadLib({
      ...props.madLib,
      activeSelections: updatePhraseSelections,
    });
  }

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      className={styles.CarouselItem}
    >
      {props.madLib.phrase.map(
        (phraseSegment: PhraseSegment, index: number) => (
          <React.Fragment key={index}>
            {typeof phraseSegment === "string" ? (
              <Grid item>{phraseSegment}</Grid>
            ) : (
              <>
                {/* TODO - don't use this hack to figure out if its a FIPS or not*/}
                {Object.keys(phraseSegment).length > 20 ? (
                  <Grid item>
                    {/* TODO - this is inefficient*/}
                    <FipsSelector
                      key={index}
                      value={props.madLib.activeSelections[index]}
                      onGeoUpdate={(fipsCode: string) =>
                        updateMadLib(index, fipsCode)
                      }
                      options={Object.keys(phraseSegment)
                        .sort((a, b) => {
                          if (a[0].length === b[0].length) {
                            return a[0].localeCompare(b[0]);
                          }
                          return b[0].length > a[0].length ? -1 : 1;
                        })
                        .map((fipsCode) => new Fips(fipsCode))}
                    />
                  </Grid>
                ) : (
                  <Grid
                    item
                    style={{ marginTop: "20px", marginBottom: "-20px" }}
                  >
                    <FormControl>
                      <Select
                        className={styles.MadLibSelect}
                        name={index.toString()}
                        defaultValue={props.madLib.defaultSelections[index]}
                        value={props.madLib.activeSelections[index]}
                        onChange={(event) =>
                          updateMadLib(index, event.target.value as string)
                        }
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
                  </Grid>
                )}
              </>
            )}
          </React.Fragment>
        )
      )}
      <Grid item>
        <IconButton
          aria-label="delete"
          color="primary"
          onClick={() => props.setShareModalOpen(true)}
          data-tip="Share a Link to this Report"
        >
          <ShareIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default ExploreDataPage;
