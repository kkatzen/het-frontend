import { USA_FIPS, STATE_FIPS_MAP, FIPS_MAP } from "./Fips";

// Map of phrase segment index to its selected value
export type PhraseSelections = Record<number, string>;

// Map of phrase selection ID to the display value
export type PhraseSelector = Record<string, string>;

// Each phrase segment of the mad lib is either a string of text
// or a map of IDs to string options that can fill in a blank

export type PhraseSegment = string | PhraseSelector;

export type MadLibId =
  | "geo"
  | "vargeo"
  | "varcompare"
  | "disvargeo"
  | "disvarcompare"
  | "dump";

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
  covid: "[coming soon] COVID-19",
  diabetes: "diabetes",
  obesity: "[coming soon] obesity",
  asthma: "[coming soon] asthma",
  copd: "[coming soon] copd",
};

// TODO- investigate type check error to see if we can remove
// @ts-ignore
const DISPARITY_DROPDOWN_VAR: Record<DropdownVarId, string> = {
  covid: "COVID-19",
  diabetes: "[coming soon] diabetes",
  obesity: "[coming soon] obesity",
  asthma: "[coming soon] asthma",
  copd: "[coming soon] copd",
  insurance: "[coming soon] insurance type",
};

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
      FIPS_MAP,
      " and ",
      FIPS_MAP,
    ],
    defaultSelections: { 1: "diabetes", 3: "13", 5: USA_FIPS }, // 13 is Georgia
    activeSelections: { 1: "diabetes", 3: "13", 5: USA_FIPS }, // 13 is Georgia
  },
  {
    id: "geo",
    phrase: ["Tell me about", FIPS_MAP],
    defaultSelections: { 1: USA_FIPS },
    activeSelections: { 1: USA_FIPS },
  },
  {
    id: "vargeo",
    phrase: ["Show me what", DROPDOWN_VAR, "looks like in", FIPS_MAP],
    defaultSelections: { 1: "diabetes", 3: USA_FIPS },
    activeSelections: { 1: "diabetes", 3: USA_FIPS },
  },
  {
    id: "disvarcompare",
    phrase: [
      "Compare ",
      DISPARITY_DROPDOWN_VAR,
      " disparities between ",
      STATE_FIPS_MAP,
      " and ",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: "covid", 3: "13", 5: USA_FIPS }, // 13 is Georgia
    activeSelections: { 1: "covid", 3: "13", 5: USA_FIPS }, // 13 is Georgia
  },
  {
    id: "dump",
    phrase: ["Show me additional chart options"],
    defaultSelections: {},
    activeSelections: {},
  },
];

export { MADLIB_LIST, getMadLibPhraseText };
