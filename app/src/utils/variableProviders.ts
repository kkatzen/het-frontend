import AcsPopulationProvider from "./variables/AcsPopulationProvider";
import VariableProvider from "./variables/VariableProvider";
import CovidProvider from "./variables/CovidProvider";
import CopdProvider from "./variables/CopdProvider";
import DiabetesProvider from "./variables/DiabetesProvider";

// TODO consider making this an enum instead of a type literal, since these will
// be used throughout the code base and an enum provides a little more explicit
// clarity.
export type VariableId =
  | "diabetes_count"
  | "diabetes_per_100k"
  | "copd_count"
  | "population"
  | "population_pct"
  | "covid_cases"
  | "covid_deaths"
  | "covid_hosp"
  | "covid_cases_pct_of_geo"
  | "covid_deaths_pct_of_geo"
  | "covid_hosp_pct_of_geo"
  | "covid_deaths_per_100k"
  | "covid_cases_per_100k"
  | "covid_hosp_per_100k";

export const VARIABLE_DISPLAY_NAMES: Record<VariableId, string> = {
  diabetes_count: "Diabetes case count",
  diabetes_per_100k: "Diabetes cases per 100,000 people",
  copd_count: "COPD case count",
  population: "Population Size",
  population_pct: "Population Share",
  covid_cases: "COVID-19 cases",
  covid_deaths: "COVID-19 deaths",
  covid_hosp: "COVID-19 hospitalizations",
  covid_cases_pct_of_geo: "Share of COVID-19 cases",
  covid_deaths_pct_of_geo: "Share of COVID-19 deaths",
  covid_hosp_pct_of_geo: "Share of COVID-19 hospitalizations",
  covid_deaths_per_100k: "COVID-19 deaths per 100,000 people",
  covid_cases_per_100k: "COVID-19 cases per 100,000 people",
  covid_hosp_per_100k: "COVID-19 hospitalizations per 100,000 people",
};

export type BreakdownVar = "race_and_ethnicity" | "age" | "gender";

export const BREAKDOWN_VAR_DISPLAY_NAMES: Record<BreakdownVar, string> = {
  race_and_ethnicity: "Race and Ethnicity",
  age: "age",
  gender: "gender",
};

const acsProvider = new AcsPopulationProvider(
  "population",
  "Population",
  "Population"
);

// TODO I think this needs restructuring, so that one provider can provide
// multiple variables, each with their own ids and descriptions. This allows
// variables that naturally come together like "population" and "population_pct"
// to be provided by the same getData() call.
const providers: VariableProvider[] = [
  new CovidProvider(
    "covid_cases",
    "Confirmed Covid19 Cases",
    "Number of people who have been diagnosed with Covid19",
    acsProvider
  ),
  new CovidProvider(
    "covid_deaths",
    "Confirmed Covid19 Deaths",
    "Number of people who have died of Covid19",
    acsProvider
  ),
  new CovidProvider(
    "covid_hosp",
    "Confirmed Covid19 Hospitalizations",
    "Number of people who have been hospitalized by Covid19",
    acsProvider
  ),
  new CovidProvider(
    "covid_cases_per_100k",
    "Confirmed Covid19 Cases per 100k people",
    "Number of people who have been diagnosed with Covid19 per 100k population",
    acsProvider
  ),
  new CovidProvider(
    "covid_deaths_per_100k",
    "Confirmed Covid19 deaths per 100k people",
    "Number of people who have died of Covid19 per 100k population",
    acsProvider
  ),
  new CovidProvider(
    "covid_hosp_per_100k",
    "Confirmed Covid19 Hospitalizations per 100k people",
    "Number of people who have been hospitalized by Covid19 per 100k population",
    acsProvider
  ),
  new CovidProvider(
    "covid_cases_pct_of_geo",
    "Percent of total cases",
    "Percentage of cases for a particular region that came from the specified demographic",
    acsProvider
  ),
  new CovidProvider(
    "covid_deaths_pct_of_geo",
    "Percent of total deaths",
    "Percentage of deaths for a particular region that came from the specified demographic",
    acsProvider
  ),
  new CovidProvider(
    "covid_hosp_pct_of_geo",
    "Percent of total hospitalizations",
    "Percentage of hospitalizations for a particular region that came from the specified demographic",
    acsProvider
  ),
  new DiabetesProvider(
    "diabetes_count",
    "Diabetes Count",
    "Number of people with diabetes"
  ),
  new DiabetesProvider(
    "diabetes_per_100k",
    "Diabetes Per 100k",
    "Number of people with diabetes per 100k population"
  ),
  new CopdProvider("copd_count", "COPD Count", "Number of people with COPD"),
  new AcsPopulationProvider(
    "population_pct",
    "Population Percent",
    "Percentage of population"
  ),
  acsProvider,
];

// TODO I don't know why Typescript is complaining that it's missing properties.
// It seems to expect all possible values for VariableId to be present.
const variableProviders: Record<
  VariableId,
  VariableProvider
> = Object.fromEntries(providers.map((p) => [p.variableId, p])) as Record<
  VariableId,
  VariableProvider
>;

export default variableProviders;
