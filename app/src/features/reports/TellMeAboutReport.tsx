import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import TableChart from "../charts/TableChart";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styles from "./Report.module.scss";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { ALL_RACES_DISPLAY_NAME } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";

interface County {
  id: string;
  name: string;
  value: number;
}

function CountyLevelTable(countyList: County[], valueName: string) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{valueName}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countyList.map((county: County) => (
            <TableRow key={county.name}>
              <TableCell>{county.name}</TableCell>
              <TableCell>{county.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TellMeAboutReport(props: { variable: VariableId }) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

  const [countyList, setCountyList] = useState<County[]>([]);
  const [race, setRace] = useState<string>(ALL_RACES_DISPLAY_NAME);

  useEffect(() => {
    setCountyList([]);
    setRace(ALL_RACES_DISPLAY_NAME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.variable]);

  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      let countyIds = countyList.map((datum: County) => datum.id);
      if (!countyIds.includes(args[1].id)) {
        let newCountyDatum = {
          id: clickedData.id,
          name: clickedData.properties.name,
          value: clickedData[props.variable],
        };
        setCountyList([...countyList, newCountyDatum]);
      }
    },
    shiftClick: () => {
      setCountyList([]);
    },
  };

  // TODO - Legends should be scaled exactly the same the across compared charts. Looks misleading otherwise.
  const RACES = [
    ALL_RACES_DISPLAY_NAME,
    "American Indian/Alaskan Native, Non-Hispanic",
    "Asian, Non-Hispanic",
    "Black, Non-Hispanic",
    "Hispanic",
    "Other race, Non-Hispanic",
    "White, Non-Hispanic",
  ];

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        const breakdowns =
          race === ALL_RACES_DISPLAY_NAME
            ? Breakdowns.byState()
            : Breakdowns.byState().andRace();
        let dataset = variableProvider
          .getData(datasetStore.datasets, breakdowns)
          .filter((r) => r.race === race);

        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6}>
              <Alert severity="error">
                TODO: Have a constant legend, as changing legend is misleading
              </Alert>
              Filter results by race:
              <FormControl>
                <Select
                  name="raceSelect"
                  value={race}
                  onChange={(e) => {
                    setRace(e.target.value as string);
                    setCountyList([]);
                  }}
                >
                  {RACES.map((race) => (
                    <MenuItem key={race} value={race}>
                      {race}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <UsaChloroplethMap
                signalListeners={signalListeners}
                varField={props.variable}
                legendTitle={variableProvider.variableName}
                data={dataset}
              />
              <p>
                Click on some states to see data in this table, shift click on
                map to reset.
              </p>
              {CountyLevelTable(countyList, variableProvider.variableName)}
            </Grid>
            <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
              <TableChart
                data={dataset}
                columns={["state_name", variableProvider.variableName]}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default TellMeAboutReport;
