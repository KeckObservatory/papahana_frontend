import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { CompactType, getLayoutItem, resolveCollision, sortLayoutItems } from './react-grid-layout-utils';
import { AccordionForm } from './accordion_form';
import TemplateForm from '../forms/template_form';
import { ObservationBlock, OBComponentNames, OBComponent, Science, BaseSequence, OBSequence } from '../../typings/papahana';

const ROW_HEIGHT: number = 45
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
            minHeight: ROW_HEIGHT
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
    return Math.ceil(height / ROW_HEIGHT)
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
    const defaultRowHeight = calcRowHeight(ROW_HEIGHT)
    let myRef = React.useRef(null)

    const obComponents: Partial<ObservationBlock> = parseOB(props.ob)
    const formNames = Object.keys(obComponents)
    let init_layout = initLayout(formNames) //todo: findout why useState is sometimes doesn't return anything
    init_layout = sortLayoutItems(init_layout, props.compactType)

    const [accordItems, setAccordItems] = React.useState<JSX.Element[]>([])
    const [layout, setLayout] = React.useState(init_layout)


    // After component rendered
    React.useEffect(() => {
        console.log(`init layout ${JSON.stringify(layout)}`)
        if (layout.length > 0) {
            const newAccordItems = makeAccordItems(layout, obComponents)
            console.log('setting accord items')
            setAccordItems(newAccordItems)
            const mf = myRef.current as any
            console.log(`myRef.layout ${mf.layout}`)
            mf.setState({ layout: JSON.parse(JSON.stringify(layout)) })
        }
    }, [])

    const makeAccordItems = (lo: Layout[], obComps: Partial<ObservationBlock>) => {
        // console.log('resolving collisions')
        lo = resolveCollision(lo, lo[0], defaultRowHeight, lo[0].y, 'y') // push other items down
        const accordItems = lo.map((lo: Layout) => {
            const componentName = lo.i as OBComponentNames
            const obComponent = obComps[componentName as keyof ObservationBlock] as OBComponent
            const formChild = createForm(componentName, obComponent)
            return createAccordianDiv(lo, formChild)
        })
        return accordItems
    }

    const updateOBSequence = (componentName: string, ob: ObservationBlock, formData: OBSequence):ObservationBlock => {
        let newOb = { ...ob }
        //get science idx from name
        const idx = JSON.parse(componentName.substring(componentName.indexOf('_') + 1))
        let seq = ob?.sequences as Science[]
        Object.entries(formData).forEach(([key, value]) => {
            seq[idx].parameters[key] = value
        })
        newOb.sequences = seq
        return newOb 
    }

    const updateOBComponent = (componentName: string, ob: ObservationBlock, formData: {[key: string]: any}): ObservationBlock => {
        let component = ob[componentName as keyof ObservationBlock] as BaseSequence 
        let params = component.parameters 
        // let params = newComponent.parameters
        Object.entries(formData).forEach(([key, value]) => {
            params[key] = value
        })
        component.parameters = params
        ob[componentName as keyof ObservationBlock] = component as any 
        return ob as ObservationBlock
    }


    const updateOB = (componentName: OBComponentNames, formData: OBSequence, newHeight?: number) => {
        console.log(`component: ${componentName} getting updated.`)
        console.log(`component height: ${newHeight}.`)

        if (Object.keys(formData).length > 0) {
            const oldComponent = props.ob[componentName as keyof ObservationBlock] as OBComponent
            let newOb = { ...props.ob }
            //handle sequences
            if (componentName.includes('science')) {
                newOb = updateOBSequence(componentName, newOb, formData)
            }
            else {
                newOb = updateOBComponent(componentName, newOb, formData)
            }
            props.setOB(newOb)
        }
    }

    const handleResize = (componentName: OBComponentNames, newHeight: number, resize: boolean, init:boolean = false) => {
        const newCellHeight = resize? calcRowHeight(newHeight) : 1 
        let newItem = getLayoutItem(layout, componentName)

        //get new layout
        let nlayout = layout.filter((item: Layout) => {
            return !item.i.includes(componentName)
        })

        newItem.h = newCellHeight
        nlayout.push(newItem)
        nlayout = sortLayoutItems([...nlayout], props.compactType)
        nlayout = resolveCollision([...nlayout], newItem, newCellHeight, newItem.y, 'y') // push other items down

        if (myRef) { // update the AutoGridLayout by using a ref 
            const mf = myRef.current as any
            mf.setState({ layout: JSON.parse(JSON.stringify(nlayout)) })
            setLayout(JSON.parse(JSON.stringify(nlayout)))
        }
    }

    const handleLayoutChange = (nlayout: Layout[]) => {
        setLayout(JSON.parse(JSON.stringify(nlayout)))
    }

    const createForm = (componentName: OBComponentNames, obComponent: OBComponent): JSX.Element => {
        return <TemplateForm updateOB={updateOB} componentName={componentName} obComponent={obComponent} />
    }

    const createAccordianDiv = (lo: Layout, formChild: JSX.Element) => {
        return (
            <div data-grid={lo} className={classes.cell} key={lo.i} draggable={true}
                onDragStart={(e: any) => { e.dataTransfer.setData('text/plain', '') }
                }
            >
                <AccordionForm name={lo.i} id={lo.i} handleResize={handleResize}>
                    {formChild}
                </AccordionForm>
            </div>
        )
    }

    return (
        <div className={classes.templateAccordian} style={{ position: "relative" }}>
            <AutoGridLayout
                ref={myRef}
                className="layout"
                cols={nCols}
                rowHeight={ROW_HEIGHT}
                draggableHandle=".dragme"
                compactType={props.compactType}
                // autoSize={true}
                isBounded={true}
                resizeHandles={['se']}
                containerPadding={[5, 5]}
                onLayoutChange={handleLayoutChange}
            >
                {accordItems}
            </AutoGridLayout>
        </div>
    )
}

RGLFormGrid.defaultProps = defaultProps;