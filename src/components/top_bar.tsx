import React, { useEffect } from 'react';
import { makeStyles } from "@mui/styles"
import AppBar from '@mui/material/AppBar';
import Switch from "@mui/material/Switch"
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import { useDrawerOpenContext } from './App';
import LoginDialog from './login_dialog';
import { Theme } from "@mui/material/styles";
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import { get_userinfo } from './../api/ApiRoot';


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    display: "flex"
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },
  appBar: {
  },
  toolbar: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(5)
  },
  switch: {
  },
}))

interface Props {
  observer_id: string
  darkState: boolean
  handleThemeChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export function TopBar(props: Props) {
  const classes = useStyles();
  const drawer = useDrawerOpenContext()
  const [name, setName] = React.useState('')

  useEffect(() => {

    get_userinfo().then( (response: any) => {
      const uname = response.Title + ' ' + response.FirstName + ' ' + response.LastName
      setName(uname)
    })
  }, [])

  const handleMenuClick = () => {
    drawer.setDrawerOpen(!drawer.drawerOpen)
  }

  const handlePortalClick = () => {
    const url = document.location.origin + '/observers/portal/rel/index.html'
    window.open(url, "_self")
  }

  return (
    <AppBar
      position="absolute"
      className={classes.appBar}
    >
      <Toolbar
        className={classes.toolbar}
      >
        <IconButton
          // edge="start"
          // color="inherit"
          aria-label="open drawer"
          onClick={handleMenuClick}
        >
          <MenuIcon id='sidebar-menu-icon'/>
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
          Welcome, {name}!
        </Typography>
        {/* <LoginDialog /> */}
        <Tooltip title="Click Return to Observer Portal">
          <IconButton
            aria-label="open drawer"
            onClick={handlePortalClick}
          >
            <DoorFrontIcon id="observer-portal-icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle on for dark mode">
          <Switch
            color="secondary"
            checked={props.darkState}
            onChange={props.handleThemeChange} />
        </Tooltip>

      </Toolbar>
    </AppBar>
  )
}