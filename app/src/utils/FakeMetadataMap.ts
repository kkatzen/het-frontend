import { MetadataMap } from "./DatasetTypes";

const FakeMetadataMap: MetadataMap = {
  population_share: {
    id: "population_share",
    name: "Share of population",
    data_source_name: "American Community Survey 5-year estimates (2014-2018)",
    data_source_link:
      "https://www.census.gov/data/developers/data-sets/acs-5year.html",
    geographic_level: "State, County (split)",
    demographic_granularity:
      "Race/ethnicity, age, gender (joint/intersections)",
    update_frequency: "??",
    update_time: "March 2, 2020",
    description:
      "Description placeholder for Share of population. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id lectus urna. Vestibulum lobortis ac quam vel tincidunt. Quisque ex erat, efficitur nec sagittis vitae, dictum semper arcu. Vivamus metus felis, fringilla sit amet metus nec, feugiat suscipit nisl. Morbi posuere mi sit amet elit posuere, id gravida ligula facilisis. Aenean gravida a eros fringilla venenatis.",
    fields: [
      {
        data_type: "string",
        name: "fakefield1",
        description: "description",
        origin_dataset: "origin_dataset",
      },
    ],
  },
  covid_deaths: {
    id: "covid_deaths",
    name: "COVID-19 Deaths",
    data_source_name: "CDC Provisional Death Counts for COVID-19",
    data_source_link:
      "https://www.cdc.gov/nchs/covid19/covid-19-mortality-data-files.htm",
    geographic_level: "County",
    demographic_granularity: "Race/ethnicity",
    update_frequency: "Daily",
    update_time: "March 2, 2020",
    description:
      "Description placeholder for COVID-19 Deaths. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id lectus urna. Vestibulum lobortis ac quam vel tincidunt. Quisque ex erat, efficitur nec sagittis vitae, dictum semper arcu. Vivamus metus felis, fringilla sit amet metus nec, feugiat suscipit nisl. Morbi posuere mi sit amet elit posuere, id gravida ligula facilisis. Aenean gravida a eros fringilla venenatis.",
    fields: [
      {
        data_type: "string",
        name: "fakefield1",
        description: "description",
        origin_dataset: "origin_dataset",
      },
    ],
  },
  social_vulernability: {
    id: "social_vulernability",
    name: "Social Vulnerability Index",
    data_source_name: "CDC's Social Vulernability Index",
    data_source_link:
      "https://www.atsdr.cdc.gov/placeandhealth/svi/data_documentation_download.html",
    geographic_level: "State/County (split?)",
    demographic_granularity: "None",
    update_frequency: "Every 2 years",
    update_time: "March 2, 2020",
    description:
      "Description placeholder for Social Vulnerability Index. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id lectus urna. Vestibulum lobortis ac quam vel tincidunt. Quisque ex erat, efficitur nec sagittis vitae, dictum semper arcu. Vivamus metus felis, fringilla sit amet metus nec, feugiat suscipit nisl. Morbi posuere mi sit amet elit posuere, id gravida ligula facilisis. Aenean gravida a eros fringilla venenatis.",
    fields: [
      {
        data_type: "string",
        name: "fakefield1",
        description: "description",
        origin_dataset: "origin_dataset",
      },
    ],
  },
  diabetes: {
    id: "diabetes",
    name: "Diabetes Prevalence",
    data_source_name: "CDC's BrFSS",
    data_source_link: "https://gis.cdc.gov/grasp/diabetes/DiabetesAtlas.html#",
    geographic_level: "State, County",
    demographic_granularity:
      "race/ethnicity, age, gender (no intersections) gender @ county",
    update_frequency: "?",
    update_time: "?",
    description:
      "Description placeholder for Diabetes Prevalence. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id lectus urna. Vestibulum lobortis ac quam vel tincidunt. Quisque ex erat, efficitur nec sagittis vitae, dictum semper arcu. Vivamus metus felis, fringilla sit amet metus nec, feugiat suscipit nisl. Morbi posuere mi sit amet elit posuere, id gravida ligula facilisis. Aenean gravida a eros fringilla venenatis.",
    fields: [
      {
        data_type: "string",
        name: "fakefield1",
        description: "description",
        origin_dataset: "origin_dataset",
      },
    ],
  },
};

export default FakeMetadataMap;
