import React, { createContext, useContext } from 'react';
import { IconButton, Paper } from '@mui/material'
import cloneDeep from 'lodash/cloneDeep';
import { animated } from 'react-spring'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { Instrument, OBSequence, ObservationBlock, ScienceMetadata } from '../../typings/papahana'
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import Tooltip from '@mui/material/Tooltip'
import DeleteDialog from './delete_dialog'
import UploadDialog from './upload_dialog'
import ObservationBlockSelecter from '../OBSelect/ob_select'
import JsonViewTheme from '../json_view_theme'
import TemplateSelection from './template_selection'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { get_ob_list, get_container_list } from '../../api/utils'
import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import useBoop from '../../hooks/boop'
import { ob_api_funcs } from '../../api/ApiRoot';
import { useQueryParam, StringParam, BooleanParam, withDefault } from 'use-query-params'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'


export interface OBSelectContextObject {
    sem_id: string,
    setSemId: Function,
    reset_container_and_ob_select: Function,
    trigger: number,
    setTrigger: Function
}

const init_object: OBSelectContextObject = {
    sem_id: '',
    setSemId: () => { },
    reset_container_and_ob_select: () => { },
    trigger: 0,
    setTrigger: () => { }
}


const OBSelectContext = createContext<OBSelectContextObject>(init_object)
export const useOBSelectContext = () => useContext(OBSelectContext)

const useStyles = makeStyles((theme: Theme) => ({
    buttonBlock: {
        margin: theme.spacing(1),
        display: 'inline-flex',
    },
    templateSelect: {
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        width: "100%",
        elevation: 5,
    },
}))

interface Props {
    ob_id?: string | null,
    setOBID: Function
    ob: ObservationBlock,
    setOB: Function,
    triggerRender: number,
    setTriggerRender: Function,
    instrument: Instrument,
    setInstrument: Function
}

