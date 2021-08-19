import React from 'react';
import { get_instrument_package } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage, InstrumentPackageTemplates, TemplateEntry } from '../../typings/papahana';
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DropDown from './../drop_down'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
    }
}))

interface Props {
    instrument: Instrument;
    obSequences: string[];
}

//todo: get working
const parse_template_list = (templateList: any) => {
    let menuItems = [] as any
    let idx = 0
    Object.entries(templateList).forEach(([key, templateArr]) => {
        const lsh = <ListSubheader>{key}</ListSubheader>
        // menuItems.push(lsh)
        const ta = templateArr as string[]
        ta.forEach((templateName: string) => {
            const mi = <MenuItem value={idx} key={templateName}>{templateName}</MenuItem>
            menuItems.push(mi)
            idx = idx + 1;
        })
    })
    return (menuItems)
}

const parse_template_arr = (arr: TemplateEntry[]): string[] => {
    return (
        arr.map((tname: any, idx: number) => {
            return tname.name 
        })
    )
}

const create_drop_down_list = (templates: InstrumentPackageTemplates, obSequences: string[]): [string[], boolean[]] => {
        let tList: string[] = []
        let dList: boolean[] = []
        Object.entries(templates).forEach(([templateType, templateArr]: any) => {
            const template = parse_template_arr(templateArr)
            const disabled = template.map( () => obSequences.includes(templateType) )
            tList = tList.concat(template)
            dList = dList.concat(disabled)
        })
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