// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Vega } from "react-vega";

const HEIGHT_WIDTH_RATIO = 0.5;
const LEGEND_WIDTH = 100;

function VegaStateMap(props: { state: number }) {
  const [width, setWidth] = useState();
  const [spec, setSpec] = useState({}); // Initial state set in useEffect when default state is set
  const [countyList, setCountyList] = useState([]);

  const myRef = useRef(document.createElement("div"));

  useEffect(() => {
    let datatransformers = [
      {
        type: "lookup",
        from: "unemp",
        key: "id",
        fields: ["id"],
        values: ["rate"],
      },
      //{ type: "filter", expr: "datum.rate != null" },
    ];

    if (props.state !== 0) {
      datatransformers.push({
        type: "filter",
        expr: "floor(datum.id / 1000) == " + props.state,
      });
    }

    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description:
        "A choropleth map depicting U.S. unemployment rates by county in 2009.",
      data: [
        {
          name: "unemp",
          url:
            "https://vega.github.io/vega-lite/examples/data/unemployment.tsv",
          format: { type: "tsv", parse: "auto", delimiter: "\t" },
        },
        {
          name: "countyData",
          url: "counties-10m.json",
          format: { type: "topojson", feature: "counties" },
          transform: datatransformers,
        },
        /*        {
          name: "selected",
          on: [
            { trigger: "click", insert: "click" },
            { trigger: "shiftClick", remove: "true" },
          ],
        }, */
      ],
      projections: [
        {
          name: "usProjection",
          type: "albersUsa",
          fit: { signal: "data('countyData')" },
          size: {
            signal:
              "[" +
              (width - LEGEND_WIDTH) +
              ", " +
              width * HEIGHT_WIDTH_RATIO +
              "]",
          },
        },
      ],
      scales: [
        {
          name: "colorScale",
          type: "quantize",
          domain: [0, 0.15],
          range: { scheme: "blues", count: 7 },
        },
      ],
      legends: [
        {
          fill: "colorScale",
          orient: "top-right",
          title: "Unemployment",
          format: "0.1%",
          font: "monospace",
          labelFont: "monospace",
          offset: 10,
        },
      ],
      marks: [
        {
          type: "shape",
          from: { data: "countyData" },
          encode: {
            enter: {
              tooltip: {
                signal:
                  "datum.properties.name + \": \" + format(datum.rate, '0.1%')",
              },
            },
            update: {
              fill: [
                /* {
                  test: "indata('selected', 'id', datum.id)",
                  value: "red",
                },*/
                { scale: "colorScale", field: "rate" },
              ],
            },
            hover: { fill: { value: "pink" } },
          },
          transform: [{ type: "geoshape", projection: "usProjection" }],
        },
      ],
      signals: [
        {
          name: "click",
          value: 0,
          on: [{ events: "*:mousedown", update: "datum" }],
        },
        {
          name: "shiftClick",
          on: [{ events: "click[event.shiftKey]", update: "datum" }],
        },
      ],
    });
  }, [width, props.state]);

  useEffect(() => {
    if (myRef && myRef.current) {
      setWidth(myRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (myRef && myRef.current) {
        setWidth(myRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

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

  // https://vega.github.io/vega-lite/docs/selection.
  // https://vega.github.io/vega/docs/api/view/

  return (
    <div
      ref={myRef}
      style={{
        width: "80%",
        margin: "auto",
      }}
    >
      <div
        style={{
          margin: "auto",
          marginBottom: "40px",
        }}
      ></div>
      <Vega
        spec={spec}
        width={width}
        height={width * HEIGHT_WIDTH_RATIO}
        signalListeners={signalListeners}
      />
    </div>
  );
}

export default VegaStateMap;
