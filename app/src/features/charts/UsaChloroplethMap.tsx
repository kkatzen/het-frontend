import React, { useState, useEffect } from "react";
import { Vega } from "react-vega";
import { useResponsiveWidth } from "../../utils/useResponsiveWidth";
import { Fips } from "../../utils/Fips";

type NumberFormat = "raw" | "percentage";

const HEIGHT_WIDTH_RATIO = 0.5;
const LEGEND_WIDTH = 100;

const GEO_DATASET = "GEO_DATASET";
const GEO_ID = "id";

const VAR_DATASET = "VAR_DATASET";
const VAR_STATE_FIPS = "state_fips";
const VAR_COUNTY_FIPS = "COUNTY_FIPS";

function UsaChloroplethMap(props: {
  data: Record<string, any>[];
  varField: string;
  legendTitle: string;
  signalListeners: any;
  fips: Fips;
  numberFormat?: NumberFormat;
  hideLegend?: boolean;
  showCounties: boolean;
}) {
  const [ref, width] = useResponsiveWidth(
    100 /* default width during intialization */
  );

  // Initial spec state is set in useEffect
  const [spec, setSpec] = useState({});

  useEffect(() => {
    /* SET UP GEO DATSET */
    // Transform geo dataset by adding varField from VAR_DATASET
    const fipsKey = props.showCounties ? VAR_COUNTY_FIPS : VAR_STATE_FIPS;
    let geoTransformers: any[] = [
      {
        type: "lookup",
        from: VAR_DATASET,
        key: fipsKey,
        fields: [GEO_ID],
        values: [props.varField],
      },
    ];
    if (props.fips.isState()) {
      // The first two characters of a county FIPS are the state FIPS
      let stateFipsVar = `slice(datum.id,0,2) == '${props.fips.code}'`;
      geoTransformers.push({
        type: "filter",
        expr: stateFipsVar,
      });
    }
    if (props.fips.isCounty()) {
      geoTransformers.push({
        type: "filter",
        expr: `datum.id === "${props.fips.code}"`,
      });
    }

    /* SET UP TOOLTIP */
    let tooltipDatum =
      props.numberFormat === "percentage"
        ? `format(datum.${props.varField}, '0.1%')`
        : `format(datum.${props.varField}, ',')`;
    let tooltipValue = 'datum.properties.name + ": " + ' + tooltipDatum;

    /* SET UP LEGEND */
    // TODO - Legends should be scaled exactly the same the across compared charts. Looks misleading otherwise.
    let legendList = [];
    let legend: any = {
      fill: "colorScale",
      direction: "horizontal",
      orient: "bottom-left",
      title: props.legendTitle,
      font: "monospace",
      labelFont: "monospace",
      offset: 10,
    };
    if (props.numberFormat === "percentage") {
      legend["format"] = "0.1%";
    }
    if (!props.hideLegend) {
      legendList.push(legend);
    }

    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description:
        "A choropleth map depicting U.S. diabetesloyment temp_maxs by county in 2009.",
      data: [
        {
          name: VAR_DATASET,
          values: props.data,
        },
        {
          name: GEO_DATASET,
          transform: geoTransformers,
          url:
            "https://raw.githubusercontent.com/kkatzen/het-frontend/madlib/app/public/counties-10m.json",
          format: {
            type: "topojson",
            feature: props.showCounties ? "counties" : "states",
          },
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
      legends: legendList,
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
              fill: [{ scale: "colorScale", field: props.varField }],
            },
            hover: { fill: { value: "red" } },
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
    props.numberFormat,
    props.data,
    props.fips,
    props.hideLegend,
    props.showCounties,
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
