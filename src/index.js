import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

import "./index.css";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0d47a1"
    },
    secondary: {
      main: "#b71c1c"
    }
  }
});

dayjs.extend(weekOfYear);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
