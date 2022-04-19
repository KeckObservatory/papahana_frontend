import { IconButton, Paper } from '@mui/material'
import cloneDeep from 'lodash/cloneDeep';
import { animated } from 'react-spring'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import AddIcon from '@mui/icons-material/Add'
import { Instrument, OBSeqNames, OBSequence, ObservationBlock, ScienceMetadata } from '../../typings/papahana'
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

import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import useBoop from '../../hooks/boop'
import { ob_api_funcs } from '../../api/ApiRoot';
import { useQueryParam, StringParam, BooleanParam, withDefault } from 'use-query-params'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        textAlign: 'left',
        margin: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0),
            width: theme.spacing(50),
        }
    },
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
        // maxWidth: "50%",
        elevation: 5,
    },
    widepaper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        // height: '500px',
        elevation: 5,
        minWidth: theme.spacing(170)
    },
    dndGrid: {
        minWidth: theme.spacing(150),
        elevation: 5,
    },
    dragger: {
        width: "5px",
        cursor: "ew-resize",
        padding: "4px 0 0",
        borderTop: "1px solid #ddd",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    }
}))

interface Props {
    ob_id?: string | null,
    setOBID: Function
    ob: ObservationBlock,
    setOB: Function,
    triggerRender: number,
    setTriggerRender: Function,
    instrument: Instrument,
}

export const SideMenu = (props: Props) => {

    const [darkState, setDarkState] = useQueryParam('darkState', withDefault(BooleanParam, true));
    const [boopStyle, triggerBoop] = useBoop({})
    const classes = useStyles();
    const jsonEditable = true

    let jsonTheme = darkState ? 'bespin' : 'summerfruit:inverted' as ThemeKeys
    const [theme, setTheme] = useQueryParam('theme', withDefault(StringParam, jsonTheme))

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
        ob_api_funcs.post(props.ob).then((result: string) => {
            console.log('put result')
            console.log(result)
        })
    }

    const deleteOB = (): void => {
        console.log(`deleting ob ${props.ob_id}`)
        ob_api_funcs.remove(props.ob_id as string).then((result: unknown) => {
            console.log('delete result')
            console.log(result)
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
    const handleOBSelect = (ob_id: string) => {
        console.log(`setting selected ob to ${ob_id}`)
        props.setOBID(ob_id)
        getOB(ob_id)
    }

    const addSeq = (seq: OBSequence) => {
        console.log('ob before add Seq', props.ob)
        const tmplType = seq.metadata.template_type
        console.log('templateType adding', tmplType)
        const newOB: ObservationBlock = cloneDeep(props.ob) // need to deep clone a nested object
        if (tmplType.includes('sci')) {
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

    const createOB = () => {
        const newOB = { metadata: {} } as ObservationBlock
        // triggerBoop(true)
        props.setOB(newOB)
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

    return (
        <Paper className={classes.paper} elevation={3}>
            <Accordion>
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
                        handleOBSelect={handleOBSelect}
                        ob_id={props.ob_id} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
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
    )
}