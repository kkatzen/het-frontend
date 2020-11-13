// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import VegaStateMap from "../VegaStateMap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import STATE_FIPS_MAP from "../../utils/Fips";
import styles from "./Report.module.scss";

function CountyLevelTable(countyList) {
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
          {countyList.map((county) => (
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

function Demo2Report(props: { state: number; attr1: string; attr2: string }) {
  const [countyList, setCountyList] = useState([]);

  useEffect(() => {
    setCountyList([]);
  }, [props.state]);

  const signalListeners = {
    click: (...args) => {
      let countyIds = countyList.map((datum) => datum.id);
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
    shiftClick: (...args) => {
      setCountyList([]);
    },
  };

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12}>
        <h1>
          Where are the {props.attr1} rates of {props.attr2} in{" "}
          {STATE_FIPS_MAP[props.state]}
        </h1>
      </Grid>
      <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
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
      <Grid item xs={12} sm={12} md={6}>
        <VegaStateMap state={props.state} signalListeners={signalListeners} />
      </Grid>
    </Grid>
  );
}

export default Demo2Report;
