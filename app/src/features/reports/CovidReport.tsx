import React from "react";
import { Grid } from "@material-ui/core";
import LineChart from "../charts/LineChart";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import VariableProvider from "../../utils/variables/VariableProvider";
import TwoVarBarChart from "../charts/TwoVarBarChart";

function asDate(dateStr: string) {
  const parts = dateStr.split("-").map(Number);
  // Date expects month to be 0-indexed so need to subtract 1.
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function CovidReport(props: { variable: VariableId; stateFips: string }) {
  const datasetStore = useDatasetStore();
  const covidProvider = variableProviders[props.variable];
  const popProvider = variableProviders["population_pct"];
  const datasetIds = VariableProvider.getUniqueDatasetIds([
    covidProvider,
    popProvider,
  ]);

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12}>
        <WithDatasets datasetIds={datasetIds}>
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
              .filter((row) => row.state_fips_code === props.stateFips)
              .filter(
                (row) =>
                  !row.hispanic_or_latino_and_race.includes(
                    "Some other race alone"
                  )
              );

            const dateTimes = data.map((row) => asDate(row.date).getTime());
            const lastDate = new Date(Math.max(...dateTimes));
            const mostRecent = data.filter(
              (row) => asDate(row.date).getTime() === lastDate.getTime()
            );

            // TODO make it more convenient to do this concat pattern
            const populationData = popProvider
              .getData(
                datasetStore.datasets,
                Breakdowns.byState().andRace(true)
              )
              .concat(
                popProvider.getData(
                  datasetStore.datasets,
                  Breakdowns.national().andRace(true)
                )
              );

            const populationDataStandardized = popProvider
              .getData(datasetStore.datasets, Breakdowns.byState().andRace())
              .concat(
                popProvider.getData(
                  datasetStore.datasets,
                  Breakdowns.national().andRace()
                )
              );

            // TODO why is the line chart showing one day earlier?
            return (
              <>
                {covidProvider.variableId.endsWith("pct_of_geo") && (
                  <TwoVarBarChart
                    data={mostRecent.filter(
                      (r) => r.hispanic_or_latino_and_race !== "Total"
                    )}
                    thickMeasure="population_pct"
                    thinMeasure={covidProvider.variableId}
                    breakdownVar="hispanic_or_latino_and_race"
                  />
                )}
                <LineChart
                  data={data}
                  breakdownVar="hispanic_or_latino_and_race"
                  variable={covidProvider.variableId}
                  timeVariable="date"
                />
                <SimpleHorizontalBarChart
                  data={mostRecent}
                  breakdownVar="hispanic_or_latino_and_race"
                  measure={covidProvider.variableId}
                />
                <SimpleHorizontalBarChart
                  data={populationData.filter(
                    (row) => row.state_fips_code === props.stateFips
                  )}
                  breakdownVar="hispanic_or_latino_and_race"
                  measure={popProvider.variableId}
                />
                <SimpleHorizontalBarChart
                  data={populationDataStandardized.filter(
                    (row) => row.state_fips_code === props.stateFips
                  )}
                  breakdownVar="hispanic_or_latino_and_race"
                  measure={popProvider.variableId}
                />
              </>
            );
          }}
        </WithDatasets>
      </Grid>
    </Grid>
  );
}

export default CovidReport;
