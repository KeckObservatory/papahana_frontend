import React, { useRef } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton } from '@material-ui/core';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { ObservationBlock } from "../../typings/papahana"
import { setState } from 'react-jsonschema-form/lib/utils';

export type FormNames = keyof ObservationBlock 

interface Size {
    width: number,
    height: number
}

interface withHeightWidthProps {
    size?: Size
}
interface AccordianProps extends withHeightWidthProps {
    id: string
    handleExpand: Function
    name: string
    children?: React.ReactNode
    expanded?: boolean
}


const rowHeight: number = 45 

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative',
            justifyContent: 'center',
        },
        heading: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '1.25rem',
            marginTop: theme.spacing(1)
        },
        cell: {
            margin: theme.spacing(0),
            padding: theme.spacing(0),
            minHeight: rowHeight
        },
        templateAccordian: {
            padding: theme.spacing(0),
            margin: theme.spacing(0),
            alignItems: 'center',
            backgroundColor: theme.palette.divider,
        },
        accordianSummary: {
            height: theme.spacing(3),
            padding: theme.spacing(0),
        },
    }),
);

export const Accordian = (props: AccordianProps) => {
    const transitionTime: number = 0 //ms
    const defaultExpanded: boolean = true 
    const classes = useStyles()
    const ref = useRef(null)

    React.useEffect( () => {
        if (ref) {
            setTimeout( () => {
                const curr = ref.current as any
                //console.log('initHeight:')
                //console.log(curr.clientHeight)
                props.handleExpand(props.id, curr.clientHeight, defaultExpanded, true)
            }, 30 + transitionTime)
        }
    }, [])

    const handleOpenClose = (e: any, expanded: boolean) => {
        setTimeout(() => { // wait for animation
            const curr = ref.current as any
            const height = curr.clientHeight
            console.log(`expanded: ${expanded} height of ${props.id}: ${height}`)
            props.handleExpand(props.id, height, expanded )
        }, 30+transitionTime)
    }

    return (
        <Accordion className={classes.cell} ref={ref}
            defaultExpanded={defaultExpanded}
            onChange={handleOpenClose}
            TransitionProps={{timeout: transitionTime}}
        >
            <AccordionSummary
                className={classes.accordianSummary}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                aria-label="Expand"
            >
                <IconButton className="dragme" aria-label='open'>
                    <OpenWithIcon />
                </IconButton>
                <Typography variant={"h6"} className={classes.heading}>{props.name}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                {props.children}
            </AccordionDetails>
        </Accordion>)
}