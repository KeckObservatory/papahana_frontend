import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { CompactType, getLayoutItem, resolveCollision, sortLayoutItems } from './react-grid-layout-utils';
import { Accordian } from './accordian_form';
import TemplateForm from '../forms/template_form';
import { ObservationBlock, OBComponentNames, OBComponent } from '../../typings/papahana';

const rowHeight: number = 45
const nCols: number = 3
const AutoGridLayout = WidthProvider(RGL)

const obComponentNames: OBComponentNames[] = ['acquisition', 'sequences', 'target']

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
    console.log('creating initial layout')
    let lo = items.map((item: string, idx: number) => {
           const row = Math.floor(idx / 3)
           const col = idx % 3
        return { i: item, x: col, y: row, w: 1, h: 1 } as Layout
    })
    return lo
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

const parseOB = (ob: ObservationBlock): Partial<ObservationBlock> => {
    // return the components that will generate forms
    let forms: { [k: string]: any } = {}
    Object.keys(ob).forEach((cn: string) => {
        if (obComponentNames.indexOf(cn as any) > -1) {
            if (cn === 'sequences') {
                const seq = ob.sequences as any
                for (let idx = 0; idx < seq.length; idx++) {
                    const sci_name = 'science_' + JSON.stringify(idx) as string
                    forms[sci_name] = seq[idx]
                }
            }
            else {
                forms[cn] = ob[cn as keyof ObservationBlock]
            }
        }
    })
    return forms
}

export default function RGLFormGrid(props: FormGridProps) {

    const classes = useStyles()
    const defaultRowHeight = calcRowHeight(rowHeight)
    let myRef = React.useRef(null)

    const forms = parseOB(props.ob)
    const formNames = Object.keys(forms)
    console.log(`templateTypes in ob ${formNames}`)
    let init_layout = initLayout(formNames) //todo: findout why useState is sometimes doesn't return anything
    init_layout = sortLayoutItems(init_layout, props.compactType)
    console.log(init_layout)

    
    // const [layout, setLayout] = React.useState([] as Layout[])
    // setLayout(init_layout)

    const [accordItems, setAccordItems] = React.useState<JSX.Element[]>([])
    
    const [layout, setLayout] = React.useState(init_layout)
    
    React.useEffect(() => {
        if (layout) {
            console.log('inside RGLFormGrid. init accoridan items')
            const newAccordItems = makeAccordItems(layout, forms)
            setAccordItems(newAccordItems)
        }
    }, [ props.ob, layout ])


    const makeAccordItems = (lo: Layout[], forms: Partial<ObservationBlock>) => {
        console.log('resolving collisions')
        lo = resolveCollision(lo, lo[0], defaultRowHeight, lo[0].y, 'y') // push other items down
        const accordItems = lo.map((lo: Layout) => {
            const componentName = lo.i as OBComponentNames
            const formData = forms[componentName as keyof ObservationBlock] as OBComponent
            const formChild = createForm(componentName, formData)
            return createAccordianDiv(lo, formChild)
        })
        return accordItems
    }

    const createForm = (componentName: OBComponentNames, formData: OBComponent): JSX.Element => {
        return <TemplateForm updateOB={updateOB} componentName={componentName} formData={formData} />
    }

    const updateOB = (componentName: OBComponentNames, formData: OBComponent) => {
        console.log(`component: ${componentName} getting updated`)
        let newOB = { ...props.ob } as ObservationBlock | any
        newOB[componentName as keyof ObservationBlock] = formData
        props.setOB(newOB)
    }


    const handleExpand = (id: string, newHeight: number, expanded=true) => {
        let newRowHeight = 1
        console.log(`expanded: ${expanded}`)
        if (expanded) { //assumes animation completed
            newRowHeight = calcRowHeight(newHeight)
        }
        let newItem = getLayoutItem(layout, id)

        //get new layout
        let nlayout = layout.filter((item: Layout) => {
            return !item.i.includes(id)
        })
        newItem.h = newRowHeight
        nlayout.push(newItem)
        nlayout = sortLayoutItems(nlayout, props.compactType)
        console.log(layout)
        nlayout = resolveCollision(nlayout, newItem, newRowHeight, newItem.y, 'y') // push other items down

        if (myRef) { // update the AutoGridLayout by using a ref 
            const mf = myRef.current as any
            mf.setState({ layout: JSON.parse(JSON.stringify(nlayout)), rowHeight: rowHeight })
            setLayout(JSON.parse(JSON.stringify(nlayout)))
            //layout = nlayout
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

    const handleLayoutChange = (nlayout: Layout[]
    ) => {
        console.log("match auto grid layout with ob form layout triggered")
        console.log(nlayout)
        const mf = myRef.current as any
        // layout = nlayout
        setLayout(JSON.parse(JSON.stringify(nlayout)))
        // mf.setState({ layout: JSON.parse(JSON.stringify(layout)), rowHeight: rowHeight })
    }

    return (
        <div className={classes.templateAccordian} style={{ position: "relative" }}>
            <AutoGridLayout
                ref={myRef}
                className="layout"
                cols={nCols}
                rowHeight={rowHeight}
                draggableHandle=".dragme"
                // compactType={props.compactType}
                isBounded={true}
                resizeHandles={['se']}
                containerPadding={[0, 0]}
                onLayoutChange={ handleLayoutChange }
            >
                {accordItems}
            </AutoGridLayout>
        </div>
    )
}

RGLFormGrid.defaultProps = defaultProps;