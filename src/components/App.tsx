import React  from 'react';
import { makeStyles } from "@material-ui/core"
import './App.css';
import OBTView from './OBT/observation_data_tool_view'
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
import { BooleanParam, StringParam, useQueryParam, withDefault } from 'use-query-params'
import { ThemeKeys } from 'react-json-view';

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
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Welcome, Observer {props.observer_id}!
        </Typography>
        <Tooltip title="Toggle on for dark mode">
          <Switch checked={props.darkState} onChange={props.handleThemeChange}/>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

const handleTheme = (darkState: boolean | null | undefined): [Theme, ThemeKeys | undefined ] => {
  const palletType = darkState ? "dark" : "light"
  const mainPrimaryColor = darkState ? '#cf7d34': lightBlue[500];
  const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];
  const theme = createMuiTheme({
    palette: {
      type: palletType,
      primary: { main: mainPrimaryColor},
      secondary: {main: mainSecondaryColor},
    }
  })
  let jsonTheme = darkState ? 'bespin': 'summerfruit:inverted' as ThemeKeys
  if (darkState) jsonTheme = 'bespin' as ThemeKeys
  return [theme, jsonTheme]
}

export default function App() {
  const classes = useStyles();
  const [ darkState, setDarkState ] = useQueryParam('darkState', withDefault(BooleanParam, true));
  const [observer_id ] =
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
        <OBTView observer_id={observer_id} theme={jsonTheme} />
      </div>
    </ThemeProvider>
  );
}