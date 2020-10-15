import React from "react";
import styles from "./App.module.scss";
import DatasetExplorer from "./DatasetExplorer";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  return (
    <>
      <CssBaseline />
      <div className={styles.App}>
        <header className={styles["App-header"]}>
          <h1>Health Equity Tracker Frontend</h1>
        </header>
        <DatasetExplorer />
      </div>
    </>
  );
}

export default App;
