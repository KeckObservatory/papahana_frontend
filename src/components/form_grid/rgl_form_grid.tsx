import React, { useEffect, useRef, useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import OpenWithIcon from '@material-ui/icons/OpenWith';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { IconButton } from '@material-ui/core';
import AspectRatio from '@material-ui/icons/AspectRatio'
import { CompactType, getLayoutItem, resolveCollision, sortLayoutItems } from './react-grid-layout-utils';
import { ObservationBlock } from '../../typings/papahana'


const AutoGridLayout = WidthProvider(RGL)

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        templateAccordian: {
            padding: theme.spacing(1),
            margin: theme.spacing(3),
            backgroundColor: theme.palette.divider,
        }
    }),
);

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
    label: string
}

const Accordian = (props: AccordianProps) => {
    const classes = useStyles()
    const ref = useRef(null)

    const handleOpenClose = (e: any) => {

        setTimeout(() => { // wait for animation
            const curr = ref.current as any
            const height = curr.clientHeight
            props.handleExpand(props.id, height)
        }, 300)
    }

    const handleClick = (e: any) => {
        //e.stopPropagation()
    }

    return (
        <Accordion ref={ref}
            onChange={handleOpenClose}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                aria-label="Expand"
            >
                <IconButton className="dragme" aria-label='open' onClick={handleClick}>
                    <OpenWithIcon />
                </IconButton>
                <Typography className={classes.heading}>{props.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                    sit amet blandit leo lobortis eget.
                </Typography>
            </AccordionDetails>
        </Accordion>)
}

const getLayouts = () => {
    const layouts: Layout[] = [
        { i: 'acquisition', x: 0, y: 0, w: 1, h: 1 },
        { i: 'science1', x: 1, y: 0, w: 1, h: 1 },
        { i: 'science2', x: 2, y: 0, w: 1, h: 1 },
        { i: 'target', x: 0, y: 1, w: 1, h: 1 }
    ]
    return layouts
}

interface FormGridProps {
    ob: ObservationBlock
    setOB: Function
    compactType: CompactType
}

const defaultProps = {
    ob: {},
    setOB: () => { },
    compactType: 'vertical'
}




export default function RGLFormGrid(props: FormGridProps) {
    const classes = useStyles()
    const initLayout = sortLayoutItems(getLayouts(), props.compactType) //TODO: get layouts
    const rowHeight: number = 55
    const [layout, setLayout] = useState(initLayout)
    const templates = ['acquisition', 'science1', 'science2', 'target']
    let myRef: any // special way for react-grid-layout to update upon layout change

    const calcRowHeight = (height: number): number => {
        return Math.ceil(height / rowHeight)
    }


    useEffect(() => {
        if (myRef) {
            myRef.setState({layout: JSON.parse(JSON.stringify(layout))})
        }
    }, [layout])

    const handleExpand = (id: string, newHeight: number) => {
        const newRowHeight = calcRowHeight(newHeight)
        let newItem = getLayoutItem(layout, id)
        let newLayout = layout.filter( (item: Layout) => {
            return !item.i.includes(id)
        })
        newItem.h = newRowHeight
        newLayout.push(newItem)
        newLayout = sortLayoutItems(newLayout, props.compactType)
        newLayout = resolveCollision(newLayout, newItem, newRowHeight, newItem.y, 'y') // push other items down
        setLayout(newLayout)
    }

    const createAccordianDiv = (id: string) => {
        return (
            <div key={id} draggable={true}
                onDragStart={(e: any) => {
                    console.log(e); e.dataTransfer.setData('text/plain', '')
                }
                }
            >
                <Accordian label={id} id={id} handleExpand={handleExpand} />
            </div>
        )
    }

    return (
        <div className={classes.templateAccordian} style={{ position: "relative" }}>
            <AutoGridLayout
                ref={(_gridLayout) => {
                    myRef = _gridLayout 
                    }
                }
                className="layout"
                cols={3}
                rowHeight={rowHeight}
                width={1200}
                draggableHandle=".dragme"
                compactType={props.compactType}
                isBounded={true}
                resizeHandles={['se']}
                // resizeHandle={<ResizeHandle />}
                containerPadding={[5, 5]}
            >
                {templates.map((id: string) => (
                    createAccordianDiv(id)
                )
                )}
            </AutoGridLayout>
        </div>
    )
                }

    RGLFormGrid.defaultProps = defaultProps;