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
import AspectRatio from '@material-ui/icons/AspectRatio'
import { withSize } from 'react-sizeme';

//const AutoGridLayout = WidthProvider(GridLayout)
const withHeightWidth = withSize({monitorHeight: true, monitorWidth: true})
const AutoGridLayout = withHeightWidth(GridLayout)


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

const Accordian = withHeightWidth((props: AccordianProps) => {
    const classes = useStyles()
    const ref = useRef(null)
    const handleOpenClose = (e: any) => {
        setTimeout(() => { // wait for animation
            // const curr = ref.current as any
            // const height = curr.clientHeight
            props.handleExpand(props.id, props.size?.height)
        }, 300)
    }

    const handleClick = (e: any) => {
        console.log('drag clicked')
        e.stopPropagation()

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
                <IconButton className="dragme" aria-label='open' onClick={handleClick}>
                    <OpenWithIcon />
                </IconButton>
            <Typography className={classes.heading}>Accordion {props.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
            </Typography>
        </AccordionDetails>
    </Accordion>)
})

const getLayouts = () => {
    const layouts: Layout[] = [
        { i: 'acquisition', x: 0, y: 0, w: 1, h: 1 },
        { i: 'science1', x: 1, y: 0, w: 1, h: 1 },
        { i: 'science2', x: 2, y: 0, w: 1, h: 1 },
        { i: 'target', x: 0, y: 1, w: 1, h: 1 }
    ]
    return layouts
}

export default function FormGrid(props: any) {
    const initLayout = getLayouts() //TODO: get layouts
    const rowHeight: number = 55

    console.log('setting layout to default')
    const [layout, setLayout] = useState(initLayout)
    const templates = ['acquisition', 'science1', 'science2', 'target']

    const calcRowHeight = (height: number): number => {
        return Math.ceil(height / rowHeight)
    }

    const emitResized = ()=> {
        console.log('emitting resize event')
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent('resize', true, false);
        window.dispatchEvent(evt);
        console.log(evt)
    }

    const handleExpand = (id: string, newHeight: number) => {
        console.log('accordian expanded')
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
        emitResized()
    }


    const handleResize = ( layout: Layout[], oldItem: Layout, newItem: Layout,
        placeholder: Layout,
        event: MouseEvent,
        element: HTMLElement,
    ):void => {
        console.log('resize triggered')
        console.log(layout)
        console.log(oldItem)
        console.log(newItem)
        console.log(placeholder)
        console.log(event)
        console.log(element)
    }

    const handleLayoutChange = (layout: Layout[]) => {
        console.log('layout changed event')
    }

    return (
        <div style={{position: "relative"}}>
        <AutoGridLayout
            className="layout"
            layout={layout}
            cols={3}
            rowHeight={rowHeight}
            width={1200}
            draggableHandle=".dragme"
            compactType="vertical"
            //preventCollision={true}
            //isBounded={true}
            onLayoutChange={handleLayoutChange}
            onResizeStop={handleResize}
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
                    <Accordian label={id} id={id} handleExpand={handleExpand} />
                </div>
            )
            )}
        </AutoGridLayout>
        </div>
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
          bottom: 0,
          right: 0,
          cursor: "se-resize"
        }}>
        <IconButton aria-label="resize"
        onClick={ e => {
            e.stopPropagation()
        }}
        >
            <AspectRatio></AspectRatio>
        </IconButton>
        </div>
    );
  });