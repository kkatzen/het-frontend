import STATE_FIPS_MAP from "./Fips";

import { DIABETES_COUNT_ID, DIABETES_PER_100K_ID } from "./variableProviders";

// Map of phrase segment index to its selected value
export type PhraseSelections = Record<number, number>;

// Each phrase segment of the mad lib is either a string of text
// or a map of IDs to string options that can fill in a blank
export type PhraseSegment = string | Record<number, string>;

export interface MadLib {
  readonly index: number;
  readonly phrase: PhraseSegment[];
  readonly defaultSelections: PhraseSelections;
  readonly activeSelections: PhraseSelections;
}

function getMadLibPhraseText(madLib: MadLib): string {
  let madLibText = "";
  madLib.phrase.forEach((phraseSegment, index) => {
    if (phraseSegment.constructor === Object) {
      let selection = madLib.activeSelections[index]
        ? madLib.activeSelections[index]
        : madLib.defaultSelections[index];
      madLibText += " " + phraseSegment[selection] + " ";
    } else {
      madLibText += phraseSegment;
    }
  });
  return madLibText;
}

// TODO - refactor in a MAP?
const MADLIB_LIST: MadLib[] = [
  {
    index: 0,
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
    activeSelections: { 1: 0, 3: 0, 5: 0 },
  },
  {
    index: 1,
    phrase: [
      "Tell me about",
      { 0: DIABETES_COUNT_ID, 1: DIABETES_PER_100K_ID },
      "in the USA.",
    ],
    defaultSelections: { 1: 0 },
    activeSelections: { 1: 0 },
  },
  {
    index: 2,
    phrase: [
      "Compare",
      { 0: DIABETES_PER_100K_ID },
      " in ",
      STATE_FIPS_MAP,
      " compared to ",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: 0, 3: 13, 5: 0 },
    activeSelections: { 1: 0, 3: 13, 5: 0 },
  },
  {
    index: 3,
    phrase: ["Show me ALL THE CHARTS!!!!"],
    defaultSelections: { 0: 0 },
    activeSelections: { 0: 0 },
  },
];

export { MADLIB_LIST, getMadLibPhraseText };
