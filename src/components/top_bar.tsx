import React  from 'react';
import { makeStyles } from "@material-ui/core"

import AppBar from '@material-ui/core/AppBar';
import Switch from "@material-ui/core/Switch"
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
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
  },}))


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