import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { CompactType, getLayoutItem, resolveCollision, sortLayoutItems } from './react-grid-layout-utils';
import { Accordian } from './accordian_form';
import TemplateForm from '../forms/template_form';
import { ObservationBlock, OBComponent, OBComponentNames } from '../../typings/papahana';

const rowHeight: number = 45
const AutoGridLayout = WidthProvider(RGL)

const obComponentNames: OBComponentNames[] = ['acquisition', 'science', 'signature', 'target']

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


const initLayout = (items: string[]): Layout[] => {
    let layouts = items.map((item: string, idx: number) => {
        return { i: item, x: 0, y: idx, w: 1, h: 1 } as Layout
    })
    return layouts
}

interface FormGridProps {
    compactType: CompactType;
    ob: ObservationBlock;
    setOB: Function;
}

const defaultProps = {
    compactType: 'vertical'
}

const calcRowHeight = (height: number): number => {
    return Math.ceil(height / rowHeight)
}



const parseSequence = (sq: OBComponent) => {

}

export default function RGLFormGrid(props: FormGridProps) {

    const classes = useStyles()

    const templateTypes: string[] = obComponentNames.map((componentName: OBComponentNames) => {
        if (componentName in props.ob) {
            return componentName
        }
    }) as string[]

    let layout = initLayout(templateTypes)
    layout = sortLayoutItems(layout, props.compactType)
    const defaultRowHeight = calcRowHeight(rowHeight)

    const [accordItems, setAccordItems] = React.useState<JSX.Element[]>([])

    React.useEffect(() => {
        if (layout.length > 0) {
            console.log('resolving collisions')
            layout = resolveCollision(layout, layout[0], defaultRowHeight, layout[0].y, 'y') // push other items down
            console.log(layout)

            const newAccordItems = layout.map((lo: Layout) => {
                const componentName = lo.i as OBComponentNames 
                const formData = props.ob[componentName as keyof ObservationBlock ] as OBComponent
                const formChild = createForm(componentName, formData)
                return createAccordianDiv(lo, formChild)
            })
            console.log('inside RGLFormGrid. init accoridan items')
            console.log(newAccordItems[0])
            setTimeout(() => {
                setAccordItems(newAccordItems)
            }, 300);
        }
    }, [])
    

    const createForm = (componentName: OBComponentNames, formData: OBComponent): JSX.Element => {
        return <TemplateForm updateOB={updateOB} componentName={componentName} formData={formData} />
    }

    const updateOB = (componentName: OBComponentNames, formData: OBComponent) => {
        console.log(`component: ${componentName} getting updated`)
        let newOB = {...props.ob} as ObservationBlock | any 
        newOB[ componentName as keyof ObservationBlock ] = formData        
        props.setOB(newOB)
    }

    let myRef = React.useRef(null)

    const handleExpand = (id: string, newHeight: number) => {
        const newRowHeight = calcRowHeight(newHeight)
        let newItem = getLayoutItem(layout, id)
        layout = layout.filter((item: Layout) => {
            return !item.i.includes(id)
        })
        newItem.h = newRowHeight
        layout.push(newItem)
        layout = sortLayoutItems(layout, props.compactType)
        layout = resolveCollision(layout, newItem, newRowHeight, newItem.y, 'y') // push other items down
        if (myRef) { // update the AutoGridLayout by using a ref 
            const mf = myRef.current as any
            mf.setState({ layout: JSON.parse(JSON.stringify(layout)), rowHeight: rowHeight })
        }
    }

    const createAccordianDiv = (lo: Layout, formChild: JSX.Element) => {
        return (
            <div data-grid={lo} className={classes.cell} key={lo.i} draggable={true}
                onDragStart={(e: any) => { e.dataTransfer.setData('text/plain', '') }
                }
            >
                <Accordian name={lo.i} id={lo.i} handleExpand={handleExpand}>
                  {formChild}
                </Accordian>
            </div>
        )
    }

    const handleResize = (layout: Layout[],
        oldItem: Layout,
        newItem: Layout,
        placeholder: Layout,
        event: MouseEvent,
        element: HTMLElement
    ) => {
        console.log("resized triggered")
    }

    return (
        <div className={classes.templateAccordian} style={{ position: "relative" }}>
            <AutoGridLayout
                ref={myRef}
                className="layout"
                cols={1}
                rowHeight={rowHeight}
                draggableHandle=".dragme"
                verticalCompact={true}
                compactType={props.compactType}
                isBounded={true}
                autoSize={true}
                resizeHandles={['se']}
                // measureBeforeMount
                onResize={handleResize}
                containerPadding={[0, 0]}
            >
                {accordItems}
                {/* {layout.map((lo: Layout) => (
                    createAccordianDiv(lo)
                )
                )} */}
            </AutoGridLayout>
        </div>
    )
}

RGLFormGrid.defaultProps = defaultProps;