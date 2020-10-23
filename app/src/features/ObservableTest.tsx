import React, { useEffect } from "react";
import notebook from "@kristak/kristas-worksheet";
import { Runtime, Inspector } from "@observablehq/runtime";

function ObservableTest() {
  let barchartRef = React.createRef<HTMLDivElement>();
  let scrollRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name: string) => {
      if (name === "viewof barchart") {
        return new Inspector(barchartRef.current);
      }
      if (name === "viewof scroll") {
        return new Inspector(scrollRef.current);
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <div ref={barchartRef} />
      <div ref={scrollRef} />
    </React.Fragment>
  );
}

export default ObservableTest;
