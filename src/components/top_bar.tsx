import React  from 'react';
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
// import { DefaultTheme } from '@mui/private-theming'
import { Theme } from "@mui/material/styles";


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

  const handleMenuClick = () => {
    drawer.setDrawerOpen(!drawer.drawerOpen)
  }

  return( 
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
        <LoginDialog />
        <Tooltip title="Toggle on for dark mode">
          <Switch 
            color="secondary"
            checked={props.darkState} 
            onChange={props.handleThemeChange}/>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}