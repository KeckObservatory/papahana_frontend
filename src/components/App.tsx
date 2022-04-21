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


export const handleTheme = (darkState: boolean | null | undefined): Theme => {
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
  return theme
}

export interface ObsContext {
  observer_id: string,
  setObserverId: Function
}

const init_obs_context: ObsContext = { observer_id: 'XXXX', setObserverId: () => { } }

const ObserverContext = createContext<ObsContext>(init_obs_context)
export const useObserverContext = () => useContext(ObserverContext)

export interface Drawer {
  drawerOpen: boolean
  setDrawerOpen: Function
  drawerWidth: number
  setDrawerWidth: Function
}

const initDrawer = { drawerOpen: true, setDrawerOpen: () => { }, drawerWidth: 700, setDrawerWidth: () => { } }

const DrawerOpenContext = createContext<Drawer>(initDrawer)
export const useDrawerOpenContext = () => useContext(DrawerOpenContext)


interface MainProp {
  open?: string,
  drawerWidth: number
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })<MainProp>
  (({ theme, open, drawerWidth }) => ({

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
  const [drawerWidth, setDrawerWidth] = React.useState(400)

  const [observer_id, setObserverId] =
    useQueryParam('observer_id', withDefault(StringParam, 'Stranger'))

  const theme = handleTheme(darkState)

  const handleThemeChange = (): void => {
    setDarkState(!darkState);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CssBaseline lets ThemeProvider overwrite default css */}
      <DrawerOpenContext.Provider value={{ drawerOpen: drawerOpen, setDrawerOpen: setDrawerOpen, drawerWidth: drawerWidth, setDrawerWidth }}>
        <ObserverContext.Provider value={{ observer_id: observer_id, setObserverId: setObserverId }}>
          <div className={classes.root}>
            <Main open={drawerOpen ? 'open' : 'closed'} drawerWidth={drawerWidth} >
              <TopBar darkState={darkState} observer_id={observer_id} handleThemeChange={handleThemeChange} />
              <ModuleMenu />
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