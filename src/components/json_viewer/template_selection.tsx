import React from 'react';
import { get_instrument_package } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage, InstrumentPackageTemplates, ObservationBlock, Template, TemplateEntry } from '../../typings/papahana';
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import DropDown from './../drop_down'
import { get_template } from "../../api/utils";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
    }
}))

interface Props {
    instrument: Instrument;
    obSequences: string[];
    addSeq: Function;
}

const parse_template_arr = (arr: TemplateEntry[]): string[] => {
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

const create_drop_down_list = (instTemplates: InstrumentPackageTemplates, obSequences: string[]): [string[], boolean[]] => {
    let tList: string[] = []
    let dList: boolean[] = []
    Object.entries(instTemplates).forEach(([templateType, templateArr]: any) => {
        const templateNames = parse_template_arr(templateArr)
        const disabled = templateNames.map(() => obSequences.includes(templateType))
        tList = tList.concat(templateNames)
        dList = dList.concat(disabled)
    })
    add_targets(tList, dList, obSequences)
    return [tList, dList]
}

export default function TemplateSelection(props: Props) {

    const classes = useStyles()
    const [templates, setTemplates] = useState({} as InstrumentPackageTemplates)
    const [templateList, setTemplateList] = useState([] as string[])
    const [disabledArr, setDisabledArr] = useState([] as boolean[])

    useEffect(() => {
        console.log('inside ts instrument change')
        get_instrument_package(props.instrument)
            .then((ip: InstrumentPackage) => {
                const [tList, dList] = create_drop_down_list(ip.templates, props.obSequences)
                setTemplates(ip.templates)
                setTemplateList(tList)
                setDisabledArr(dList)
            })
    }, [props.instrument])

    useEffect(() => {
        console.log('inside ts ob sequence change')
        const [tList, dList] = create_drop_down_list(templates, props.obSequences)
        setTemplateList(tList)
        setDisabledArr(dList)
    }, [props.obSequences])


    const handleChange = (templateName: string) => {
        console.log(`${templateName}`)
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