import React, { useEffect, useState } from 'react';
import { get_select_funcs } from '../../../api/ApiRoot';
import { get_template } from '../../../api/utils';
import { Template } from '../../../typings/papahana';
import DropDown from '../../drop_down';
import { State } from './wnc_stepper_dialog_content';

interface Props {
    rows: Array<object>
    parentState: State
    setParentState: Function
}

const get_template_list = async (rows: Array<any>) => {
    //you can always add targets
    let templateList: string[] = ['sidereal_target', 'non_siderial_target', 'multi_object_target']
    const instruments = new Set(rows.map(row => row.instrument)) as any
    if (instruments.size === 1) {
        const inst = instruments.entries().next().value[0]
        const ip = await get_select_funcs.get_instrument_package(inst.toUpperCase())
        //make templateNames entries unique
        templateList= [...templateList, ...Object.keys(ip.template_list)]
        const templateListSet = new Set(templateList)
        templateList= Array.from(templateListSet)
    }
    return templateList
}

const TemplateSelection = function (props: Props) {
    const [templateList, setTemplateList] = useState([] as string[])
    useEffect(() => {
        get_template_list(props.rows).
            then((tpNames: string[]) => {
                console.log(tpNames)
                setTemplateList(tpNames)
            })
    }, [])

    const handleChange = (templateName: string) => {

        get_template(templateName).then((template: Template) => {
            console.log('template name created', template)
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
            props.setParentState({
                template,
                id: templateName,
                obComponent: seq,
            })
        })
    }

    return (
        <DropDown
            arr={templateList}
            value={props.parentState.id}
            handleChange={handleChange}
            placeholder={'Template'}
            label={'Select Template to add'} 
            />
    )
}

export default TemplateSelection 