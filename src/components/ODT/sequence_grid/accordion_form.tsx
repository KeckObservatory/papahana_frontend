import React, { useRef } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Tooltip } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
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

export const AccordionForm = (props: AccordianProps) => {
    const transitionTime: number = 0 //ms
    const defaultExpanded: boolean = props.expanded ? props.expanded : false
    const ref = useRef(null)
    const deletable = !(props.name === 'metadata' || props.name === 'common_parameters')

    return (
        <Accordion sx={{ backgroundColor: 'divider' }} ref={ref}
            defaultExpanded={defaultExpanded}
            TransitionProps={{ timeout: transitionTime }}
        >
            <AccordionSummary
                sx={
                    {
                        height: '12px',
                        // backgroundColor: theme.palette.divider,
                        padding: '0px',
                    }
                }
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
                {deletable &&
                    <DeleteComponentButton handleDelete={props.handleDelete} id={props.id} name={props.name} />
                }
                <Typography variant={"h6"} sx={
                    {
                        fontWeight: 10,
                        fontSize: '1.25rem',
                        marginTop: '4px',
                    }
                }>{props.name.toUpperCase()}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                {props.children}
            </AccordionDetails>
        </Accordion>
    )
}