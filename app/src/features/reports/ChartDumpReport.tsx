import React from "react";
import { Grid } from "@material-ui/core";
import TellMeAboutReport from "./TellMeAboutReport";
import Divider from "@material-ui/core/Divider";
import WithDatasets from "../../utils/WithDatasets";
import VerticalGroupedBarChart from "../charts/VerticalGroupedBarChart";
import StackedBarChart from "../charts/StackedBarChart";
import PieChart from "../charts/PieChart";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import CovidReport from "./CovidReport";
import STATE_FIPS_MAP from "../../utils/Fips";
import VariableProvider from "../../utils/variables/VariableProvider";

function ChartDumpReport() {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders["diabetes_per_100k"];
  const acsProvider = variableProviders["population_pct"];
  const selectedStates = ["Alabama", "Alaska"];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
    acsProvider,
  ]);
  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={12}>
            <h4>
              No guarantees of data accuracy, this is just to get an idea of
              chart types we've implemented
            </h4>
          </Grid>
          <Grid item xs={12}>
            <div style={{ width: "500px", margin: "auto", textAlign: "left" }}>
              <h1>Pie Chart</h1>
            </div>
            <PieChart
              data={acsProvider
                .getData(datasetStore.datasets, Breakdowns.byState().andRace())
                .filter(
                  (r) =>
                    r.state_name === "Alabama" &&
                    r.hispanic_or_latino_and_race !== "Total"
                )}
              categoryField="hispanic_or_latino_and_race"
              valueField="population_pct"
            />
            <Divider />
            <div style={{ width: "500px", margin: "auto", textAlign: "left" }}>
              <h1>Time Series</h1>
              <b>Example</b>
              <ul>
                <li>Show [covid death rates] broken down by [race] in [USA]</li>
              </ul>
            </div>
            <CovidReport
              variable={"covid_deaths_per_100k"}
              geography={STATE_FIPS_MAP[1]}
            />

            <Divider />

            <div style={{ width: "500px", margin: "auto", textAlign: "left" }}>
              <h1>Choropleth</h1>
              <b>Examples</b>
              <ul>
                <li>
                  Color each state by which (race) has highest disparity in
                  death rates
                </li>
                <li>
                  Show which counties in (Alabama) have highest (covid death
                  rates)
                </li>
              </ul>
              <b>Options</b>
              <ul>
                <li>
                  Geo can be one of: States at USA level, Counties at USA level,
                  Counties at State level
                </li>
                <li>
                  Optional: Click on region to pull into a table (although we
                  should refactor the shift click to clear behavior to something
                  more intuitive if we want to use this functionality. shift
                  click was just easy to do at the time)
                </li>
              </ul>
            </div>
            <TellMeAboutReport variable={"diabetes_count"} />

            <Divider />

            <div style={{ width: "500px", margin: "auto", textAlign: "left" }}>
              <h1>Vertical Grouped Bar Chart</h1>
              <b>Examples</b>
              <ul>
                <li>
                  Show (diabetes) broken down by (race) for (Alaska & Alabama)
                </li>
              </ul>
            </div>
            <VerticalGroupedBarChart
              data={variableProvider
                .getData(datasetStore.datasets, Breakdowns.byState().andRace())
                .concat(
                  variableProvider.getData(
                    datasetStore.datasets,
                    Breakdowns.national().andRace()
                  )
                )
                .filter((r) => selectedStates.includes(r.state_name))}
              measure={variableProvider.variableId}
            />
            <Divider />

            <div style={{ width: "500px", margin: "auto", textAlign: "left" }}>
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
                .getData(datasetStore.datasets, Breakdowns.byState().andRace())
                .concat(
                  acsProvider.getData(
                    datasetStore.datasets,
                    Breakdowns.national().andRace()
                  )
                )
                .filter(
                  (r) =>
                    selectedStates.includes(r.state_name) &&
                    r.hispanic_or_latino_and_race !== "Total"
                )}
              measure={acsProvider.variableId}
            />
          </Grid>
        </Grid>
      )}
    </WithDatasets>
  );
}

export default ChartDumpReport;
