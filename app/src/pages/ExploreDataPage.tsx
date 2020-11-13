// @ts-nocheck

import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import VegaStateMap from "../features/VegaStateMap";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const STATE_FIPS_MAP = {
  0: "the USA",
  1: "Alabama",
  2: "Alaska",
  4: "Arizona",
  5: "Arkansas",
  6: "California",
  8: "Colorado",
  9: "Conneticut",
  10: "Delware",
  12: "Florida",
  13: "Georgia",
  15: "Hawaii",
  16: "Idaho",
  17: "Illinois",
  18: "Indiana",
  19: "Iowa",
  20: "Kansas",
  21: "Kentucky",
  22: "Louisiana",
  23: "Maine",
  24: "Maryland",
  25: "Massachusetts",
  26: "Michigan",
  27: "Minnesota",
  28: "Mississippi",
  29: "Missouri",
  30: "Montana ??",
  31: "Nebraksa",
  32: "Nevada",
  33: "New Hampshire",
  34: "New Jersey",
  35: "New Mexico",
  36: "New York",
  37: "North Carolina",
  38: "North Dakota",
  39: "Ohio",
  40: "Oklahoma",
  41: "Oregon",
  42: "Pennsylvania",
  44: "Rhode Island",
  45: "South Carolina",
  46: "South Dakota",
  47: "Tennesse",
  48: "Texas",
  49: "Utah",
  50: "Vermont",
  51: "Virigina",
  53: "Washington",
  54: "West Virginia",
  55: "Wisconsin",
  56: "Wyomming",
};
/*
      60: "American Samoa",
      66: "Guam",
      69: "Northern Mariana Islands",
      72: "Puerto Rico",
      78: "Virgin Islands"
  */
function Item(props) {
  return (
    <div style={{ padding: "20px" }}>
      <Paper
        elevation={3}
        style={{
          width: "80%",
          padding: "50px",
          margins: "20px",
          margin: "auto",
        }}
      >
        <h2>{props.item}</h2>
      </Paper>
    </div>
  );
}

function ExploreDataPage() {
  const [state, setState] = useState(0);
  const [a, setA] = useState("the number of covid deaths");
  const [b, setB] = useState("obesity cases");
  const [countyList, setCountyList] = useState([]);

  const signalListeners = {
    click: (...args) => {
      let countyIds = countyList.map((datum) => datum.id);
      const index = countyIds.indexOf(args[1].id);
      console.log(index);
      console.log(args[1]);
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

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setState(event.target.value as string);
    setCountyList([]);
  };

  const handleA = (event: React.ChangeEvent<{ value: unknown }>) => {
    setA(event.target.value as string);
  };

  const handleB = (event: React.ChangeEvent<{ value: unknown }>) => {
    setB(event.target.value as string);
    setCountyList([]);
  };

  var items = [
    <React.Fragment>
      Compare
      <Select
        native
        value="the number of covid deaths"
        onChange={handleA}
        style={{ margin: "5px" }}
      >
        <option value={"the number of covid deaths"}>
          the number of covid deaths
        </option>
        <option value={"the number of covid hospitalizations"}>
          the number of covid hospitalizations
        </option>
      </Select>
      to
      <Select
        native
        value="obesity cases"
        onChange={handleB}
        style={{ margin: "5px" }}
      >
        <option value={"obesity cases"}>obesity cases</option>
        <option value={"diabetes cases"}>diabetes cases</option>
      </Select>
      in
      <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state}
          onChange={handleChange}
          style={{ margin: "5px" }}
        >
          {Object.keys(STATE_FIPS_MAP).map((state) => (
            <MenuItem key={state} value={state}>
              {STATE_FIPS_MAP[state]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>,
    <React.Fragment>
      Where are the
      <Select
        native
        value="highest"
        onChange={handleA}
        style={{ margin: "5px" }}
      >
        <option value={"highest"}>highest</option>
        <option value={"lowest"}>lowest</option>
      </Select>
      rates of
      <Select
        native
        value="obesity cases"
        onChange={handleB}
        style={{ margin: "5px" }}
      >
        <option value={"obesity cases"}>obesity cases</option>
        <option value={"diabetes cases"}>diabetes cases</option>
      </Select>
      in
      <FormControl>
        <Select
          style={{ margin: "5px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state}
          onChange={handleChange}
        >
          {Object.keys(STATE_FIPS_MAP).map((state) => (
            <MenuItem key={state} value={state}>
              {STATE_FIPS_MAP[state]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>,
  ];

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
            onChange={(index) => {
              if (index === 1) {
                setA("highest");
                setB("obesity cases");
                setState(0);
              } else {
                setA("the number of covid deaths");
                setB("obesity cases");
                setState(0);
              }
            }}
          >
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </div>
      </div>
      <Grid container spacing={1} alignItems="flex-start">
        <Grid container item xs={12} sm={12} md={6}>
          {state !== -1 && (
            <VegaStateMap state={state} signalListeners={signalListeners} />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          spacing={3}
          style={{ padding: "50px", textAlign: "left" }}
        >
          <h1>{STATE_FIPS_MAP[state]}</h1>
          <h1>{a}</h1>
          <h1>{b}</h1>
          <br />
          {state !== -1 && (
            <p>
              In case you are curious, the data in the map is unemployment data.
              Please use your imagination that these are helpful charts instead
              of placeholders :)
            </p>
          )}

          <p>
            Click on some counties to see data in this table, shift click on map
            to reset.
          </p>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>State ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {countyList.map((county) => (
                  <TableRow>
                    <TableCell>{county.id}</TableCell>
                    <TableCell>{county.name}</TableCell>
                    <TableCell>{county.rate * 100}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ExploreDataPage;
