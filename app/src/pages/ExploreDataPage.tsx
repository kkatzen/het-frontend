// @ts-nocheck

import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

function Item(props) {
  return (
    <div style={{ padding: "20px" }}>
      <Paper
        elevation={3}
        style={{
          width: "80%",
          padding: "50px",
          margin: "20px",
          margin: "auto",
        }}
      >
        <h2>{props.item}</h2>
      </Paper>
    </div>
  );
}

function ExploreDataPage() {
  var items = [
    <React.Fragment>
      Compare
      <Select native value="the number of covid deaths">
        <option value={10}>the number of covid deaths</option>
        <option value={20}>the number of covid hospitalizations</option>
      </Select>
      to
      <Select native value="obesity cases">
        <option value={10}>obesity cases</option>
        <option value={20}>diabetes cases</option>
      </Select>
      in
      <Select native value="the USA">
        <option value={10}>the USA</option>
        <option value={20}>Alabama</option>
        <option value={20}>Alaska</option>
      </Select>
    </React.Fragment>,
    <React.Fragment>
      Where are the
      <Select native value="highest">
        <option value={10}>highest</option>
        <option value={20}>lowest</option>
      </Select>
      rates of
      <Select native value="obesity cases">
        <option value={10}>obesity cases</option>
        <option value={20}>diabetes cases</option>
      </Select>
      in
      <Select native value="the USA">
        <option value={10}>the USA</option>
        <option value={20}>Alabama</option>
        <option value={20}>Alaska</option>
      </Select>
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
          >
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </div>
      </div>
      Research questions; explore key relationships across datasets, chosen by
      us; explore the data freely
    </React.Fragment>
  );
}

export default ExploreDataPage;
