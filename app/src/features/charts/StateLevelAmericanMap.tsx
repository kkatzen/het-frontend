import React, { useState, useEffect, useRef } from "react";
import { Vega } from "react-vega";

const HEIGHT_WIDTH_RATIO = 0.5;
const LEGEND_WIDTH = 100;

function StateLevelAmericanMap(props: {
  varField: string;
  legendTitle: string;
  filter: string;
  signalListeners: any;
}) {
  const [width, setWidth] = useState<number | undefined>();
  // Initial spec state is set in useEffect when default geo is set
  const [spec, setSpec] = useState({});

  console.log("props.varField", props.varField);
  console.log("props.filter", props.filter);

  const myRef = useRef(document.createElement("div"));

  useEffect(() => {
    const GEO_DATASET = "GEO_DATASET";
    const GEO_ID = "id";

    const VAR_DATASET = "VAR_DATASET";
    const VAR_FIELD = props.varField; // BRFSS2019_IMPLIED_RACE
    const VAR_FIPS = "FIPS";

    function sum(fieldName: string) {
      return "sum_" + fieldName;
    }

    let datatransformers: any[] = [
      {
        type: "lookup",
        from: VAR_DATASET,
        key: VAR_FIPS,
        fields: [GEO_ID],
        values: [sum(VAR_FIELD)],
      },
    ];

    let diabetesTransformer: any[] = [];
    if (props.filter != "All") {
      diabetesTransformer.push({
        type: "filter",
        expr: "datum.BRFSS2019_IMPLIED_RACE === '" + props.filter + "'",
      });
    }

    diabetesTransformer.push({
      type: "aggregate",
      groupby: [VAR_FIPS],
      fields: [VAR_FIELD],
      ops: ["sum"],
    });

    let tooltipValue = 'datum.properties.name + ": " + datum.' + sum(VAR_FIELD);
    //    let filterRace = "datum.properties.BRFSS2019_IMPLIED_RACE == 'Black'";
    /*
    {
                type: "filter",
                expr: filterRace,
            }*/

    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description:
        "A choropleth map depicting U.S. diabetesloyment temp_maxs by county in 2009.",
      data: [
        {
          name: VAR_DATASET,
          url: "diabetes.csv",
          format: { type: "csv" },
          transform: diabetesTransformer,
        },
        {
          name: GEO_DATASET,
          transform: datatransformers,
          url: "counties-10m.json",
          format: {
            type: "topojson",
            feature: "states",
          },
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
          fit: { signal: "data('" + GEO_DATASET + "')" },
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
          domain: { data: GEO_DATASET, field: sum(VAR_FIELD) },
          range: { scheme: "blues", count: 7 },
        },
      ],
      legends: [
        {
          fill: "colorScale",
          orient: "top-right",
          title: props.legendTitle,
          font: "monospace",
          labelFont: "monospace",
          offset: 10,
        },
      ],
      marks: [
        {
          type: "shape",
          from: { data: GEO_DATASET },
          encode: {
            enter: {
              tooltip: {
                signal: tooltipValue,
              },
            },
            update: {
              fill: [
                {
                  test: "indata('selected', 'id', datum.id)",
                  value: "red",
                },
                { scale: "colorScale", field: sum(VAR_FIELD) },
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
  }, [width, props.varField, props.legendTitle, props.filter]);

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

export default StateLevelAmericanMap;
