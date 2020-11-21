//@ts-nocheck

import React from "react";
import { Grid } from "@material-ui/core";
import LineChart from "../charts/LineChart";

function TimeReport() {
  const raceList = [
    "hispanic",
    "non_hispanic_native_hawaiian_or_other_pacific_islander",
    "non_hispanic_american_indian_or_alaska_native",
    "non_hispanic_asian",
    "non_hispanic_white",
    "non_hispanic_black",
  ];

  // This data is totally made up
  let sampleCovid = [
    {
      footnote: null,
      hispanic: "0.041",
      non_hispanic_asian: "0.009",
      non_hispanic_black: "0.41",
      urban_rural_description: "Small metro",
      non_hispanic_white: "0.116",
      end_week: "2020-11-07",
      total_deaths: "1246",
      other: "0.019",
      fips_county: "15",
      fips_code: "1015",
      non_hispanic_american_indian_or_alaska_native: "0.004",
      fips_state: "1",
      indicator: "Distribution of population (%)",
      state: "AL",
      urban_rural_code: "4",
      ingestion_time: "2020-11-12 20:31:23.083780 UTC",
      county_name: "Calhoun County",
      non_hispanic_native_hawaiian_or_other_pacific_islander: "0.1",
      covid_19_deaths: "109",
      start_week: "2020-02-01",
      data_as_of: "2020-11-12",
    },
    {
      footnote: null,
      hispanic: "0.161",
      non_hispanic_asian: "0.015",
      non_hispanic_black: "0.31",
      urban_rural_description: "Small metro",
      non_hispanic_white: "0.716",
      end_week: "2020-11-07",
      total_deaths: "1446",
      other: "0.019",
      fips_county: "15",
      fips_code: "1015",
      non_hispanic_american_indian_or_alaska_native: "0.004",
      fips_state: "1",
      indicator: "Distribution of population (%)",
      state: "AL",
      urban_rural_code: "4",
      ingestion_time: "2020-11-12 20:31:23.083780 UTC",
      county_name: "Calhoun County",
      non_hispanic_native_hawaiian_or_other_pacific_islander: "0.1",
      covid_19_deaths: "109",
      start_week: "2020-02-08",
      data_as_of: "2020-11-12",
    },
    {
      footnote: null,
      hispanic: "0.091",
      non_hispanic_asian: "0.32",
      non_hispanic_black: "0.31",
      urban_rural_description: "Small metro",
      non_hispanic_white: "0.316",
      end_week: "2020-11-07",
      total_deaths: "1646",
      other: "0.019",
      fips_county: "15",
      fips_code: "1015",
      non_hispanic_american_indian_or_alaska_native: "0.004",
      fips_state: "1",
      indicator: "Distribution of population (%)",
      state: "AL",
      urban_rural_code: "4",
      ingestion_time: "2020-11-12 20:31:23.083780 UTC",
      county_name: "Calhoun County",
      non_hispanic_native_hawaiian_or_other_pacific_islander: "0.1",
      covid_19_deaths: "109",
      start_week: "2020-02-15",
      data_as_of: "2020-11-12",
    },
  ];

  let newValues: any = [];

  sampleCovid.forEach((item) => {
    raceList.forEach((race: string) => {
      newValues.push({
        start_week: item.start_week,
        race: race,
        rate: item[race],
      });
    });
  });

  const data = { values: newValues };

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12}>
        <LineChart
          data={data}
          breakdownVar="race"
          variable="rate"
          timeVariable="start_week"
          breakdownValues={raceList}
        />
      </Grid>
    </Grid>
  );
}

export default TimeReport;
