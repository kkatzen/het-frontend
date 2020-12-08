// TODO maybe rename this file since this string is out of place
export const ALL_RACES_DISPLAY_NAME = "All races";
export const USA_DISPLAY_NAME = "United States";
// Fake FIPS code used to represent totals in USA for convenience
export const USA_FIPS = "00";

export const STATE_FIPS_MAP: Record<string, string> = {
  [USA_FIPS]: USA_DISPLAY_NAME,
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massachusetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraksa",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennesse",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virigina",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming",
};
/*
    "60": "American Samoa",
    "66": "Guam",
    "69": "Northern Mariana Islands",
    "72": "Puerto Rico",
    "78": "Virgin Islands"
*/

class Fips {
  code: string;
  countyName: string;

  // TODO- revisit optional name, this is brittle
  constructor(code: string, countyName: string = "") {
    if (!RegExp("^[0-9]{2}|[0-9]{5}").test(code)) {
      throw new Error("Invalid FIPS code");
    }
    this.code = code;
    this.countyName = countyName;
  }

  isUsa() {
    return this.code === USA_FIPS;
  }

  isState() {
    return !this.isCounty() && !this.isUsa();
  }

  isCounty() {
    return this.code.length === 5;
  }

  getDisplayName() {
    return this.isCounty()
      ? `${this.countyName}, ${this.getStateDisplayName()}`
      : STATE_FIPS_MAP[this.code];
  }

  setCountyName(countyName: string) {
    this.countyName = countyName;
  }

  getStateFipsCode() {
    return this.code.substring(0, 2);
  }

  getStateDisplayName() {
    return STATE_FIPS_MAP[this.getStateFipsCode()];
  }

  getParentFips() {
    return this.isCounty()
      ? new Fips(this.code.substring(0, 2))
      : new Fips(USA_FIPS);
  }
}

export { Fips };
