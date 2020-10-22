import { MetadataMap } from "./DatasetTypes";

const FakeMetadataMap: MetadataMap = {
  state_names: {
    id: "state_names",
    name: "State Names",
    data_source: "Census",
    description: "List of states and their FIPS codes.",
    geographic_level: "State",
    demographic_granularity: "N/A",
    category: "SDOH",
    update_time: "March 2, 2020",
    fields: [],
  },
  county_names: {
    id: "county_names",
    name: "County Names",
    data_source: "Census",
    description: "List of counties and their FIPS codes.",
    geographic_level: "County, State",
    demographic_granularity: "N/A",
    category: "SDOH",
    update_time: "September 23, 2020",
    fields: [],
  },
};

export default FakeMetadataMap;
