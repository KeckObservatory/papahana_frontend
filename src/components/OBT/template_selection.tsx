import React from 'react';
import { get_instrument_package } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage, InstrumentPackageTemplates, Template} from '../../typings/papahana';
import { makeStyles } from '@mui/styles'
import DropDown from '../drop_down'
import { get_template } from "../../api/utils";

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
    }
}))

interface Props {
    instrument: Instrument;
    obSequences: string[];
    addSeq: Function;
}

const parse_template_arr = (arr: string[]): string[] => {
    return (
        arr.map((tname: any, idx: number) => {
            return tname.name
        })
    )
}

const add_targets = (tList: string[], dList: boolean[], obSequences: string[]):void  => {
    //todo: get list of targets from api
    const targetTemplates = ['sidereal_target','non_sidereal_target', 'multi_object_target' ]
    targetTemplates.forEach( (tgtName: string) => {
        tList.push(tgtName)
        const disabled = obSequences.includes('target')
        dList.push(disabled)
    })
}

const create_drop_down_list = (instTemplates: InstrumentPackageTemplates, obSequences: string[]): [string[], boolean[], string[]] => {
    let tList: string[] = []
    let dList: boolean[] = []
    let idList: string[] = []
    Object.entries(instTemplates).forEach(([templateName, templateID]: any) => {
        const disabled = obSequences.includes(templateName)
        tList.push(templateName)
        dList.push(disabled)
        idList.push(templateID) 
    })
    add_targets(tList, dList, obSequences)
    return [tList, dList, idList]
}

export default function TemplateSelection(props: Props) {

    const classes = useStyles()
    const [templates, setTemplates] = useState({} as InstrumentPackageTemplates)
    const [templateList, setTemplateList] = useState([] as string[])
    const [disabledArr, setDisabledArr] = useState([] as boolean[])
    const [templateIdList, setTemplateIdList] = useState([] as string[])

    useEffect(() => {
        get_instrument_package(props.instrument)
            .then((ip: InstrumentPackage) => {
                const [tList, dList, idList] = create_drop_down_list(ip.template_list, props.obSequences)
                setTemplates(ip.template_list)
                setTemplateList(tList)
                setDisabledArr(dList)
                setTemplateIdList(idList)
            })
    }, [props.instrument])

    useEffect(() => {
        const [tList, dList, idList] = create_drop_down_list(templates, props.obSequences)
        setTemplateList(tList)
        setDisabledArr(dList)
        setTemplateIdList(idList)
    }, [props.obSequences])


    const handleChange = (templateName: string) => {
        console.log(templateName, 'templateName')
        get_template(templateName).then((template: Template) => {
            let seq = {
                'metadata': template.metadata,
                'parameters': {},
                'template_id': ''
            }
            props.addSeq(seq)
        })
    }

    return (
        <DropDown
            arr={templateList}
            disabledArr={disabledArr}
            handleChange={handleChange}
            placeholder={'Template'}
            label={'Select Template to add'} />)
}

TemplateSelection.defaultProps = {
    obSequences: []
}