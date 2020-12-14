import { VariableId } from "../data/variableProviders";

/* TODO: These are not yet comprehensive, final interfaces */
export type MetricType =
  | "count"
  | "pct_share"
  | "pct_share_to_pop_ratio"
  | "per100k"
  | "percentile"
  | "index";

export type MetricConfig = {
  metricId: VariableId;
  fullCardTitleName: string;
  shortVegaLabel: string;
  type: MetricType;
};

export type VariableConfig = {
  variableId: string;
  metrics: MetricConfig[];
};

export const METRIC_CONFIG: Record<string, VariableConfig[]> = {
  covid: [
    {
      variableId: "cases",
      metrics: [
        {
          metricId: "covid_cases",
          fullCardTitleName: "COVID-19 cases",
          shortVegaLabel: "cases",
          type: "count",
        },
        {
          metricId: "covid_cases_pct_of_geo",
          fullCardTitleName: "Share of COVID-19 cases",
          shortVegaLabel: "% of cases",
          type: "pct_share",
        },
        {
          metricId: "covid_cases_per_100k",
          fullCardTitleName: "COVID-19 cases per 100,000 people",
          shortVegaLabel: "cases per 100k",
          type: "per100k",
        },
      ],
    },
    {
      variableId: "deaths",
      metrics: [
        {
          metricId: "covid_deaths",
          fullCardTitleName: "COVID-19 deaths",
          shortVegaLabel: "deaths",
          type: "count",
        },
        {
          metricId: "covid_deaths_pct_of_geo",
          fullCardTitleName: "Share of COVID-19 deaths",
          shortVegaLabel: "% of deaths",
          type: "pct_share",
        },
        {
          metricId: "covid_deaths_per_100k",
          fullCardTitleName: "COVID-19 deaths per 100,000 people",
          shortVegaLabel: "deaths per 100k",
          type: "per100k",
        },
      ],
    },
    {
      variableId: "hospitalizations",
      metrics: [
        {
          metricId: "covid_hosp",
          fullCardTitleName: "COVID-19 hospitalizations",
          shortVegaLabel: "hospitalizations",
          type: "count",
        },
        {
          metricId: "covid_hosp_pct_of_geo",
          fullCardTitleName: "Share of COVID-19 hospitalizations",
          shortVegaLabel: "% of hospitalizations",
          type: "pct_share",
        },
        {
          metricId: "covid_hosp_per_100k",
          fullCardTitleName: "COVID-19 hospitalizations per 100,000 people",
          shortVegaLabel: "hospitalizations per 100k",
          type: "per100k",
        },
      ],
    },
  ],
  diabetes: [
    {
      variableId: "cases",
      metrics: [
        {
          metricId: "diabetes_count",
          fullCardTitleName: "Count of diabetes cases",
          shortVegaLabel: "cases",
          type: "count",
        },
        {
          metricId: "diabetes_per_100k",
          fullCardTitleName: "Diabetes cases per 100,000 people",
          shortVegaLabel: "cases per 100k",
          type: "per100k",
        },
      ],
    },
  ],
};
