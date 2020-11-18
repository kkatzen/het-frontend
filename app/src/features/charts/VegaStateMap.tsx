import React, { useState, useEffect, useRef } from "react";
import { Vega } from "react-vega";

const HEIGHT_WIDTH_RATIO = 0.5;
const LEGEND_WIDTH = 100;

function VegaStateMap(props: { state_fips: number; signalListeners: any }) {
  const [width, setWidth] = useState<number | undefined>();
  // Initial spec state is set in useEffect when default geo is set
  const [spec, setSpec] = useState({});

  const myRef = useRef(document.createElement("div"));

  useEffect(() => {
    let datatransformers: any[] = [
      {
        type: "lookup",
        from: "unemp",
        key: "id",
        fields: ["id"],
        values: ["rate"],
      },
    ];

    if (props.state_fips !== 0) {
      // Converts county FIPS (dataum.id) into it's corresponding State FIPS
      // This isn't properly mapping if fips < 10 - it wants preceding 0
      let stateFipsVar = "floor(datum.id / 1000) == " + props.state_fips;
      datatransformers.push({
        type: "filter",
        expr: stateFipsVar,
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
        {
          name: "selected",
          on: [
            { trigger: "click", insert: "click" },
            { trigger: "shiftClick", remove: "true" },
          ],
        },
      ],
      projections: [
        {
          name: "usProjection",
          type: "albersUsa",
          fit: { signal: "data('countyData')" },
          size: {
            signal:
              "[" +
              (width! - LEGEND_WIDTH) +
              ", " +
              width! * HEIGHT_WIDTH_RATIO +
              "]",
          },
        },
      ],
      scales: [
        {
          name: "colorScale",
          type: "quantize",
          domain: [0, 0.15],
          range: { scheme: "yellowgreenblue", count: 7 },
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
                {
                  test: "indata('selected', 'id', datum.id)",
                  value: "red",
                },
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
  }, [width, props.state_fips]);

  // TODO: useLayoutEffect ?
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
      <Vega spec={spec} width={width} signalListeners={props.signalListeners} />
    </div>
  );
}

export default VegaStateMap;
