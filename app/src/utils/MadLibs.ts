import STATE_FIPS_MAP from "./Fips";

// Map of phrase segment index to its selected value
export type PhraseSelections = Record<number, number>;

// Each phrase segment of the mad lib is either a string of text
// or a map of IDs to string options that can fill in a blank
export type PhraseSegment = string | Record<number, string>;

export interface MadLib {
  readonly phrase: PhraseSegment[];
  readonly defaultSelections: PhraseSelections;
}

const MADLIB_LIST: MadLib[] = [
  {
    phrase: [
      "Where are the",
      { 0: "highest", 1: "lowest" },
      "rates of",
      { 0: "unemployment" },
      "in",
      STATE_FIPS_MAP,
      "?",
    ],
    defaultSelections: { 1: 0, 3: 0, 5: 0 },
  },
  {
    phrase: ["Tell me about", { 0: "COPD", 1: "diabetes" }, "in the USA."],
    defaultSelections: { 1: 0 },
  },
  {
    phrase: [
      "Compare",
      { 0: "diabetes_per_100k" },
      " in ",
      STATE_FIPS_MAP,
      " compared to ",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: 0, 3: 13, 5: 0 },
  },
];

export { MADLIB_LIST };
