// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Vega } from "react-vega";
import { useResponsiveWidth } from "../../utils/useResponsiveWidth";

type AggregationOperation = "sum" | "mean";
type NumberFormat = "raw" | "percentage";

const HEIGHT_WIDTH_RATIO = 0.5;
const LEGEND_WIDTH = 100;

const GEO_DATASET = "GEO_DATASET";
const GEO_ID = "id";

const VAR_DATASET = "VAR_DATASET";
const VAR_STATE_FIPS = "state_fips_code";
const VAR_COUNTY_FIPS = "COUNTY_FIPS";

function UsaChloroplethMap(props: {
  data?: Record<string, any>[];
  dataUrl?: string; // Takes CSV or JSON
  varField: string;
  legendTitle: string;
  filterVar?: string;
  filterValue?: string;
  signalListeners: any;
  operation?: AggregationOperation;
  stateFips?: number;
  numberFormat?: NumberFormat;
}) {
  const [ref, width] = useResponsiveWidth();

  // Initial spec state is set in useEffect
  const [spec, setSpec] = useState({});

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
    if (props.operation) {
      varTransformer.push({
        type: "aggregate",
        groupby: [VAR_STATE_FIPS],
        fields: [props.varField], // field name to aggregate on
        ops: [props.operation],
        as: [props.varField], // field name of the aggregation
      });
    }

    /* SET UP GEO DATSET */
    // Transform geo dataset by adding varField from VAR_DATASET
    const fipsKey = props.stateFips ? VAR_COUNTY_FIPS : VAR_STATE_FIPS;
    let geoTransformers: any[] = [
      {
        type: "lookup",
        from: VAR_DATASET,
        key: fipsKey,
        fields: [GEO_ID],
        values: [props.varField],
      },
    ];
    if (props.stateFips) {
      // The first two characters of a county FIPS are the state FIPS
      let stateFipsVar = "slice(datum.id,0,2) == " + props.stateFips;
      geoTransformers.push({
        type: "filter",
        expr: stateFipsVar,
      });
    }

    /* SET UP TOOLTIP */
    let tooltipDatum =
      props.numberFormat === "percentage"
        ? "format(datum." + props.varField + ", '0.1%')"
        : "datum." + props.varField;
    let tooltipValue = 'datum.properties.name + ": " + ' + tooltipDatum;

    /* SET UP LEGEND */
    let legend: any = {
      fill: "colorScale",
      orient: "top-right",
      title: props.legendTitle,
      font: "monospace",
      labelFont: "monospace",
      offset: 10,
    };
    if (props.numberFormat === "percentage") {
      legend["format"] = "0.1%";
    }

    // TODO - update all charts so we can deprecate dataUrl option
    let varDataset = {
      name: VAR_DATASET,
      transform: varTransformer,
    };
    if (props.data) {
      varDataset.values = props.data;
    } else {
      varDataset.format = { type: props.dataUrl.split(".").pop() };
      varDataset.url = props.dataUrl;
    }

    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description:
        "A choropleth map depicting U.S. diabetesloyment temp_maxs by county in 2009.",
      data: [
        varDataset,

        {
          name: GEO_DATASET,
          transform: geoTransformers,
          url:
            "https://raw.githubusercontent.com/kkatzen/het-frontend/designjam2/app/public/counties-10m.json",
          format: {
            type: "topojson",
            feature: props.stateFips ? "counties" : "states",
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
    props.stateFips,
    props.numberFormat,
    props.data,
  ]);

  return (
    <div
      ref={ref}
      style={{
        width: "80%",
        margin: "auto",
      }}
    >
      <Vega spec={spec} width={width} signalListeners={props.signalListeners} />
    </div>
  );
}

export default UsaChloroplethMap;
