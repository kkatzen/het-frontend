import React from "react";
import { WithVariables } from "../data/WithLoadingOrErrorUI";
import { LinkWithStickyParams } from "../utils/urlutils";
import GroupedBarChart from "../charts/GroupedBarChart";
import StackedBarChart from "../charts/StackedBarChart";
import { Button, Grid } from "@material-ui/core";
import useDatasetStore from "../data/useDatasetStore";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import { Breakdowns } from "../data/Breakdowns";
import { Fips } from "../utils/madlib/Fips";
import VariableQuery from "../data/VariableQuery";

function CompareStatesForVariableReport(props: {
  stateFips1: Fips;
  stateFips2: Fips;
  variable: VariableId;
}) {
  const datasetStore = useDatasetStore();

  const breakdownsGeo1 = Breakdowns.forFips(props.stateFips1).andRace();
  const breakdownsGeo2 = Breakdowns.forFips(props.stateFips2).andRace();
  const geo1Query = new VariableQuery(props.variable, breakdownsGeo1);
  const geo2Query = new VariableQuery(props.variable, breakdownsGeo2);
  const geo1PopQuery = new VariableQuery("population_pct", breakdownsGeo1);
  const geo2PopQuery = new VariableQuery("population_pct", breakdownsGeo2);

  const queries = [geo1Query, geo2Query, geo1PopQuery, geo2PopQuery];
  const datasetIds = getDependentDatasets([props.variable, "population_pct"]);

  return (
    <WithVariables queries={queries}>
      {() => {
        const geo1 = datasetStore.getVariables(geo1Query);
        const geo2 = datasetStore.getVariables(geo2Query);
        const groupedChartData = geo1.concat(geo2);
        const population1 = datasetStore.getVariables(geo1PopQuery);
        const population2 = datasetStore.getVariables(geo2PopQuery);
        const popChartData = population1
          .concat(population2)
          .filter((r) => r.race_and_ethnicity !== "Total");
        return (
          <>
            <Grid container spacing={1} alignItems="flex-start">
              <Grid item xs={12} sm={12} md={6}>
                <GroupedBarChart
                  data={groupedChartData}
                  measure={props.variable}
                  bars="vertical"
                  dimension1="state_name"
                  dimension2="race_and_ethnicity"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <StackedBarChart
                  data={popChartData}
                  measure={"population_pct"}
                />
              </Grid>
            </Grid>
            <Button>
              <LinkWithStickyParams
                to={`/datacatalog?dpf=${datasetIds.join(",")}`}
              >
                View Data Sources
              </LinkWithStickyParams>
            </Button>
          </>
        );
      }}
    </WithVariables>
  );
}

export default CompareStatesForVariableReport;
