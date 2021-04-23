import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core"
import './App.css';
import JsonBlockViewer from './json_viewer/JsonBlockViewer'
import Switch from "@material-ui/core/Switch"
import { createMuiTheme, ThemeProvider, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { lightBlue, deepOrange, deepPurple} from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import { BrowserRouter as Router, Route, useLocation, useHistory } from "react-router-dom"

const useStyles = makeStyles(theme => ({
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
  appBar: { 
  },
  menuButton: { 
    marginRight: theme.spacing(4) 
  },
  title: { 
    marginLeft: theme.spacing(2),
    flexGrow: 1,
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

export function TopBar(props: any) {
  const classes = useStyles();
  return( 
    <AppBar 
      position="absolute"
      className={classes.appBar}  
    >
      <Toolbar
        className={classes.toolbar}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Papahana Demo
        </Typography>
        <Tooltip title="Toggle on for dark mode">
          <Switch checked={props.darkState} onChange={props.handleThemeChange}/>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

const handleTheme = (darkState: boolean): Theme => {
  const palletType = darkState ? "dark" : "light"
  const mainPrimaryColor = darkState ? '#cf7d34': lightBlue[500];
  const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];
  const theme = createMuiTheme({
    palette: {
      type: palletType,
      primary: { main: mainPrimaryColor},
      secondary: {main: mainSecondaryColor}
    }
  })
  return theme
}


export function getQuery(location: any) {
  const searchParams = new URLSearchParams(location.search);
  return {
    ob_id: searchParams.get("ob_id"),
    darkTheme: searchParams.get("darkTheme")
  };
}

export function setQuery( key: string, value: any ): string {
  const searchParams = new URLSearchParams();
  searchParams.set(key, value);
  return searchParams.toString()
}

export default function App() {
  const classes = useStyles();
  const [darkState, setDarkState] = useState(true);
  const location = useLocation()
  const history = useHistory()
  const query = getQuery(location)
  console.log('location')
  console.log(location)
  console.log('history')
  console.log(history)

  console.log('query')
  console.log(query)
  const jsonTheme = darkState ? 'bespin': 'summerfruit:inverted'
  const darkTheme = handleTheme(darkState)

  const handleThemeChange = (): void => {
      setDarkState( !darkState);
      history.push(setQuery("darkState", !darkState))
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* CssBaseline lets ThemeProvider overwrite default css */}
      <div className={classes.root}>
        <Route>
        <TopBar darkTheme={darkTheme} handleThemeChange={handleThemeChange} />
        {/* <Route
          path="/"
          render={handleJsonView}
        /> */}
          <JsonBlockViewer theme={jsonTheme} />
        </Route>
      </div>
    </ThemeProvider>
  );
}