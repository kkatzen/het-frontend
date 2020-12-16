import { VariableId } from "../../data/variableProviders";

export const VARIABLE_DISPLAY_NAMES: Record<VariableId, string> = {
  diabetes_count: "Diabetes case count",
  diabetes_per_100k: "Diabetes cases per 100,000 people",
  copd_count: "COPD case count",
  copd_per_100k: "COPD cases per 100,000 people",
  population: "Population Size",
  population_pct: "% of total population",
  covid_cases: "COVID-19 cases",
  covid_deaths: "COVID-19 deaths",
  covid_hosp: "COVID-19 hospitalizations",
  covid_cases_pct_of_geo: "% of total COVID-19 cases",
  covid_deaths_pct_of_geo: "% of total COVID-19 deaths",
  covid_hosp_pct_of_geo: "% of total COVID-19 hospitalizations",
  covid_deaths_per_100k: "COVID-19 deaths per 100,000 people",
  covid_cases_per_100k: "COVID-19 cases per 100,000 people",
  covid_hosp_per_100k: "COVID-19 hospitalizations per 100,000 people",
};

export type BreakdownVar = "race_and_ethnicity" | "age" | "sex";

export const BREAKDOWN_VAR_DISPLAY_NAMES: Record<BreakdownVar, string> = {
  race_and_ethnicity: "Race and Ethnicity",
  age: "age",
  sex: "sex",
};

// Prints a formatted version of a field value based on the type specified by the field name
export function formatFieldValue(nameOfField: string, value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  const formattedValue =
    typeof value === "number" ? value.toLocaleString("en") : value;
  const suffix =
    nameOfField.endsWith("_pct") || nameOfField.endsWith("_pct_of_geo")
      ? "%"
      : "";
  return `${formattedValue}${suffix}`;
}

export function getFieldDisplayName(field: string) {
  if (Object.keys(BREAKDOWN_VAR_DISPLAY_NAMES).includes(field)) {
    return BREAKDOWN_VAR_DISPLAY_NAMES[field as BreakdownVar];
  } else if (Object.keys(VARIABLE_DISPLAY_NAMES).includes(field)) {
    return VARIABLE_DISPLAY_NAMES[field as VariableId];
  }
  return field;
}
