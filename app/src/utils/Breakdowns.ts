export type GeographicBreakdown = "national" | "state" | "county";

// TODO is the race vs race_nonstandard distinction necessary, or should we just
// expect each provider to know what type it uses?
export type DemographicBreakdown =
  | "race"
  | "race_nonstandard"
  | "age"
  | "gender";

export class Breakdowns {
  geography: GeographicBreakdown;
  // Note: this assumes only one demographic breakdown at a time. If we want to
  // support more later we can refactor this to multiple boolean fields.
  demographic?: DemographicBreakdown;
  // We may want to extend this to an explicit type to support variants for
  // day/week/month/year.
  time?: boolean;

  constructor(
    geography: GeographicBreakdown,
    demographic?: DemographicBreakdown,
    time?: boolean
  ) {
    this.geography = geography;
    this.demographic = demographic;
    this.time = time;
  }

  getUniqueKey() {
    return `geography: ${this.geography}, demographic: ${this.demographic}, time: ${this.time}`;
  }

  static national(): Breakdowns {
    return new Breakdowns("national");
  }

  static byState(): Breakdowns {
    return new Breakdowns("state");
  }

  static byCounty(): Breakdowns {
    return new Breakdowns("county");
  }

  andDemographic(demographic: DemographicBreakdown): Breakdowns {
    if (this.demographic) {
      throw new Error("Multiple demographic breakdowns not supported");
    }
    this.demographic = demographic;
    return this;
  }

  andRace(nonstandard = false): Breakdowns {
    return nonstandard
      ? this.andDemographic("race_nonstandard")
      : this.andDemographic("race");
  }

  andAge(): Breakdowns {
    return this.andDemographic("age");
  }

  andGender(): Breakdowns {
    return this.andDemographic("gender");
  }

  andTime(): Breakdowns {
    this.time = true;
    return this;
  }
}
