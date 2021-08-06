import React from 'react';
import { get_instrument_package } from '../../api/utils'
import { useState, useEffect } from 'react';
import { Instrument, InstrumentPackage } from '../../typings/papahana';
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
}

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

const parse_submenu = (key: string, arr: any) => {
    return (
        arr.map((tname: any, idx: number) => {
            return tname.name
        })
    )
}

export default function TemplateSelection(props: Props) {

    const classes = useStyles()
    const [templateList, setTemplateList] = useState([] as string[])
    useEffect(() => { //run when props.observer_id changes
        get_instrument_package(props.instrument)
            .then((ip: InstrumentPackage) => {
                let tList: string[] = []
                Object.entries(ip.templates).forEach(([k, v]: any) => {
                    console.log(k)
                    console.log(v)
                    tList = tList.concat(parse_submenu(k, v))
                })
                setTemplateList(tList)
            })
    }, [props.instrument])

    const handleChange = (templateName: string) => {
        console.log(`${templateName}`)
    }

    return (
        <DropDown
            arr={templateList}
            handleChange={handleChange}
            placeholder={'Template'}
            label={'Select Template to add'} />)
}