import React from 'react';
import { get_instrument_package } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage, InstrumentPackageTemplates, Template} from '../../typings/papahana';
import { makeStyles } from '@mui/styles'
import DropDown from '../drop_down'
import { get_template } from "../../api/utils";

interface Props {
    instrument: Instrument;
    obSequences: string[];
    addSeq: Function;
}

const add_targets = (tList: string[], dList: boolean[], obSequences: string[]):void  => {
    //todo: get list of targets from api
    const targetTemplates = ['sidereal_target','non_sidereal_target', 'multi_object_target' ]
    targetTemplates.forEach( (tgtName: string) => {
        tList.push(tgtName)
        const disabled = check_disabled(tgtName, obSequences)
        dList.push(disabled)
    })
}
const add_common_parameters= (tList: string[], dList: boolean[], obSequences: string[]):void  => {
    const templateName = 'kcwi_common_parameters'
    tList.push(templateName)
    const disabled = check_disabled(templateName, obSequences)
    dList.push(disabled)
}

const check_disabled = (templateName: string, obSequences: string[]) => {
    if (templateName.includes('acq') && obSequences.includes('acquisition') ) {
        return true 
    }
    else if (templateName.includes('common_parameters') && obSequences.includes('common_parameters')) {
        return true
    }
    else if (templateName.includes('target') && obSequences.includes('target')) { 
        return true
    }
    else if (obSequences.includes(templateName)) { //acquistion and science 
        return true
    }
    else {
        return false
    }
}

const create_drop_down_list = (instTemplates: InstrumentPackageTemplates, obSequences: string[]): [string[], boolean[]] => {
    let tList: string[] = []
    let dList: boolean[] = []
    Object.entries(instTemplates).forEach(([templateName, templateID]: any) => {
        const disabled = check_disabled(templateName, obSequences) 
        tList.push(templateName)
        dList.push(disabled)
    })
    add_targets(tList, dList, obSequences)
    add_common_parameters(tList, dList, obSequences)
    return [tList, dList]
}

export default function TemplateSelection(props: Props) {

    const [templates, setTemplates] = useState({} as InstrumentPackageTemplates)
    const [templateList, setTemplateList] = useState([] as string[])
    const [disabledArr, setDisabledArr] = useState([] as boolean[])

    useEffect(() => {
        get_instrument_package(props.instrument)
            .then((ip: InstrumentPackage) => {
                const [tList, dList] = create_drop_down_list(ip.template_list, props.obSequences)
                setTemplates(ip.template_list)
                setTemplateList(tList)
                setDisabledArr(dList)
            })
    }, [props.instrument])

    useEffect(() => {
        const [tList, dList] = create_drop_down_list(templates, props.obSequences)
        setTemplateList(tList)
        setDisabledArr(dList)
    }, [props.obSequences])


    const handleChange = (templateName: string) => {
        get_template(templateName).then((template: Template) => {
            console.log('template name created', templateName)
            let seq = {
                'metadata': template.metadata,
                'template_id': ''
            } as Partial<Template> 
            if (templateName.includes('acq') || templateName.includes('sci') ) {
              seq['parameters'] = {}
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