import React from "react";
import WithDatasets from "../data/WithDatasets";
import { LinkWithStickyParams } from "../utils/urlutils";
import GroupedBarChart from "../charts/GroupedBarChart";
import StackedBarChart from "../charts/StackedBarChart";
import { Button, Grid } from "@material-ui/core";
import useDatasetStore from "../data/useDatasetStore";
import variableProviders, { VariableId } from "../data/variableProviders";
import { Breakdowns } from "../data/Breakdowns";
import VariableProvider from "../data/variables/VariableProvider";

function CompareStatesForVariableReport(props: {
  stateFips1: string;
  stateFips2: string;
  variable: VariableId;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  const acsProvider = variableProviders["population_pct"];
  const selectedStateFips = [props.stateFips1, props.stateFips2];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
    acsProvider,
  ]);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => (
        <>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6}>
              <strong>{variableProvider.description}</strong>
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
                  .filter((r) => selectedStateFips.includes(r.state_fips))}
                measure={variableProvider.variableId}
                bars="vertical"
                dimension1="state_name"
                dimension2="race"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <strong>{acsProvider.description}</strong>
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
                      selectedStateFips.includes(r.state_fips) &&
                      r.race_and_ethnicity !== "Total"
                  )}
                measure={acsProvider.variableId}
              />
            </Grid>
          </Grid>
          <Button>
            <LinkWithStickyParams
              to={`/datacatalog?dpf=${requiredDatasets.join(",")}`}
            >
              View Data Sources
            </LinkWithStickyParams>
          </Button>
        </>
      )}
    </WithDatasets>
  );
}

export default CompareStatesForVariableReport;
