//@ts-nocheck
// Overriding ts check because it complains about MuiToggleButton
import { createMuiTheme } from "@material-ui/core/styles";

const MaterialTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#6a97bb",
      main: "#07538f",
      dark: "#054272",
    },
    secondary: {
      light: "#89D5CC",
      main: "#228B7E",
      dark: "#167B6F",
    },
  },
  overrides: {
    // TODO - Figure out how best to add ToggleButtonGroup style overrides
    MuiButton: {
      root: {
        textTransform: "unset",
      },
    },
    MuiPaper: {
      root: {
        "&.MuiPopover-paper": {
          maxWidth: "unset",
          minWidth: "unset",
        },
      },
    },
    MuiToggleButton: {
      root: {
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "16px",
        background: "white",
        border: "1px solid #BDC1C6 !important",
        color: "black",
        textTransform: "none",
        "&$selected": {
          backgroundColor: "#E8F0FE",
          color: "#1A73E8",
        },
      },
    },
  },
});

export default MaterialTheme;
