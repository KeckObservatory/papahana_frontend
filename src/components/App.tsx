import React from 'react';
import { makeStyles } from "@mui/styles"
import './App.css';
import OBTView from './OBT/observation_data_tool_view'
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightBlue, deepOrange, deepPurple } from '@mui/material/colors';
import { BooleanParam, StringParam, useQueryParam, withDefault } from 'use-query-params'
import { ThemeKeys } from 'react-json-view'
import { TopBar } from './top_bar' 
import { ModuleMenu } from './module_menu'



const useStyles = makeStyles((theme: any) => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(5)
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  menuButton: {
    marginRight: theme.spacing(4)
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(9),
    paddingBottom: theme.spacing(4)
  },
  fixedHeight: { height: 240 }
}));


const handleTheme = (darkState: boolean | null | undefined): [Theme, ThemeKeys | undefined] => {
  const palletType = darkState ? "dark" : "light"
  const mainPrimaryColor = darkState ? '#cf7d34' : lightBlue[500];
  const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];
  const theme = createTheme({
    palette: {
      mode: palletType,
      primary: { main: mainPrimaryColor },
      secondary: { main: mainSecondaryColor },
    }
  })
  let jsonTheme = darkState ? 'bespin' : 'summerfruit:inverted' as ThemeKeys
  if (darkState) jsonTheme = 'bespin' as ThemeKeys
  return [theme, jsonTheme]
}

export default function App() {
  const classes = useStyles();
  const [darkState, setDarkState] = useQueryParam('darkState', withDefault(BooleanParam, true));
  const [observer_id] =
    useQueryParam('observer_id', withDefault(StringParam, '2003'))
  const [theme, jsonTheme] = handleTheme(darkState)

  const handleThemeChange = (): void => {
    setDarkState(!darkState);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CssBaseline lets ThemeProvider overwrite default css */}
      <div className={classes.root}>
        <TopBar darkTheme={theme} observer_id={observer_id} handleThemeChange={handleThemeChange} />
        <ModuleMenu observer_id={observer_id} jsonTheme={jsonTheme} />
      </div>
    </ThemeProvider>
  );
}