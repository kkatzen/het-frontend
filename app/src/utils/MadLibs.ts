import STATE_FIPS_MAP from "./Fips";
import { MadLib } from "./DatasetTypes";

const MADLIB_LIST: MadLib[] = [
  {
    id: "1",
    phrase: [
      "Where are the",
      { 0: "highest", 1: "lowest" },
      "rates of",
      { 0: "obesity", 1: "diabetes" },
      "in",
      STATE_FIPS_MAP,
      "?",
    ],
  },
  {
    id: "2",
    phrase: [
      "Compare",
      {
        0: "the number of covid deaths",
        1: "the number of covid hospitalizations",
      },
      " to ",
      { 0: "obesity", 1: "diabetes" },
      " in ",
      STATE_FIPS_MAP,
      ".",
    ],
  },
  {
    id: "3",
    phrase: [
      "Which",
      { 0: "states", 1: "counties" },
      " are missing data for ",
      { 0: "obesity", 1: "diabetes" },
      "?",
    ],
  },
  {
    id: "4",
    phrase: ["Tell me about", STATE_FIPS_MAP, "."],
  },
];

export default MADLIB_LIST;
