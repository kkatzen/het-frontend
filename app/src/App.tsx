import React from "react";
import styles from "./App.module.scss";
import DataCatalogPage from "./pages/DataCatalogPage";
import ExploreDataPage from "./pages/ExploreDataPage";
import LandingPage from "./pages/LandingPage";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className={styles.App}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Button className={styles.NavButton}>
              <Link to="/">Home</Link>
            </Button>
            <Button className={styles.NavButton}>
              <Link to="/datacatalog">Data Catalog</Link>
            </Button>
            <Button className={styles.NavButton}>
              <Link to="/exploredata">Explore Data</Link>
            </Button>
          </Toolbar>
        </AppBar>
        {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/datacatalog" component={DataCatalogPage} />
          <Route path="/exploredata" component={ExploreDataPage} />
          <Route path="/" component={LandingPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
