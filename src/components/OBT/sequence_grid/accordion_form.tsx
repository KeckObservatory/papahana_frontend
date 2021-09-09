import React, { useRef } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton, Tooltip } from '@material-ui/core';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { ObservationBlock } from "../../../typings/papahana"
import { DeleteSequenceButton } from './delete_sequence_button'

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
    handleDelete: Function
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


export const AccordionForm = (props: AccordianProps) => {
    const transitionTime: number = 0 //ms
    const defaultExpanded: boolean = true 
    const classes = useStyles()
    const ref = useRef(null)




    return (
        <Accordion className={classes.cell} ref={ref}
            defaultExpanded={defaultExpanded}
            TransitionProps={{ timeout: transitionTime }}
        >
            <AccordionSummary
                className={classes.accordianSummary}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                aria-label="Expand"
            >
                <Tooltip title="Drag form">
                    <IconButton
                        className="dragme"
                        aria-label='open'
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                    >
                        <OpenWithIcon />
                    </IconButton>
                </Tooltip>
                <DeleteSequenceButton handleDelete={props.handleDelete} />
                <Typography variant={"h6"} className={classes.heading}>{props.name}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                {props.children}
            </AccordionDetails>
        </Accordion>)
}