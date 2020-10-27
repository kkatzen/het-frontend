import React from "react";
import { Link, useLocation } from "react-router-dom";

export const STICKY_VERSION_PARAM = "sv";

export function LinkWithStickyParams(props: {
  to: string;
  children: React.ReactNode;
}) {
  let params = useSearchParams();
  let newUrl = props.to;
  if (params[STICKY_VERSION_PARAM]) {
    // Note: doesn't handle urls that already have params on them.
    newUrl =
      newUrl + `?${STICKY_VERSION_PARAM}=${params[STICKY_VERSION_PARAM]}`;
  }
  return <Link to={newUrl}>{props.children}</Link>;
}

export function useSearchParams() {
  // Note: URLSearchParams doesn't support IE, if we keep this code and we want
  // to support IE we'll need to change it.
  const params = new URLSearchParams(useLocation().search);
  return Object.fromEntries(params.entries());
}
