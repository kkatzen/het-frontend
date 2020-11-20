import React from "react";
import { Vega, VisualizationSpec } from "react-vega";
import { Row } from "../../utils/DatasetTypes";

function getSpec(
  data: Record<string, any>[],
  dim1: string,
  dim2: string,
  measure: string
): VisualizationSpec {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: { values: data },
    width: { step: 12 },
    mark: "bar",
    encoding: {
      column: {
        field: dim1,
        type: "ordinal",
        spacing: 10,
        title: "",
      },
      y: {
        aggregate: "sum",
        field: measure,
        axis: { grid: false, title: "", ticks: false },
      },
      x: {
        field: dim2,
        axis: { title: "", labels: false },
      },
      color: {
        field: dim2,
        type: "nominal",
        scale: { scheme: "tableau10" },
        legend: { title: "" },
      },
    },
    config: {
      view: { stroke: "transparent" },
      axis: { domainWidth: 1 },
    },
  };
}

function VerticalGroupedBarChart(props: { data: Row[]; measure: string }) {
  return (
    <Vega spec={getSpec(props.data, "state_name", "race", props.measure)} />
  );
}

export default VerticalGroupedBarChart;
