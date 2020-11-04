import React from "react";
import styles from "./App.module.scss";
import MaterialTheme from "./styles/MaterialTheme";
import DataCatalogPage from "./pages/DataCatalogPage";
import ExploreDataPage from "./pages/ExploreDataPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./Footer";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  useDatasetStoreProvider,
  DatasetProvider,
  startMetadataLoad,
} from "./utils/useDatasetStore";
import { LinkWithStickyParams } from "./utils/urlutils";

startMetadataLoad();

function AppToolbar() {
  return (
    <Toolbar>
      <Typography variant="h6" className={styles.HomeLogo}>
        Health Equity Tracker
      </Typography>
      <Button className={styles.NavButton}>
        <LinkWithStickyParams to="/">Home</LinkWithStickyParams>
      </Button>
      <Button className={styles.NavButton}>
        <LinkWithStickyParams to="/datacatalog">
          Data Catalog
        </LinkWithStickyParams>
      </Button>
      <Button className={styles.NavButton}>
        <a href="https://satcherinstitute.github.io/data-visualization/02_covid19_death_disparities/">
          Explore the Data
        </a>
      </Button>
      <Button className={styles.NavButton}>
        <LinkWithStickyParams to="/exploredata">
          (Ignore me)
        </LinkWithStickyParams>
      </Button>
    </Toolbar>
  );
}

function App() {
  const datasetStore = useDatasetStoreProvider();
  return (
    <ThemeProvider theme={MaterialTheme}>
      <DatasetProvider value={datasetStore}>
        <div className={styles.App}>
          <div className={styles.Content}>
            <Router>
              <AppBar position="static">
                <AppToolbar />
              </AppBar>
              <Switch>
                <Route path="/datacatalog" component={DataCatalogPage} />
                <Route path="/exploredata" component={ExploreDataPage} />
                <Route exact path="/" component={LandingPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Router>
          </div>
          <Footer />
        </div>
      </DatasetProvider>
    </ThemeProvider>
  );
}

export default App;
