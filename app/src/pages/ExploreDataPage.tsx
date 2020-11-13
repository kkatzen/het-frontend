// @ts-nocheck

import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import DemoReport from "../features/madlib_reports/DemoReport";
import Demo2Report from "../features/madlib_reports/Demo2Report";
import MenuItem from "@material-ui/core/MenuItem";
import STATE_FIPS_MAP from "../utils/Fips";

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
  const [phraseIndex, setPhraseIndex] = useState(0);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setState(event.target.value as string);
  };

  const handleA = (event: React.ChangeEvent<{ value: unknown }>) => {
    setA(event.target.value as string);
  };

  const handleB = (event: React.ChangeEvent<{ value: unknown }>) => {
    setB(event.target.value as string);
  };

  var items = [
    <React.Fragment>
      Compare
      <Select native value={a} onChange={handleA} style={{ margin: "5px" }}>
        <option value={"the number of covid deaths"}>
          the number of covid deaths
        </option>
        <option value={"the number of covid hospitalizations"}>
          the number of covid hospitalizations
        </option>
      </Select>
      to
      <Select native value={b} onChange={handleB} style={{ margin: "5px" }}>
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
      <Select native value={a} onChange={handleA} style={{ margin: "5px" }}>
        <option value={"highest"}>highest</option>
        <option value={"lowest"}>lowest</option>
      </Select>
      rates of
      <Select native value={b} onChange={handleB} style={{ margin: "5px" }}>
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
                setPhraseIndex(index);
                ///                setCountyList([]);
                // TODO send signal to vega to clear the counties
              } else {
                setA("the number of covid deaths");
                setB("obesity cases");
                setState(0);
                setPhraseIndex(index);
                //   setCountyList([]);
                // TODO send signal to vega to clear the counties
              }
            }}
          >
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </div>
      </div>
      <div style={{ width: "95%", margin: "20px auto" }}>
        {phraseIndex === 0 && <DemoReport state={state} attr1={a} attr2={b} />}
        {phraseIndex === 1 && <Demo2Report state={state} attr1={a} attr2={b} />}
      </div>
    </React.Fragment>
  );
}

export default ExploreDataPage;
