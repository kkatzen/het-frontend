import React from "react";
import TableChart from "../charts/TableChart";
import { Alert } from "@material-ui/lab";
import CardWrapper from "./CardWrapper";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import VariableQuery from "../data/VariableQuery";
import { Fips } from "../utils/madlib/Fips";
import { BreakdownVar } from "../utils/madlib/DisplayNames";

function TableCard(props: {
  fips: Fips;
  breakdownVar: BreakdownVar;
  variableIds: VariableId[];
  nonstandardizedRace: boolean /* TODO- ideally wouldn't go here, could be calculated based on dataset */;
}) {
  const datasetStore = useDatasetStore();

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const breakdowns = Breakdowns.forFips(props.fips).andRace(
    props.nonstandardizedRace
  );
  const query = new VariableQuery(props.variableIds, breakdowns);

  const datasetIds = getDependentDatasets(props.variableIds);

  return (
    <CardWrapper queries={[query]} datasetIds={datasetIds}>
      {() => {
        const dataset = datasetStore
          .getVariables(query)
          .filter(
            (row) =>
              !["Not Hispanic or Latino", "Total"].includes(
                row.race_and_ethnicity
              )
          );

        return (
          <>
            {dataset.length < 1 && (
              <Alert severity="warning">
                Missing data means that we don't know the full story.
              </Alert>
            )}
            {dataset.length > 0 && (
              <TableChart
                data={dataset}
                fields={[props.breakdownVar as string].concat(
                  props.variableIds
                )}
              />
            )}
          </>
        );
      }}
    </CardWrapper>
  );
}

export default TableCard;
