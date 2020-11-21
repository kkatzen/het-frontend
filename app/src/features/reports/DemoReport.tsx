import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
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

function DemoReport(props: { madLib: MadLib }) {
  const [countyList, setCountyList] = useState<County[]>([]);

  useEffect(() => {
    setCountyList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.madLib.activeSelections[5]]);

  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      let countyIds = countyList.map((datum: County) => datum.id);
      if (!countyIds.includes(args[1].id)) {
        let newCountyDatum = {
          id: clickedData.id,
          name: clickedData.properties.name,
          rate: clickedData.rate,
        };
        setCountyList([...countyList, newCountyDatum]);
      }
    },
    shiftClick: () => {
      setCountyList([]);
    },
  };

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12} sm={12} md={6}>
        {props.madLib.activeSelections[5] === 0 && (
          <UsaChloroplethMap
            signalListeners={signalListeners}
            varField="rate"
            legendTitle="% unemployed"
            dataUrl="tmp/unemp.csv"
            operation="mean"
            numberFormat="percentage"
          />
        )}
        {props.madLib.activeSelections[5] !== 0 && (
          <UsaChloroplethMap
            stateFips={props.madLib.activeSelections[5]}
            signalListeners={signalListeners}
            varField="rate"
            legendTitle="% unemployed"
            dataUrl="tmp/unemp.csv"
            numberFormat="percentage"
          />
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
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
