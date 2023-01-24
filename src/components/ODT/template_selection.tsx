import React from 'react';
import { get_instrument_package } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage, InstrumentPackageTemplates, Template} from '../../typings/papahana';
import DropDown from '../drop_down'
import { get_template } from "../../api/utils";

interface Props {
    instrument: Instrument;
    obSequences: string[];
    addSeq: Function;
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
    let templateList: string[] = []
    let disList: boolean[] = []
    Object.entries(instTemplates).forEach(([templateName, templateID]: any) => {
        const disabled = check_disabled(templateName, obSequences) 
        templateList.push(templateName)
        disList.push(disabled)
    })
    return [templateList, disList]
}

export default function TemplateSelection(props: Props) {

    const [templates, setTemplates] = useState({} as InstrumentPackageTemplates)
    const [templateList, setTemplateList] = useState([] as string[])
    const [disabledArr, setDisabledArr] = useState([] as boolean[])

    useEffect(() => {
        get_instrument_package(props.instrument)
            .then((ip: InstrumentPackage) => {
                const [templateList, disList] = create_drop_down_list(ip.template_list, props.obSequences)
                setTemplates(ip.template_list)
                setTemplateList(templateList)
                setDisabledArr(disList)
            })
    }, [props.instrument])

    useEffect(() => {
        const [templateList, disList] = create_drop_down_list(templates, props.obSequences)
        setTemplateList(templateList)
        setDisabledArr(disList)
    }, [props.obSequences])


    const handleChange = (templateName: string) => {
        console.log('template name: ', templateName, 'instrument', props.instrument)
        get_template(templateName, props.instrument).then((template: Template) => {
            console.log('template name created', templateName)
            let seq = {
                'metadata': template.metadata,
            } as Partial<Template> 
            if (templateName.includes('common') ) {
              seq['detector_parameters'] = {}
              seq['instrument_parameters'] = {}
              seq['tcs_parameters'] = {}
            }
            else { 
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
            label={'Select Template to add'} 
            />
            )
}

TemplateSelection.defaultProps = {
    obSequences: []
}