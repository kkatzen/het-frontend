//@ts-nocheck
import React from "react";
import { Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import WithDatasets from "../data/WithDatasets";
import GroupedBarChart from "../charts/GroupedBarChart";
import StackedBarChart from "../charts/StackedBarChart";
import PieChart from "../charts/PieChart";
import LineChart from "../charts/LineChart";
import useDatasetStore from "../data/useDatasetStore";
import variableProviders from "../data/variableProviders";
import { Breakdowns } from "../data/Breakdowns";
import VariableProvider from "../data/variables/VariableProvider";

function ChartDumpReport() {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders["diabetes_per_100k"];
  const covidProvider = variableProviders["covid_cases"];
  const acsProvider = variableProviders["population_pct"];
  const selectedStates = ["Alabama", "Alaska"];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
    acsProvider,
  ]);
  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        const data = covidProvider
          .getData(
            datasetStore.datasets,
            Breakdowns.byState().andTime().andRace(true)
          )
          .concat(
            covidProvider.getData(
              datasetStore.datasets,
              Breakdowns.national().andTime().andRace(true)
            )
          )
          .filter((row) => row.state_fips === "37")
          .filter(
            (row) => !row.race_and_ethnicity.includes("Some other race alone")
          );

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
                data={acsProvider
                  .getData(
                    datasetStore.datasets,
                    Breakdowns.byState().andRace()
                  )
                  .filter(
                    (r) =>
                      r.state_name === "Alabama" &&
                      r.race_and_ethnicity !== "Total"
                  )}
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
                data={data}
                breakdownVar="race_and_ethnicity"
                variable={covidProvider.variableId}
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
                data={variableProvider
                  .getData(
                    datasetStore.datasets,
                    Breakdowns.byState().andRace()
                  )
                  .concat(
                    variableProvider.getData(
                      datasetStore.datasets,
                      Breakdowns.national().andRace()
                    )
                  )
                  .filter((r) => selectedStates.includes(r.state_name))}
                measure={variableProvider.variableId}
                dimension1="state_name"
                dimension2="race"
                bars="vertical"
              />
              <GroupedBarChart
                data={variableProvider
                  .getData(
                    datasetStore.datasets,
                    Breakdowns.byState().andRace()
                  )
                  .concat(
                    variableProvider.getData(
                      datasetStore.datasets,
                      Breakdowns.national().andRace()
                    )
                  )
                  .filter((r) => selectedStates.includes(r.state_name))}
                measure={variableProvider.variableId}
                bars="horizontal"
                dimension1="state_name"
                dimension2="race"
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
              <StackedBarChart
                data={acsProvider
                  .getData(
                    datasetStore.datasets,
                    Breakdowns.byState().andRace()
                  )
                  .concat(
                    acsProvider.getData(
                      datasetStore.datasets,
                      Breakdowns.national().andRace()
                    )
                  )
                  .filter(
                    (r) =>
                      selectedStates.includes(r.state_name) &&
                      r.race_and_ethnicity !== "Total"
                  )}
                measure={acsProvider.variableId}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default ChartDumpReport;
