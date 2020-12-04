import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import { Breakdowns } from "../../utils/Breakdowns";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import VariableProvider from "../../utils/variables/VariableProvider";
import TwoVarBarChart from "../charts/TwoVarBarChart";
import TableChart from "../charts/TableChart";
import { DropdownVarId } from "../../utils/MadLibs";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Alert from "@material-ui/lab/Alert";

function asDate(dateStr: string) {
  const parts = dateStr.split("-").map(Number);
  // Date expects month to be 0-indexed so need to subtract 1.
  return new Date(parts[0], parts[1] - 1, parts[2]);
}
//covid_cases_pct_of_geo covid_deaths_pct_of_geo	covid_hosp_pct_of_geo

function DisVarGeo(props: { variable: DropdownVarId; stateFips: string }) {
  const [metric, setMetric] = useState<VariableId>("covid_cases_pct_of_geo");

  const datasetStore = useDatasetStore();
  // TODO- no hardocde
  const covidProvider = variableProviders[metric];
  const popProvider = variableProviders["population_pct"];
  const datasetIds = VariableProvider.getUniqueDatasetIds([
    covidProvider,
    popProvider,
  ]);

  return (
    <>
      {props.variable !== "covid" && (
        <Alert severity="error">Data not currently available</Alert>
      )}

      {props.variable === "covid" && (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={12}>
            <ToggleButtonGroup
              exclusive
              value={metric}
              onChange={(e, v) => {
                if (v !== null) {
                  setMetric(v);
                }
              }}
              aria-label="text formatting"
            >
              <ToggleButton value="covid_cases_pct_of_geo">Cases</ToggleButton>
              <ToggleButton value="covid_deaths_pct_of_geo">
                Deaths
              </ToggleButton>
              <ToggleButton value="covid_hosp_pct_of_geo">
                Hospitalizations
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
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

                const dataset = mostRecent.filter(
                  (r) => r.hispanic_or_latino_and_race !== "Total"
                );

                return (
                  <>
                    <TwoVarBarChart
                      data={dataset}
                      thickMeasure="population_pct"
                      thinMeasure={covidProvider.variableId}
                      breakdownVar="hispanic_or_latino_and_race"
                    />
                    <TableChart
                      data={dataset}
                      fields={[
                        {
                          name: "hispanic_or_latino_and_race",
                          displayName: "Race",
                        },
                        { name: "population", displayName: "Population" },
                        { name: "population_pct", displayName: "Population %" },
                        { name: metric, displayName: metric },
                      ]}
                    />
                  </>
                );
              }}
            </WithDatasets>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default DisVarGeo;
