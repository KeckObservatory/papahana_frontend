import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import ODTView from './ODT/observation_data_tool_view';
import ODTGlobeView from './ODTGlobe/global_observing_definition_tool_view';
import { useDrawerOpenContext } from './App'
import { NumberParam, useQueryParam, withDefault } from 'use-query-params'

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div style={{
            position: "absolute",
            width: '100%',
            display: "flex",
            marginTop: '80px'
        }}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{width: '100%'}} p={3}>
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
    const [tabIdx, setTabIdx] = useQueryParam('tab_index', withDefault(NumberParam, 0));

    //setting drawer to always closed
    const drawerOpenContext = useDrawerOpenContext()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {

        if (newValue >= 1) {
            drawerOpenContext.setDrawerOpen(false)
        }
        else {
            drawerOpenContext.setDrawerOpen(true)
        }
        setTabIdx(newValue);
    };

    return (
        <div style={
            {
                marginTop: '36px',
                display: "flex",
                width: '100%',
            }
        } >
            <AppBar position="static" sx={
                {
                    marginTop: '28px',
                    height: "50px",
                    display: "flex",
                    width: '100%',
                }
            }>
                <Tabs
                    value={tabIdx}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs"
                >
                    <Tab label="ODT" {...a11yProps(0)} />
                    {/* <Tab label="Global ODT (Work in progress)" {...a11yProps(0)} /> */}
                </Tabs>
            </AppBar>
            <TabPanel value={tabIdx} index={0}>
                <ODTView />
            </TabPanel>
            {/* <TabPanel value={tabIdx} index={1}>
                <ODTGlobeView />
            </TabPanel> */}
        </ div >
    )
}