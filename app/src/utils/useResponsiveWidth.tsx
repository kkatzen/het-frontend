import { useState, useRef, useEffect } from "react";
import { RefObject } from "react";

export function useResponsiveWidth(): [
  RefObject<HTMLDivElement>,
  number | undefined
] {
  const [width, setWidth] = useState<number | undefined>();
  // Initial spec state is set in useEffect when default geo is set
  const ref = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (ref && ref.current) {
      setWidth(ref.current.offsetWidth);
    }

    const handleResize = () => {
      if (ref && ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return [ref, width];
}
