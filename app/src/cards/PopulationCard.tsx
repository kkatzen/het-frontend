import React, { useState } from "react";
import { Alert } from "@material-ui/lab";
import CardWrapper from "./CardWrapper";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, MetricId } from "../data/variableProviders";
import MetricQuery from "../data/MetricQuery";
import { Fips } from "../utils/madlib/Fips";
import { CardContent } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import styles from "./Card.module.scss";
import AnimateHeight from "react-animate-height";
import Button from "@material-ui/core/Button";
import StackedBarChart from "../charts/StackedBarChart";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

function PopulationCard(props: { fips: Fips }) {
  const datasetStore = useDatasetStore();
  const [expanded, setExpanded] = useState(false);

  const variableIds: MetricId[] = ["population", "population_pct"];
  const query = new MetricQuery(
    variableIds,
    Breakdowns.forFips(props.fips).andRace()
  );

  return (
    <CardWrapper
      queries={[query]}
      datasetIds={getDependentDatasets(variableIds)}
      hideFooter={true}
    >
      {() => {
        const dataset = datasetStore.getMetrics(query);
        const totalPopulation = dataset.find(
          (r) => r.race_and_ethnicity === "Total"
        );
        const totalPopulationSize = totalPopulation
          ? totalPopulation["population"].toLocaleString("en")
          : "Data retrieval error";

        return (
          <CardContent>
            <Button
              aria-label="expand description"
              onClick={() => setExpanded(!expanded)}
              color="primary"
              className={styles.ExpandPopulationCardButton}
            >
              {expanded ? "Collapse full profile" : "See full profile"}
              {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
            </Button>
            <span className={styles.PopulationCardTitle}>
              {props.fips.getFullDisplayName()}
            </span>
            {dataset.length < 1 && (
              <Alert severity="warning">
                Missing data means that we don't know the full story.
              </Alert>
            )}
            {dataset.length > 0 && (
              <>
                <Grid
                  container
                  className={styles.PopulationCard}
                  justify="space-around"
                >
                  <Grid item>
                    <span>Total Population</span>
                    <span className={styles.TotalPopulationValue}>
                      {totalPopulationSize}
                    </span>
                  </Grid>
                  {/* TODO- calculate median age */}
                  <Grid item className={styles.PopulationMetric}>
                    <span>Median Age</span>
                    <span className={styles.PopulationMetricValue}>??</span>
                  </Grid>
                  {dataset
                    .filter((r) => r.race_and_ethnicity !== "Total")
                    .map((row) => (
                      <Grid item className={styles.PopulationMetric}>
                        <span>{row.race_and_ethnicity}</span>
                        <span className={styles.PopulationMetricValue}>
                          {row.population_pct}%
                        </span>
                      </Grid>
                    ))}
                </Grid>
                <AnimateHeight
                  duration={500}
                  height={expanded ? "auto" : 0}
                  onAnimationEnd={() =>
                    window.dispatchEvent(new Event("resize"))
                  }
                >
                  <Grid container>
                    <Grid item xs={6}>
                      <span className={styles.PopulationChartTitle}>
                        Population by race
                      </span>
                      <SimpleHorizontalBarChart
                        data={dataset.filter(
                          (r) => r.race_and_ethnicity !== "Total"
                        )}
                        measure="population_pct"
                        breakdownVar="race_and_ethnicity"
                        showLegend={false}
                        hideActions={true}
                      />
                      <StackedBarChart
                        data={dataset.filter(
                          (r) => r.race_and_ethnicity !== "Total"
                        )}
                        measure="population_pct"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <span className={styles.PopulationChartTitle}>
                        Population by age [coming soon]
                      </span>
                    </Grid>
                  </Grid>
                </AnimateHeight>
              </>
            )}
          </CardContent>
        );
      }}
    </CardWrapper>
  );
}

export default PopulationCard;