export const SideMenu = (props: Props) => {

    const [darkState, setDarkState] = useQueryParam('darkState', withDefault(BooleanParam, true));

    const [sem_id, setSemId] =
        useQueryParam('sem_id', withDefault(StringParam, ''))
    const [boopStyle, triggerBoop] = useBoop({})
    const classes = useStyles();
    const jsonEditable = true

    const [selAccdExpanded, setSelAccdExpanded] = React.useState(true);
    const [editAccdExpanded, setEditAccdExpanded] = React.useState(true);

    let jsonTheme = darkState ? 'bespin' : 'summerfruit:inverted' as ThemeKeys
    const [theme, setTheme] = useQueryParam('theme', withDefault(StringParam, jsonTheme))
    const [containerIdList, setContainerIdList] = React.useState([] as string[])
    const [trigger, setTrigger] = React.useState(0)
    const [obList, setOBList] = React.useState([] as string[])

    const [container_id, setContainerId] =
        useQueryParam('container_id', withDefault(StringParam, 'all'))

    //check if can submit ob
    let obEditable: boolean = 'metadata' in props.ob && typeof (props.ob_id) === "string"

    const reset_container_and_ob_select = () => {
        get_container_list(sem_id)
            .then((lst: string[]) => {
                setContainerIdList(lst)
                if (lst.length >= 1) {
                    setContainerId(lst[0])
                }
            })
            .then(() => {
                get_ob_list(sem_id, container_id).then((lst: string[]) => {
                    setOBList(lst)
                    return lst
                })
            })
    }

    const ob_select_object = {
        sem_id: sem_id,
        setSemId: setSemId,
        reset_container_and_ob_select: reset_container_and_ob_select,
        trigger: trigger,
        setTrigger: setTrigger
    }

    const saveOBasJSON = () => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([JSON.stringify(props.ob, null, 4)], { type: 'text/plain' })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = props.ob._id + '.json'
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const uploadOBFromJSON = (newOB: ObservationBlock): void => {
        if (newOB) {
            props.setOBID(newOB._id)
            props.setOB(newOB)
            props.setTriggerRender(props.triggerRender + 1) //force dnd component to rerender
        }
    }

    const copyOB = (): void => {
        console.log(`creating new ob from ob ${props.ob_id}`)
        let copyOB = { ...props.ob } as any
        const copyName = 'Copy of ' + props.ob.metadata.name
        copyOB.metadata['name'] = copyName
        delete copyOB._id
        delete copyOB._ob_id
        ob_api_funcs.post(copyOB).then((_id: string) => {
            console.log('post result')
            console.log(_id)
            props.setTriggerRender(props.triggerRender + 1) //force dnd component to rerender
        })
    }

    const deleteOB = (): void => {
        console.log(`deleting ob ${props.ob_id}`)
        ob_api_funcs.remove(props.ob_id as string).then((result: unknown) => {
            console.log('delete result')
            console.log(result)
            props.setTriggerRender(props.triggerRender + 1) //force dnd component to rerender
            setTrigger(trigger + 1) //force sidebar to rerender
            props.setOB({} as ObservationBlock)
            props.setOBID('')
        })
    }

    const getOB = (new_ob_id: string): void => {
        ob_api_funcs.get(new_ob_id).then((newOb: ObservationBlock) => {
            if (newOb._id) {
                props.setOB(newOb)
            }
        })
            .finally(() => {
                props.setTriggerRender(props.triggerRender + 1) //force dnd component to rerender
            })
    }
    const handleOBSelect = (ob_id: string) => { //TODO : make context to prevent prop drilling
        console.log(`setting selected ob to ${ob_id}`)
        props.setOBID(ob_id)
        getOB(ob_id)
    }

    const addSeq = (seq: OBSequence) => {
        console.log('ob before add Seq', props.ob)
        const tmplType = seq.metadata.template_type
        console.log('templateType adding', tmplType)
        const newOB: ObservationBlock = cloneDeep(props.ob) // need to deep clone a nested object
        if (tmplType.includes('sci') || tmplType.includes('calibration')) {
            let obs = [...(newOB.observations ?? [])] //need to make a deep copy of observations
            const metadata = seq.metadata as ScienceMetadata
            metadata['sequence_number'] = obs.length + 1
            seq.metadata = metadata
            //@ts-ignore
            obs.push(seq)
            newOB.observations = [...obs]
        }
        else {
            //@ts-ignore
            newOB[tmplType] = seq
        }
        // triggerBoop(true)
        props.setOB(newOB)
        props.setTriggerRender(props.triggerRender + 1)
    }

    const onEdit = (e: InteractionProps) => {
        //ob was edited. in react json viewer
        // triggerBoop(true)
        console.log('editing via json directly.')
        props.setOB(() => e.updated_src as ObservationBlock);
        props.setTriggerRender(props.triggerRender + 1) //re render DnD items 
    }

    const handleEdit = jsonEditable ? onEdit : false
    const handleSubmit = () => {
        triggerBoop(false)
        ob_api_funcs.put(props.ob._id, props.ob)
    }

    const handleAccordionChange = (accd: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        if (accd === 'select') {
            setSelAccdExpanded(!selAccdExpanded)
        }
        else if (accd === 'edit') {
            setEditAccdExpanded(!editAccdExpanded)
        }
        else {

        }
    }

    return (

        <OBSelectContext.Provider value={ob_select_object}>
            <Paper className={classes.paper} elevation={3}>
                {obEditable &&
                    <React.Fragment>
                        <Accordion expanded={editAccdExpanded} onChange={handleAccordionChange('edit')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Observation Block/Template Edit</Typography>
                                {/* <h3>Observation Block Edit/Display</h3> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={classes.buttonBlock}>
                                    <Tooltip title="Upload OB to database">
                                        <animated.button aria-label='upload' onClick={handleSubmit} style={boopStyle}>
                                            <PublishIcon />
                                        </animated.button>
                                    </Tooltip>
                                    <Tooltip title="Copy OB to new OB">
                                        <IconButton aria-label='copy' onClick={copyOB}>
                                            <FileCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Save OB as JSON">
                                        <IconButton aria-label='copy' onClick={saveOBasJSON}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <UploadDialog uploadOBFromJSON={uploadOBFromJSON} />
                                    <DeleteDialog deleteOB={deleteOB} />
                                </div>
                                <Tooltip title="Add template to Selected OB">
                                    <div className={classes.templateSelect}>
                                        <TemplateSelection addSeq={addSeq} instrument={props.instrument} obSequences={Object.keys(props.ob)} />
                                    </div>
                                </Tooltip>
                            </AccordionDetails>
                        </Accordion>
                    </React.Fragment>
                }
                <Accordion expanded={selAccdExpanded} onChange={handleAccordionChange('select')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Observation Block Selection</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ObservationBlockSelecter
                            setOB={props.setOB}
                            setInstrument={props.setInstrument}
                            handleOBSelect={handleOBSelect}
                            ob_id={props.ob_id} />
                    </AccordionDetails>
                </Accordion>
                <Tooltip title="Change the color theme of the OB JSON display">
                    <div>
                        <JsonViewTheme
                            theme={theme as ThemeKeys | null | undefined}
                            setTheme={setTheme}
                        />
                    </div>
                </Tooltip>
                <ReactJson
                    style={{ marginBottom: '80px' }}
                    src={props.ob as object}
                    theme={theme as ThemeKeys | undefined}
                    iconStyle={'circle'}
                    collapsed={1}
                    collapseStringsAfterLength={15}
                    enableClipboard={true}
                    onEdit={handleEdit}
                />
            </Paper >
        </OBSelectContext.Provider>
    )
}