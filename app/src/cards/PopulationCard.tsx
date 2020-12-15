import React from "react";
import StackedBarChart from "../charts/StackedBarChart";
import { Alert } from "@material-ui/lab";
import CardWrapper from "./CardWrapper";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import VariableQuery from "../data/VariableQuery";
import { Fips } from "../utils/madlib/Fips";
import { CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function PopulationCard(props: { fips: Fips }) {
  const datasetStore = useDatasetStore();

  const variableIds: VariableId[] = ["population", "population_pct"];
  const query = new VariableQuery(
    variableIds,
    Breakdowns.forFips(props.fips).andRace()
  );

  return (
    <CardWrapper
      titleText={`Population Info for ${props.fips.getFullDisplayName()}`}
      queries={[query]}
      datasetIds={getDependentDatasets(variableIds)}
    >
      {() => {
        const dataset = datasetStore.getVariables(query);
        const stackedBarChartData = dataset.filter(
          (r) => r.race_and_ethnicity !== "Total"
        );
        const totalPopulation = dataset.find(
          (r) => r.race_and_ethnicity === "Total"
        );
        const totalPopulationSize = totalPopulation
          ? totalPopulation["population"].toLocaleString("en")
          : "Data retrieval error";

        return (
          <>
            {dataset.length < 1 && (
              <Alert severity="warning">
                Missing data means that we don't know the full story.
              </Alert>
            )}
            {dataset.length > 0 && (
              <>
                <CardContent>
                  <Typography>
                    There are <b>{totalPopulationSize}</b> people living in{" "}
                    {props.fips.getFullDisplayName()}
                  </Typography>
                </CardContent>
                <CardContent>
                  <StackedBarChart
                    data={stackedBarChartData}
                    measure={"population_pct"}
                  />
                </CardContent>
              </>
            )}
          </>
        );
      }}
    </CardWrapper>
  );
}

export default PopulationCard;
