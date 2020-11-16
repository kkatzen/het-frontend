import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import VegaStateMap from "../VegaStateMap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styles from "./Report.module.scss";
import MADLIB_LIST from "../../utils/MadLibs";

/*
Corresponds to MADLIB_LIST[0]:
Where are the {0:"highest", 1:"lowest"} rates of {0:"obesity", 1:"diabetes"} in STATE_FIPS_MAP ?
*/

interface County {
  id: string;
  name: string;
  rate: number;
}

function CountyLevelTable(countyList: County[]) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>County ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countyList.map((county: County) => (
            <TableRow>
              <TableCell>{county.id}</TableCell>
              <TableCell>{county.name}</TableCell>
              <TableCell>{(county.rate * 100).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function DemoReport(props: { phraseValues: number[] }) {
  const [countyList, setCountyList] = useState<County[]>([]);

  useEffect(() => {
    setCountyList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.phraseValues[5]]);

  const signalListeners: any = {
    click: (...args: any) => {
      let countyIds = countyList.map((datum: County) => datum.id);
      const index = countyIds.indexOf(args[1].id);
      if (index > -1) {
        return;
      }
      let newCountyDatum = {
        id: args[1].id,
        name: args[1].properties.name,
        rate: args[1].rate,
      };
      setCountyList([...countyList, newCountyDatum]);
    },
    shiftClick: (...args: any) => {
      setCountyList([]);
    },
  };

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12} sm={12} md={6}>
        <VegaStateMap
          state={props.phraseValues[5]}
          signalListeners={signalListeners}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
        <h2>
          {MADLIB_LIST[0].phrase.map((textOrBlank, index) => (
            <React.Fragment>
              {textOrBlank.constructor === Object ? (
                <span> {textOrBlank[props.phraseValues[index]]} </span>
              ) : (
                <span>{textOrBlank}</span>
              )}
            </React.Fragment>
          ))}
        </h2>
        <p>
          In case you are curious, the data in the map is unemployment data.
          Please use your imagination that these are helpful charts instead of
          placeholders :)
        </p>
        <p>
          Click on some counties to see data in this table, shift click on map
          to reset.
        </p>
        {CountyLevelTable(countyList)}
      </Grid>
    </Grid>
  );
}

export default DemoReport;
