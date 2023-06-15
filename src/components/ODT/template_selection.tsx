import React from 'react';
import { get_template_metadata } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage, InstrumentPackageTemplates, Template, TemplateMetadata} from '../../typings/papahana';
import DropDown from '../drop_down'
import { get_template } from "../../api/utils";
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

interface Props {
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

const create_drop_down_list = (templateMetadata: TemplateMetadata[], obSequences: string[]): [string[], boolean[]] => {
    let templateList: string[] = []
    let disList: boolean[] = []
    console.log('templateMetadata', templateMetadata)
    templateMetadata.forEach((tm) => {
        const disabled = check_disabled(tm.name, obSequences) 
        templateList.push(tm.ui_name)
        disList.push(disabled)
    })
    return [templateList, disList]
}

export default function TemplateSelection(props: Props) {

    const [templates, setTemplates] = useState([] as TemplateMetadata[])
    const [templateList, setTemplateList] = useState([] as string[])
    const [disabledArr, setDisabledArr] = useState([] as boolean[])
    const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))

    useEffect(() => {
        get_template_metadata(instrument as Instrument)
            .then((templateMetadata: TemplateMetadata[]) => {
                const [templateList, disList] = create_drop_down_list(templateMetadata, props.obSequences)
                setTemplates(templateMetadata)
                setTemplateList(templateList)
                setDisabledArr(disList)
            })
    }, [instrument])

    useEffect(() => {
        const [templateList, disList] = create_drop_down_list(templates, props.obSequences)
        setTemplateList(templateList)
        setDisabledArr(disList)
    }, [props.obSequences])


    const handleChange = (uiName: string) => {
        const tm = templates.find(tm => tm.ui_name === uiName)
        tm && get_template(tm.name, instrument).then((template: Template) => {
            console.log('template name created', tm.name)
            let seq = {
                'metadata': tm,
            } as Partial<Template> 
            if (tm.name.includes('common') ) {
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