import React from 'react';
import { DefaultTheme, makeStyles } from "@mui/styles"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import ODTView from './ODT/observation_data_tool_view';
import ODTGlobeView from './ODTGlobe/global_observing_definition_tool_view';
import { ThemeKeys } from 'react-json-view';
import { SelectionToolView } from './SelectionTool/selection_tool_view';
import { useDrawerOpenContext } from './App'
import { NumberParam, useQueryParam, withDefault } from 'use-query-params'

const useStyles = makeStyles((theme: DefaultTheme) => ({
    moduleMain: {
        width: '100%'
    },
    tabs: {
        marginTop: theme.spacing(9),
        // height: theme.spacing(10),
        position: "absolute",
        display: "flex",
        width: '100%',
        // padding: theme.spacing(2),
    },
    items: {
        // marginTop: theme.spacing(12),
        position: "relative",
        // height: '100%',
        width: '100%',
        display: "flex"
    },
    panel: {
        width: '100%',
    }
}))

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const classes = useStyles();
    const { children, value, index, ...other } = props;
    return (
        <div className={classes.items}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className={classes.panel} p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface ModuleMenuProps {
}

export const ModuleMenu = (props: ModuleMenuProps) => {
    const classes = useStyles();
    // const [tabIdx, setTabIdx] = React.useState(1);
    const [tabIdx, setTabIdx] = useQueryParam('tab_index', withDefault(NumberParam, 1));

    //setting drawer to always closed
    const drawerOpenContext = useDrawerOpenContext()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {

        if (newValue >= 1) {
            console.log('setting drawer to closed')
            drawerOpenContext.setDrawerOpen(false)
        }
        else {
            console.log('setting drawer to open')
            drawerOpenContext.setDrawerOpen(true)
        }
        setTabIdx(newValue);
    };

    return (
        <div className={classes.moduleMain}>
            <AppBar position="static" className={classes.tabs}>
                <Tabs
                    value={tabIdx}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs"
                >
                    <Tab label="ODT" {...a11yProps(0)} />
                    <Tab label="Global ODT (Work in progress)" {...a11yProps(0)} />
                    <Tab label="Planning Tool (Work in progress)" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabIdx} index={0}>
                <ODTView />
            </TabPanel>
            <TabPanel value={tabIdx} index={1}>
                <ODTGlobeView />
            </TabPanel>
            <TabPanel value={tabIdx} index={2}>
                <SelectionToolView />
            </TabPanel>
        </ div >
    )
}