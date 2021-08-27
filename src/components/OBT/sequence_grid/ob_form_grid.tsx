import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { CompactType, getLayoutItem, resolveCollision, sortLayoutItems } from './react-grid-layout-utils';
import { AccordionForm } from './accordion_form';
import TemplateForm from '../../forms/template_form';
import { ObservationBlock, OBSeqNames, OBComponent, Science, BaseSequence, OBSequence } from '../../../typings/papahana';

const ROW_HEIGHT: number = 45
const nCols: number = 3
const AutoGridLayout = WidthProvider(RGL)

const obComponentNames: OBSeqNames[] = ['acquisition', 'sequences', 'target']

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
            padding: theme.spacing(1),
            margin: theme.spacing(1),
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
    let formNames = Object.keys(obComponents)
    let sequenceLength = props.ob.sequences?.length
    let init_layout = initLayout(formNames) 
    init_layout = sortLayoutItems(init_layout, props.compactType)

    const [accordItems, setAccordItems] = React.useState<JSX.Element[]>([])
    const [layout, setLayout] = React.useState(init_layout)

    const renderAccordItems = (new_layout: any) => {
        if (new_layout.length > 0) {
            const newAccordItems = makeAccordItems(new_layout, obComponents)
            setAccordItems(newAccordItems)
        }
    }

    // After component rendered
    React.useEffect(() => {
        renderAccordItems(layout)
        const mf = myRef.current as any
        mf?.setState({ layout: JSON.parse(JSON.stringify(layout)) })
    }, [])

    // Add new sequence to component
    React.useEffect(() => {
        const obComponents: Partial<ObservationBlock> = parseOB(props.ob)
        const newFormNames = Object.keys(obComponents)
        const newSequenceLength = props.ob.sequences?.length

        //todo: distinguish between form edit and new sequence
        let seqChanged = newFormNames.length > formNames.length || newSequenceLength !== sequenceLength
        // if (seqChanged) {
        if (true) {
            formNames = newFormNames
            sequenceLength = newSequenceLength
            let new_layout = initLayout(formNames) //todo: findout why useState is sometimes doesn't return anything
            setLayout(JSON.parse(JSON.stringify(new_layout)))
            new_layout = sortLayoutItems(new_layout, props.compactType)
            renderAccordItems(new_layout)
            const mf = myRef.current as any
            mf?.setState({ layout: JSON.parse(JSON.stringify(new_layout)) })
        }
    }, [props.ob])


    const makeAccordItems = (lo: Layout[], obComps: Partial<ObservationBlock>) => {
        lo = resolveCollision(lo, lo[0], defaultRowHeight, lo[0].y, 'y') // push other items down
        const accordItems = lo.map((lo: Layout) => {
            const id = lo.i as OBSeqNames
            const obComponent = obComps[id as keyof ObservationBlock] as OBComponent
            const formChild = createForm(id, obComponent)
            return createAccordianDiv(lo, formChild)
        })
        return accordItems
    }

    const updateOBSequence = (seqName: string, ob: ObservationBlock, formData: OBSequence): ObservationBlock => {
        let newOb = { ...ob }
        //get science idx from name
        const idx = JSON.parse(seqName.substring(seqName.indexOf('_') + 1))
        let seq = ob?.sequences as Science[]
        Object.entries(formData).forEach(([key, value]) => {
            seq[idx].parameters[key] = value
        })
        newOb.sequences = seq
        return newOb
    }

    const updateOBComponent = (seqName: string, ob: ObservationBlock, formData: { [key: string]: any }): ObservationBlock => {
        let component = ob[seqName as keyof ObservationBlock] as BaseSequence
        let params = component.parameters
        // let params = newComponent.parameters
        Object.entries(formData).forEach(([key, value]) => {
            params[key] = value
        })
        component.parameters = params
        ob[seqName as keyof ObservationBlock] = component as any
        return ob as ObservationBlock
    }


    const updateOB = (seqName: OBSeqNames, formData: OBSequence, newHeight?: number) => {
        if (newHeight) { handleResize(seqName, newHeight, true, false) }
        if (Object.keys(formData).length > 0) {
            let newOb = { ...props.ob }
            //handle sequences
            if (seqName.includes('science')) {
                newOb = updateOBSequence(seqName, newOb, formData)
            }
            else {
                newOb = updateOBComponent(seqName, newOb, formData)
            }
            props.setOB(newOb)
        }
    }

    const deleteSequence = (seqName: OBSeqNames, idx?: number) => {
        const newOB = { ...props.ob } as any
        const deleteElem = Number.isInteger(idx)
        if (deleteElem) {
            const newSeq = newOB[seqName].splice(idx, 1)
            const deleteArr = newOB[seqName].length < 1
            if (deleteArr) {
                console.log('deleting empty sequences array')
                delete newOB[seqName]
            }
            else {
                newOB[seqName].splice(idx, 1)
                console.log('new array sequence')
                console.log(newOB[seqName])
            }
        }
        else {
            console.log('deleting non array item')
            delete newOB[seqName]
        }
        props.setOB(newOB)
    }

    const handleResize = (seqName: OBSeqNames, newHeight: number, resize: boolean, init: boolean = false) => {
        const newCellHeight = resize ? calcRowHeight(newHeight) : 1
        let newItem = getLayoutItem(layout, seqName)
        newItem = newItem.i ? newItem : { h: newItem.h, w: 1, x: 0, y: 0, i: seqName }

        //get new layout
        // console.log(`handling resize for ${seqName}`)
        // console.log('nlayout before')
        // console.log(layout)
        // console.log(newItem)
        let nlayout = layout.filter((item: Layout) => {
            return !item.i.includes(seqName)
        })

        newItem.h = newCellHeight
        nlayout.push(newItem)
        // console.log('nlayout before')
        // console.log(nlayout)
        nlayout = sortLayoutItems([...nlayout], props.compactType)
        nlayout = resolveCollision([...nlayout], newItem, newCellHeight, newItem.y, 'y') // push other items down
        // console.log('after')
        // console.log(nlayout)

        if (myRef) { // update the AutoGridLayout by using a ref 
            const mf = myRef.current as any
            mf.setState({ layout: JSON.parse(JSON.stringify(nlayout)) })
            setLayout(JSON.parse(JSON.stringify(nlayout)))
        }
    }

    const handleLayoutChange = (nlayout: Layout[]) => {
        setLayout(JSON.parse(JSON.stringify(nlayout)))
    }

    const createForm = (id: string, obComponent: OBComponent): JSX.Element => {
        return <TemplateForm id={id} updateOB={updateOB} obComponent={obComponent} />
    }

    const createAccordianDiv = (lo: Layout, formChild: JSX.Element) => {
        const handleDelete = () => {
            if (lo.i.includes('science')) {
                const idx = parseInt(lo.i.split('_')[1], 10) as number
                deleteSequence('sequences' as OBSeqNames, idx)
            }
            else {
                deleteSequence(lo.i as OBSeqNames)
            }
        }
        return (
            <div data-grid={lo} className={classes.cell} key={lo.i} draggable={true}
                onDragStart={(e: any) => { e.dataTransfer.setData('text/plain', '') }
                }
            >
                <AccordionForm handleDelete={handleDelete} name={lo.i} id={lo.i} handleResize={handleResize}>
                    {formChild}
                </AccordionForm>
            </div>
        )
    }

    return (
        <div className={classes.templateAccordian} style={{ position: "relative" }}>
            { layout.length>0 &&
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
}
        </div>
    )
}

RGLFormGrid.defaultProps = defaultProps;