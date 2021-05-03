import React  from "react";
import Form from '@rjsf/material-ui'
import { OBComponent, ObservationBlock, Signature } from "../typings/papahana";
import { ISubmitEvent, UiSchema  } from "@rjsf/core";
import { Box, makeStyles, Theme } from "@material-ui/core";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AppBar } from '@material-ui/core'
import * as obt from '../typings/ob_json_form'

const useStyles = makeStyles( (theme: Theme) => ({
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

const signatureSchema: obt.OBJsonSchema = {
  title: "Signature",
  type: "object",
  required: ["pi", "semester", "observers", "program", "container"],
  properties: {
    pi: {
      type: "string",
      title: "primary investigator",
      readonly: true 
    },
    semester: {
      type: "string",
      title: "semester id"
    },
    observers: {
      type: "array",
      title: "observers",
      items: {
        type: "string",
      },
      uniqueItems: true
    },
    program: {
      title: "program",
      type: "integer"
    },
    container: {
      title: "container id",
      type: "integer"
    }
  }
}

export const createUISchema = (formData: OBComponent, schema: obt.OBJsonSchema, title: string): UiSchema => {
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

const uiSchema: UiSchema = {
  pi: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  }
}

interface Props {
    ob: ObservationBlock,
    schema: object,
    uiSchema: object,
    setOB: Function
}

const log = (type: any) => console.log.bind(console, type);
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
              // variant="fullWidth"
              centered={true}
              variant="scrollable"
        >
          <Tab className={classes.tab} label="Signature" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Target" {...a11yProps(1)} />
          <Tab className={classes.tab} label="Acquistion" {...a11yProps(2)} />
          <Tab className={classes.tab} label="Observations" {...a11yProps(3)} />
          <Tab className={classes.tab} label="Associations" {...a11yProps(4)} />
          <Tab className={classes.tab} wrapped label="Observation Type" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <SignatureForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Target form goes here
      </TabPanel>
      <TabPanel value={value} index={2}>
        Acquisition form goes here 
      </TabPanel>
      <TabPanel value={value} index={3}>
        Observations form goes here 
      </TabPanel>
      <TabPanel value={value} index={4}>
        Associaiotins form goes here 
      </TabPanel>
      <TabPanel value={value} index={5}>
        Observation type form goes here 
      </TabPanel>
    </div>
  )
}

export function SignatureForm(props: Props) {
  const classes = useStyles()
  const setSignature = (sig: Signature) => {
    let newOb = {...props.ob}
    newOb.signature = sig
    props.setOB(newOb)
  }
  const handleSubmit = ( evt: ISubmitEvent<Signature>): void => {
    setSignature(evt.formData)
  }
return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={props.ob.signature}
        onChange={log("changed")}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}

const defaultProps = {
  schema: signatureSchema,
  uiSchema: uiSchema
}

SignatureForm.defaultProps = defaultProps
OBForm.defaultProps = defaultProps
