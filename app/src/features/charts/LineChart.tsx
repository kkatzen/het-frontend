import React from "react";
import { Vega } from "react-vega";

function LineChart(props: {
  data: {}; // for instance, race
  breakdownVar: string; // for instance, race
  breakdownValues: string[]; // array of the values of breakdown
  variable: string; // for instance, rate
  timeVariable: string; // for instance, rate
}) {
  const tooltipValues = props.breakdownValues.map((raceName) => ({
    field: raceName,
    type: "quantitative",
  }));

  const liteSpec: any = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: props.data,
    width: 400,
    height: 300,
    encoding: {
      x: {
        field: props.timeVariable,
        type: "temporal",
      },
    },
    layer: [
      {
        encoding: {
          color: {
            field: props.breakdownVar,
            type: "nominal",
          },
          y: {
            field: props.variable,
            type: "quantitative",
          },
        },
        layer: [
          {
            mark: "line",
          },
          {
            transform: [
              {
                filter: {
                  selection: "hover",
                },
              },
            ],
            mark: "point",
          },
        ],
      },
      {
        transform: [
          {
            pivot: props.breakdownVar,
            value: props.variable,
            groupby: [props.timeVariable],
          },
        ],
        mark: "rule",
        encoding: {
          opacity: {
            condition: {
              value: 0.3,
              selection: "hover",
            },
            value: 0,
          },
          tooltip: tooltipValues,
        },
        selection: {
          hover: {
            type: "single",
            fields: [props.timeVariable],
            nearest: true,
            on: "mouseover",
            empty: "none",
            clear: "mouseout",
          },
        },
      },
    ],
  };

  return <Vega spec={liteSpec} />;
}

export default LineChart;
