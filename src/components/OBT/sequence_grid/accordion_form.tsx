import React, { useRef } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Tooltip } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { ObservationBlock } from "../../../typings/papahana"
import { DeleteComponentButton } from './delete_component_button'

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

const useStyles = makeStyles((theme: Theme) => ({
        root: {
            position: 'relative',
            justifyContent: 'center',
        },
        heading: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '1.25rem',
            marginTop: theme.spacing(1),
        },
        cell: {
            margin: theme.spacing(0),
            padding: theme.spacing(0),
            minHeight: rowHeight,
            // backgroundColor: 'grey',
        },
        templateAccordian: {
            padding: theme.spacing(0),
            margin: theme.spacing(0),
            alignItems: 'center',
        },
        accordianSummary: {
            height: theme.spacing(3),
            backgroundColor: theme.palette.divider,
            padding: theme.spacing(0),
        },
    }),
)


export const AccordionForm = (props: AccordianProps) => {
    const transitionTime: number = 0 //ms
    const defaultExpanded: boolean = true 
    const classes = useStyles()
    const ref = useRef(null)

    return (
        <Accordion sx={{backgroundColor: 'divider'}} ref={ref}
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
                <DeleteComponentButton handleDelete={props.handleDelete} />
                <Typography variant={"h6"} className={classes.heading}>{props.name.toUpperCase()}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                {props.children}
            </AccordionDetails>
        </Accordion>
        )
}