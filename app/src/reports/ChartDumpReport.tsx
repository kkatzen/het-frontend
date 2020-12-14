import React from "react";
import { Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { WithVariables } from "../data/WithLoadingOrErrorUI";
import GroupedBarChart from "../charts/GroupedBarChart";
import StackedBarChart from "../charts/StackedBarChart";
import PieChart from "../charts/PieChart";
import LineChart from "../charts/LineChart";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { Fips } from "../utils/madlib/Fips";
import VariableQuery from "../data/VariableQuery";

function ChartDumpReport() {
  const datasetStore = useDatasetStore();
  const breakdownsState1 = Breakdowns.forFips(new Fips("01"));
  const breakdownsState2 = Breakdowns.forFips(new Fips("02"));
  const state1DiabetesQuery = new VariableQuery(
    "diabetes_per_100k",
    breakdownsState1.copy().andRace()
  );
  const state2DiabetesQuery = new VariableQuery(
    "diabetes_per_100k",
    breakdownsState2.copy().andRace()
  );
  const state1CovidQuery = new VariableQuery(
    "covid_cases",
    Breakdowns.forFips(new Fips("37")).andRace(true).andTime()
  );
  const state1PopulationQuery = new VariableQuery(
    "population_pct",
    breakdownsState1.copy().andRace()
  );
  const state2PopulationQuery = new VariableQuery(
    "population_pct",
    breakdownsState2.copy().andRace()
  );
  const queries = [
    state1DiabetesQuery,
    state2DiabetesQuery,
    state1CovidQuery,
    state1PopulationQuery,
    state2PopulationQuery,
  ];
  return (
    <WithVariables queries={queries}>
      {() => {
        const pieChartData = datasetStore
          .getVariables(state1PopulationQuery)
          .filter((r) => r.race_and_ethnicity !== "Total");
        const timeSeriesData = datasetStore.getVariables(state1CovidQuery);
        const geo1 = datasetStore.getVariables(state1DiabetesQuery);
        const geo2 = datasetStore.getVariables(state2DiabetesQuery);
        const groupedChartData = geo1.concat(geo2);
        const population1 = datasetStore.getVariables(state1PopulationQuery);
        const population2 = datasetStore.getVariables(state2PopulationQuery);
        const popChartData = population1
          .concat(population2)
          .filter((r) => r.race_and_ethnicity !== "Total");
        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={12}>
              <h4>
                No guarantees of data accuracy, this is just to get an idea of
                chart types we've implemented
              </h4>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{ width: "500px", margin: "auto", textAlign: "left" }}
              >
                <h1>Pie Chart</h1>
              </div>
              <PieChart
                data={pieChartData}
                categoryField="race_and_ethnicity"
                valueField="population_pct"
              />
              <Divider />
              <div
                style={{ width: "500px", margin: "auto", textAlign: "left" }}
              >
                <h1>Time Series</h1>
              </div>
              <LineChart
                data={timeSeriesData}
                breakdownVar="race_and_ethnicity"
                variable={"covid_cases"}
                timeVariable="date"
              />
              <Divider />
              <div
                style={{ width: "500px", margin: "auto", textAlign: "left" }}
              >
                <h1>Grouped Bar Charts (horizontal or vertical)</h1>
                <b>Examples</b>
                <ul>
                  <li>
                    Show (diabetes) broken down by (race) for (Alaska & Alabama)
                  </li>
                </ul>
              </div>
              <GroupedBarChart
                data={groupedChartData}
                measure={"diabetes_per_100k"}
                dimension1="state_name"
                dimension2="race_and_ethnicity"
                bars="vertical"
              />
              <GroupedBarChart
                data={groupedChartData}
                measure={"diabetes_per_100k"}
                dimension1="state_name"
                dimension2="race_and_ethnicity"
                bars="horizontal"
              />
              <Divider />
              <div
                style={{ width: "500px", margin: "auto", textAlign: "left" }}
              >
                <h1>Stacked Bar Chart</h1>
                <b>Examples</b>
                <ul>
                  <li>
                    Show (total population) broken down by (race) for (Alaska &
                    Alabama)
                  </li>
                </ul>
              </div>
              <StackedBarChart data={popChartData} measure={"population_pct"} />
            </Grid>
          </Grid>
        );
      }}
    </WithVariables>
  );
}

export default ChartDumpReport;
