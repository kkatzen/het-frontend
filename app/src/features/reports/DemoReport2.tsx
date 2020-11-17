// @ts-nocheck

import React, { useState } from "react";
import { Paper, Grid } from "@material-ui/core";
import StateLevelAmericanMap from "../charts/StateLevelAmericanMap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styles from "./Report.module.scss";
import { MadLib } from "../../utils/MadLibs";

/*
Corresponds to:
Tell me about {0:"copd", 1:"diabetes"} in USA ?
*/

interface County {
  id: string;
  name: string;
  value: number;
}

function CountyLevelTable(countyList: County[]) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Cases</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countyList.map((county: County) => (
            <TableRow>
              <TableCell>{county.name}</TableCell>
              <TableCell>{county.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function DemoReport2(props: { madlib: MadLib; phraseSelectionIds: number[] }) {
  const [countyList, setCountyList] = useState<County[]>([]);

  useEffect(() => {
    setCountyList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.phraseSelectionIds[1]]);

  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      let countyIds = countyList.map((datum: County) => datum.id);
      if (!countyIds.includes(args[1].id)) {
        console.log(clickedData);
        let newCountyDatum = {
          id: clickedData.id,
          name: clickedData.properties.name,
          value:
            clickedData["sum_" + FIELDS[props.phraseSelectionIds[1]].field],
        };
        setCountyList([...countyList, newCountyDatum]);
      }
    },
    shiftClick: () => {
      setCountyList([]);
    },
  };

  const FIELDS = {
    0: { field: "COPD_YES", legend: "# COPD cases" },
    1: { field: "DIABETES_YES_YESPREGNANT", legend: "# Diabetes cases" },
  };

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12}>
        <h2>
          {props.madlib.phrase.map((phraseSegment, index) => (
            <React.Fragment>
              {phraseSegment.constructor === Object ? (
                <span> {phraseSegment[props.phraseSelectionIds[index]]} </span>
              ) : (
                <span>{phraseSegment}</span>
              )}
            </React.Fragment>
          ))}
        </h2>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <StateLevelAmericanMap
          signalListeners={signalListeners}
          varField={FIELDS[props.phraseSelectionIds[1]].field}
          legendTitle={FIELDS[props.phraseSelectionIds[1]].legend}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
        <p>
          Click on some states to see data in this table, shift click on map to
          reset.
        </p>
        {CountyLevelTable(countyList)}
      </Grid>
    </Grid>
  );
}

export default DemoReport2;
