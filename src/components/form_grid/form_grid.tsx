import React, { useRef, useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import OpenWithIcon from '@material-ui/icons/OpenWith';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import { IconButton } from '@material-ui/core';

const AutoGridLayout = WidthProvider(GridLayout)


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);

interface AccordianProps {
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
    return (<Accordion ref={ref}
        onChange={handleOpenClose}

    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            aria-label="Expand"
        >
            <div className="dragme">
                <IconButton aria-label='copy'>
                    <OpenWithIcon />
                </IconButton>
            </div>
            <Typography className={classes.heading}>Accordion {props.label}</Typography>
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
        { i: 'acquisition', x: 0, y: 0, w: 2, h: 2 },
        { i: 'science1', x: 2, y: 0, w: 2, h: 2 },
        { i: 'science2', x: 4, y: 0, w: 2, h: 2 },
        { i: 'target', x: 0, y: 3, w: 2, h: 2 }
    ]
    return layouts
}

export default function FormGrid(props: any) {
    const initLayout = getLayouts() //TODO: get layouts
    const rowHeight: number = 35

    const [layout, setLayout] = useState(initLayout)
    const templates = ['acquisition', 'science1', 'science2', 'target']

    const calcRowHeight = (height: number): number => {
        return Math.ceil(height / rowHeight)
    }

    const handleResize = (id: string, newHeight: number) => {
        console.log('resize event triggered')
        console.log(id)
        console.log(newHeight)
        const newRowHeight = calcRowHeight(newHeight)
        console.log(newRowHeight)
        const newLayout = [...layout]
        newLayout.forEach((layoutItem: Layout) => {
            if (id === layoutItem.i) {
                console.log(`setting layout item ${id} to height ${newRowHeight}`)
                layoutItem.h = newRowHeight
            }
        })
        console.log(newLayout)
        console.log(`setting new Layout height`)

        setLayout(newLayout)
    }

    return (
        <AutoGridLayout
            className="layout"
            layout={layout}
            cols={6}
            rowHeight={rowHeight}
            width={1200}
            draggableHandle=".dragme"
            compactType="vertical"
            isBounded={true}
            resizeHandles={['se']}
            resizeHandle={<ResizeHandle />}
            containerPadding={[5, 5]}
        >
            {templates.map((id: string) => (
                <div key={id} draggable={true}
                    onDragStart={(e: any) => {
                        console.log(e); e.dataTransfer.setData('text/plain', '')
                    }
                    }
                >
                    <Accordian label={id} id={id} handleExpand={handleResize} />
                </div>
            )
            )}
        </AutoGridLayout>
    )
}

const ResizeHandle = React.forwardRef((props: any, ref: any) => {
    return (
      <div
        {...props}
        ref={ref}
        className="react-resizable-handle"
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          bottom: 0,
          right: 0,
          cursor: "se-resize"
        }}
      />
    );
  });