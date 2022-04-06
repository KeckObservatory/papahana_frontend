import React, { createContext, useContext, useState } from 'react';
import { makeStyles } from "@mui/styles"
import './App.css';
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightBlue, deepOrange, deepPurple } from '@mui/material/colors';
import { BooleanParam, StringParam, useQueryParam, withDefault } from 'use-query-params'
import { ThemeKeys } from 'react-json-view'
import { TopBar } from './top_bar'
import { ModuleMenu } from './module_menu'
import { styled, useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: '8px',
    paddingLeft: '40px'
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    // ...theme.mixins.toolbar
  },
  menuButton: {
    marginRight: '16px'
  },
  // appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: '27px',
    paddingBottom: '16px'
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

export interface ObsContext {
  observer_id: string,
  setObserverId: Function
}

const init_obs_context: ObsContext = { observer_id: '2003', setObserverId: () => { } }

const ObserverContext = createContext<ObsContext>(init_obs_context)
export const useObserverContext = () => useContext(ObserverContext)

export interface Drawer {
  drawerOpen: boolean
  setDrawerOpen: Function
  drawerWidth: number
}

const DrawerOpenContext = createContext<Drawer>({ drawerOpen: true, setDrawerOpen: () => { }, drawerWidth: 500 })
export const useDrawerOpenContext = () => useContext(DrawerOpenContext)

const drawerWidth = 700;

const Main = styled('main', { shouldForwardProp: (prop: string) => prop !== 'open' })<{
  open?: string;
}>(({ theme, open }) => ({

  flexGrow: 1,
  padding: theme.spacing(1),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open === 'open' && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

export default function App() {
  const classes = useStyles();
  const [darkState, setDarkState] = useQueryParam('darkState', withDefault(BooleanParam, true));
  const [drawerOpen, setDrawerOpen] = useQueryParam('drawerOpen', withDefault(BooleanParam, true));
  const [observer_id, setObserverId] =
    useQueryParam('observer_id', withDefault(StringParam, '2003'))


  const [theme, jsonTheme] = handleTheme(darkState)

  const handleThemeChange = (): void => {
    setDarkState(!darkState);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CssBaseline lets ThemeProvider overwrite default css */}
      <DrawerOpenContext.Provider value={{ drawerOpen: drawerOpen, setDrawerOpen: setDrawerOpen, drawerWidth: drawerWidth }}>
        <ObserverContext.Provider value={{ observer_id: observer_id, setObserverId: setObserverId }}>
          <div className={classes.root}>
            <Main open={drawerOpen ? 'open' : 'closed'} >
              <TopBar darkState={darkState} observer_id={observer_id} handleThemeChange={handleThemeChange} />
              <ModuleMenu jsonTheme={jsonTheme} />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </Main>
          </div>
        </ObserverContext.Provider>
      </DrawerOpenContext.Provider>
    </ThemeProvider>
  );
}