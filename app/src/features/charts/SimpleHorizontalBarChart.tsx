import React from "react";
import { Vega, VisualizationSpec } from "react-vega";
import { Row } from "../../utils/DatasetTypes";

function getSpec(
  data: Record<string, any>[],
  dim1: string,
  measure: string
): VisualizationSpec {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    description:
      "Bar chart with text labels. Apply scale padding to make the frame cover the labels.",
    data: { values: data },
    encoding: {
      y: { field: dim1, type: "nominal", sort: "-x" },
      x: { field: measure, type: "quantitative", scale: { padding: 10 } },
    },
    layer: [
      {
        mark: "bar",
      },
      {
        mark: {
          type: "text",
          align: "left",
          baseline: "middle",
          dx: 3,
        },
        encoding: {
          text: { field: measure, type: "quantitative" },
        },
      },
    ],
  };
}

function SimpleHorizontalBarChart(props: {
  data: Row[];
  breakdownVar: string;
  measure: string;
}) {
  return <Vega spec={getSpec(props.data, props.breakdownVar, props.measure)} />;
}

export default SimpleHorizontalBarChart;
