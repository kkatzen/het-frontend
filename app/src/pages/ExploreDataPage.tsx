import React from "react";
import ObservableTest from "../features/ObservableTest";
import VegaTest from "../features/VegaTest";

function ExploreDataPage() {
  return (
    <p>
      Research questions; explore key relationships across datasets, chosen by
      us; explore the data freely
      <h1>Observable Notebook Example</h1>
      <ObservableTest />
      <h1>Vega Example</h1>
      <VegaTest />
    </p>
  );
}

export default ExploreDataPage;
