import React  from "react";
import { OBComponent, ObservationBlock } from "../typings/papahana";
import { Box, makeStyles, Theme } from "@material-ui/core";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AppBar } from '@material-ui/core'
import * as obt from '../typings/ob_json_form'
import { UiSchema  } from "@rjsf/core";
// import SignatureForm from "./signature_form";
import TargetForm from "./target_form"
import AcquisitionForm from "./acquisition_form";
import ScienceForm from "./science_form";
import OverviewForm from "./overview_form";

export const useStyles = makeStyles( (theme: Theme) => ({
    root: {
        textAlign: 'left',
        margin: theme.spacing(0),
        display: 'flex',
        flexWrap: 'wrap',
    },
    form: {
        margin: theme.spacing(0),
        padding: theme.spacing(0)
    },
    tab: {
      minWidth: theme.spacing(15),
      width: 'flex' 
    }
}))


export const createUISchema = (formData: OBComponent, schema: obt.JsonSchema, title: string): UiSchema => {
  // Generate a UI schema based on complete form schema of a complete OB component
  let uiSchema = {} as UiSchema
  // first define readonly values
  for (const [key, property] of Object.entries(schema.properties)) {
    uiSchema[key] = {}  
    if (property.readonly) {
      uiSchema[key]["ui:readonly"] = true
    }
  }
  // Hide form widgets that are not included in OB
  for (const key in Object.keys(formData)) {
    if (!Object.keys(uiSchema).includes(key)) {
        uiSchema[key]['ui:widget'] = 'hidden'
    }
  }
  return uiSchema
}


export interface FormProps extends Props {
    schema: object,
    uiSchema: object,
}

interface Props {
    ob: ObservationBlock,
    setOB: Function
}

export const log = (type: any) => console.log.bind(console, type);

export function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}

export default function OBForm(props: Props) {
  const classes = useStyles() 
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} 
              onChange={handleChange} 
              aria-label="simple tabs example"
              centered={true}
        >
          <Tab className={classes.tab} label="Overview" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Target" {...a11yProps(1)} />
          <Tab className={classes.tab} label="Acquistion" {...a11yProps(2)} />
          <Tab className={classes.tab} label="Science" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <OverviewForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TargetForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AcquisitionForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ScienceForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
    </div>
  )
}