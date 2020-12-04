import { USA_FIPS, STATE_FIPS_MAP } from "./Fips";
import { VariableId } from "./variableProviders";

// Map of phrase segment index to its selected value
export type PhraseSelections = Record<number, string>;

// Map of phrase selection ID to the display value
export type PhraseSelector = Record<string, string>;

// Each phrase segment of the mad lib is either a string of text
// or a map of IDs to string options that can fill in a blank
export type PhraseSegment = string | PhraseSelector;

export type MadLibId =
  | "dump"
  | "disvargeo"
  | "varcompare"
  | "geo"
  | "vargeo"
  | "disvarcompare";
export interface MadLib {
  readonly id: MadLibId;
  readonly phrase: PhraseSegment[];
  readonly defaultSelections: PhraseSelections;
  readonly activeSelections: PhraseSelections;
}

function getMadLibPhraseText(madLib: MadLib): string {
  let madLibText = "";
  madLib.phrase.forEach((phraseSegment, index) => {
    if (typeof phraseSegment === "string") {
      madLibText += phraseSegment;
    } else {
      const phraseSelector = phraseSegment as PhraseSelector;
      let selectionKey: string = madLib.activeSelections[index]
        ? madLib.activeSelections[index]
        : madLib.defaultSelections[index];
      madLibText += " " + phraseSelector[selectionKey] + " ";
    }
  });
  return madLibText;
}

export type DropdownVarId =
  | "covid"
  | "diabetes"
  | "obesity"
  | "asthma"
  | "copd"
  | "insurance";

// TODO- investigate type check error to see if we can remove
// @ts-ignore
const DROPDOWN_VAR: Record<DropdownVarId, string> = {
  covid: "COVID-19",
  diabetes: "diabetes",
  obesity: "obesity",
  asthma: "asthma",
  copd: "copd",
};

// TODO- investigate type check error to see if we can remove
// @ts-ignore
const DISPARITY_DROPDOWN_VAR: Record<DropdownVarId, string> = {
  covid: "COVID-19",
  diabetes: "diabetes",
  obesity: "obesity",
  asthma: "asthma",
  copd: "copd",
  insurance: "insurance type",
};

// TODO- investigate type check error to see if we can remove
// @ts-ignore
const COVID_VARIABLES: Record<VariableId, string> = {
  covid_cases: "COVID Cases",
  covid_deaths: "COVID Deaths",
  covid_hosp: "COVID Hospitalizations",
  covid_cases_pct_of_geo: "COVID Cases % of Geo",
  covid_deaths_pct_of_geo: "COVID Deaths % of Geo",
  covid_hosp_pct_of_geo: "COVID Hospitalizations % of Geo",
  covid_deaths_per_100k: "COVID Deaths per 100k",
  covid_cases_per_100k: "COVID Cases per 100k",
  covid_hosp_per_100k: "COVID Hospitalizations per 100k",
};
console.log(COVID_VARIABLES);

// TODO- investigate type check error to see if we can remove
// @ts-ignore
const DIABETES_VARIABLES: Record<VariableId, string> = {
  diabetes_count: "Diabetes Count",
  diabetes_per_100k: "Diabetes per 100k",
};
console.log(DIABETES_VARIABLES);

const MADLIB_LIST: MadLib[] = [
  {
    id: "disvargeo",
    phrase: [
      "Tell me about disparities for",
      DISPARITY_DROPDOWN_VAR,
      "in",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: "covid", 3: USA_FIPS },
    activeSelections: { 1: "covid", 3: USA_FIPS },
  },
  {
    id: "varcompare",
    phrase: [
      "Compare ",
      DROPDOWN_VAR,
      " between ",
      STATE_FIPS_MAP,
      " and ",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: "diabetes", 3: "13", 5: USA_FIPS }, // 13 is Georgia
    activeSelections: { 1: "diabetes", 3: "13", 5: USA_FIPS },
  },
  {
    id: "geo",
    phrase: ["Tell me about", STATE_FIPS_MAP],
    defaultSelections: { 1: USA_FIPS },
    activeSelections: { 1: USA_FIPS },
  },
  {
    id: "vargeo",
    phrase: ["Show me what", DROPDOWN_VAR, "looks like in", STATE_FIPS_MAP],
    defaultSelections: { 1: "diabetes", 3: USA_FIPS },
    activeSelections: { 1: "diabetes", 3: USA_FIPS },
  },

  {
    id: "disvarcompare",
    phrase: [
      "Compare disparities",
      DISPARITY_DROPDOWN_VAR,
      " between ",
      STATE_FIPS_MAP,
      " and ",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: "covid", 3: "13", 5: USA_FIPS }, // 13 is Georgia
    activeSelections: { 1: "covid", 3: "13", 5: USA_FIPS }, // 13 is Georgia
  },
  {
    id: "dump",
    phrase: ["Show me ALL THE CHARTS!!!!"],
    defaultSelections: {},
    activeSelections: {},
  },
];

export { MADLIB_LIST, getMadLibPhraseText };
