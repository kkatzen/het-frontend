import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import { Breakdowns } from "../../utils/Breakdowns";
import variableProviders, {
  VariableId,
  VARIABLE_DISPLAY_NAME_MAP,
} from "../../utils/variableProviders";
import VariableProvider from "../../utils/variables/VariableProvider";
import DisparityBarChartCard from "../cards/DisparityBarChartCard";
import MapCard from "../cards/MapCard";
import TableCard from "../cards/TableCard";
import { DropdownVarId } from "../../utils/MadLibs";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Alert from "@material-ui/lab/Alert";
import { Fips } from "../../utils/Fips";

export type MetricToggle = "covid_cases" | "covid_deaths" | "covid_hosp";

const SUPPORTED_VARIABLES: DropdownVarId[] = ["covid"];

const DDV_TO_VAR: Record<string, string[]> = {
  covid: ["covid_cases", "covid_deaths", "covid_hosp"],
};

const METRIC_NAMES: Record<MetricToggle, string> = {
  covid_cases: "COVID-19 Cases",
  covid_deaths: "COVID-19 Deaths",
  covid_hosp: "COVID-19 Hospitalizations",
};

function asDate(dateStr: string) {
  const parts = dateStr.split("-").map(Number);
  // Date expects month to be 0-indexed so need to subtract 1.
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function DisVarGeo(props: {
  dropdownVarId: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const [metric, setMetric] = useState<MetricToggle>(
    SUPPORTED_VARIABLES.includes(props.dropdownVarId)
      ? (DDV_TO_VAR[props.dropdownVarId as string][0] as MetricToggle)
      : (DDV_TO_VAR[0][0] as MetricToggle)
  );

  const datasetStore = useDatasetStore();
  const percentProvider =
    variableProviders[(metric + "_pct_of_geo") as VariableId];
  const popProvider = variableProviders["population_pct"];
  const datasetIds = VariableProvider.getUniqueDatasetIds([
    percentProvider,
    popProvider,
  ]);

  return (
    <>
      {!SUPPORTED_VARIABLES.includes(props.dropdownVarId) && (
        <Grid container xs={12} spacing={1} justify="center">
          <Grid item xs={5}>
            <Alert severity="error">Data not currently available</Alert>
          </Grid>
        </Grid>
      )}

      {SUPPORTED_VARIABLES.includes(props.dropdownVarId) && (
        <Grid container spacing={1} justify="center">
          <WithDatasets datasetIds={datasetIds}>
            {() => {
              const data = percentProvider
                .getData(
                  datasetStore.datasets,
                  Breakdowns.byState().andTime().andRace(true)
                )
                .concat(
                  percentProvider.getData(
                    datasetStore.datasets,
                    Breakdowns.national().andTime().andRace(true)
                  )
                )
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

              const dataset = mostRecent;

              const geoFilteredDataset = mostRecent
                .filter((r) => r.hispanic_or_latino_and_race !== "Total")
                .filter((row) => row.state_fips_code === props.fips.code);

              return (
                <>
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
                      {DDV_TO_VAR[props.dropdownVarId].map(
                        (variableId: string, key: number) => (
                          <ToggleButton
                            value={variableId as VariableId}
                            key={key}
                          >
                            {
                              VARIABLE_DISPLAY_NAME_MAP[
                                variableId as VariableId
                              ]
                            }
                          </ToggleButton>
                        )
                      )}
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid item xs={props.vertical ? 12 : 6}>
                    <MapCard
                      data={dataset}
                      datasetIds={datasetIds}
                      varField={(metric + "_per_100k") as VariableId}
                      varFieldDisplayName={
                        VARIABLE_DISPLAY_NAME_MAP[
                          (metric + "_per_100k") as VariableId
                        ]
                      }
                      fips={props.fips}
                      updateFipsCallback={(fips: Fips) => {
                        props.updateFipsCallback(fips);
                      }}
                      enableFilter={true}
                      showCounties={false}
                    />
                    <TableCard
                      data={geoFilteredDataset}
                      fields={[
                        {
                          name: "hispanic_or_latino_and_race",
                          displayName: "Race",
                        },
                        { name: "population", displayName: "Population" },
                        {
                          name: "population_pct",
                          displayName:
                            VARIABLE_DISPLAY_NAME_MAP[
                              "population_pct" as VariableId
                            ],
                        },
                        {
                          name: metric + "_pct_of_geo",
                          displayName:
                            VARIABLE_DISPLAY_NAME_MAP[
                              (metric + "_pct_of_geo") as VariableId
                            ],
                        },
                        {
                          name: metric + "_per_100k",
                          displayName:
                            VARIABLE_DISPLAY_NAME_MAP[
                              (metric + "_per_100k") as VariableId
                            ],
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={props.vertical ? 12 : 6}>
                    <DisparityBarChartCard
                      dataset={geoFilteredDataset}
                      datasetIds={datasetIds}
                      metricId={metric}
                      variableTitle={METRIC_NAMES[metric]}
                      breakdownVar="hispanic_or_latino_and_race"
                      breakdownVarDisplayName="Race/Ethnicity"
                      fips={props.fips}
                    />
                    <DisparityBarChartCard
                      datasetIds={datasetIds}
                      metricId={metric}
                      variableTitle={METRIC_NAMES[metric]}
                      breakdownVar="age"
                      breakdownVarDisplayName="Age"
                      fips={props.fips}
                    />
                    <DisparityBarChartCard
                      datasetIds={datasetIds}
                      metricId={metric}
                      variableTitle={METRIC_NAMES[metric]}
                      breakdownVar="gender"
                      breakdownVarDisplayName="Gender"
                      fips={props.fips}
                    />
                  </Grid>
                </>
              );
            }}
          </WithDatasets>
        </Grid>
      )}
    </>
  );
}

export default DisVarGeo;
