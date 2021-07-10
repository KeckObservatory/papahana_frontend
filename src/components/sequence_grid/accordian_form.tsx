import React, { useEffect, useRef, useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton } from '@material-ui/core';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { withSize } from 'react-sizeme'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { ObservationBlock } from "../../typings/papahana"

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
    formChild: JSX.Element;
}


const rowHeight: number = 45 

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative',
            justifyContent: 'center'
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
            padding: theme.spacing(0)
        }
    }),
);

export const Accordian = withSize({monitorHeight: true})((props: AccordianProps) => {
    const classes = useStyles()
    const ref = useRef(null)
    console.log(props)

    React.useEffect( () => {
        if (ref) {
            console.log('initHeight:')
            const curr = ref.current as any
            console.log(props.size)
            console.log(curr.clientHeight)
            props.handleExpand(props.id, curr.clientHeight)
        }
    }, [])

    const handleOpenClose = (e: any) => {
        setTimeout(() => { // wait for animation
            const curr = ref.current as any
            const height = curr.clientHeight
            props.handleExpand(props.id, height)
        }, 300)
    }

    return (
        <Accordion className={classes.cell} ref={ref}
            defaultExpanded={true}
            onChange={handleOpenClose}
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
            <AccordionDetails>
                {props.formChild}
            </AccordionDetails>
        </Accordion>)
})