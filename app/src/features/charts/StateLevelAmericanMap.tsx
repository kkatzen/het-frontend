import React, { useState, useEffect, useRef } from "react";
import { Vega } from "react-vega";

type AggregationOperation = "sum" | "mean";

const HEIGHT_WIDTH_RATIO = 0.5;
const LEGEND_WIDTH = 100;

const GEO_DATASET = "GEO_DATASET";
const GEO_ID = "id";

const VAR_DATASET = "VAR_DATASET";
const VAR_FIPS = "FIPS";

function StateLevelAmericanMap(props: {
  dataUrl: string;
  varField: string;
  legendTitle: string;
  filterVar?: string;
  filterValue?: string;
  signalListeners: any;
  operation: AggregationOperation;
  countyLevel?: boolean;
}) {
  const [width, setWidth] = useState<number | undefined>();
  // Initial spec state is set in useEffect when default geo is set
  const [spec, setSpec] = useState({});
  const myRef = useRef(document.createElement("div"));

  // const [ref, width] = useResponsiveChartWidth()

  useEffect(() => {
    /* SET UP VARIABLE DATSET */

    let varTransformer: any[] = [];
    // If user wants data filtered, we first apply the filter
    if (props.filterVar && props.filterValue && props.filterValue !== "All") {
      varTransformer.push({
        type: "filter",
        expr: "datum." + props.filterVar + " === '" + props.filterValue + "'",
      });
    }
    // Next we perform the aggregation based on requested operation
    varTransformer.push({
      type: "aggregate",
      groupby: [VAR_FIPS],
      fields: [props.varField], // field name to aggregate on
      ops: [props.operation],
      as: [props.varField], // field name of the aggregation
    });

    /* SET UP GEO DATSET */

    // Transform geo dataset by adding varField from VAR_DATASET
    let geoTransformers: any[] = [
      {
        type: "lookup",
        from: VAR_DATASET,
        key: VAR_FIPS,
        fields: [GEO_ID],
        values: [props.varField],
      },
    ];

    // TODO - this is hacky based on the datasets we're demoing with
    let tooltipDatum =
      props.operation === "mean"
        ? "format(datum." + props.varField + ", '0.1%')"
        : "datum." + props.varField;
    let tooltipValue = 'datum.properties.name + ": " + ' + tooltipDatum;

    let legend: any = {
      fill: "colorScale",
      orient: "top-right",
      title: props.legendTitle,
      font: "monospace",
      labelFont: "monospace",
      offset: 10,
    };
    // TODO - this is hacky based on the datasets we're demoing with
    if (props.operation === "mean") {
      legend["format"] = "0.1%";
    }

    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description:
        "A choropleth map depicting U.S. diabetesloyment temp_maxs by county in 2009.",
      data: [
        {
          name: VAR_DATASET,
          url: props.dataUrl,
          format: { type: "csv" },
          transform: varTransformer,
        },
        {
          name: GEO_DATASET,
          transform: geoTransformers,
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
          domain: { data: GEO_DATASET, field: props.varField },
          range: { scheme: "yellowgreenblue", count: 7 },
        },
      ],
      legends: [legend],
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
                { scale: "colorScale", field: props.varField },
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
  }, [
    width,
    props.varField,
    props.legendTitle,
    props.filterVar,
    props.filterValue,
    props.dataUrl,
    props.operation,
  ]);

  // TODO: useLayoutEffect or other
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
      <Vega spec={spec} width={width} signalListeners={props.signalListeners} />
    </div>
  );
}

export default StateLevelAmericanMap;
